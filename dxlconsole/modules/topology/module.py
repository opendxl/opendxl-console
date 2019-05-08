from __future__ import print_function
from __future__ import absolute_import

import threading
from threading import Thread

import logging

import json

import tornado

import pkg_resources

from dxlclient import EventCallback
from dxlclient.message import Request, Message

from dxlbootstrap.util import MessageUtils

import dxlconsole.util
from dxlconsole.handlers import BaseRequestHandler
from dxlconsole.module import Module

# Configure local logger
logger = logging.getLogger(__name__)


class TopologyModule(Module):
    """
    Module used to display the topology of the DXL fabric
    """

    BROKER_REGISTRY_QUERY_TOPIC = "/mcafee/service/dxl/brokerregistry/query"

    FABRIC_CHANGE_EVENT_TOPIC = "/mcafee/event/dxl/fabricchange"

    # How often(in seconds) to refresh the broker list
    BROKER_UPDATE_INTERVAL = 60

    def __init__(self, app):
        """
        Constructor parameters:

        :param app: The application that the module is a part of
        """
        super(TopologyModule, self).__init__(
            app, "topology", "Fabric Topology",
            "/public/images/topology.png", "topology_layout")

        self.app.dxl_service_client.add_event_callback(
            TopologyModule.FABRIC_CHANGE_EVENT_TOPIC,
            _FabricChangeEventCallback(self))

        self._reconnect_refresh_thread = threading.Thread(
            target=self._refresh_broker_registry)
        self._reconnect_refresh_thread.daemon = True
        self._reconnect_refresh_thread.start()
        self.current_connected_broker = None

    @property
    def content(self):
        """
        The content of the module (JS code)

        :return: The content of the module (JS code)
        """
        return pkg_resources.resource_string(
            __name__, "content.html").decode("utf8")

    @property
    def handlers(self):
        """
        Web (Tornado) handlers for the module

        :return: The web (Tornado) handlers for the module
        """
        return [
            (r'/broker_registry_query', BrokerRegistryQueryHandler, dict(module=self))
        ]

    def get_broker_registry(self, client_id=None):
        """
        Queries the broker for the broker registry and replaces the currently stored one with
        the new results. Notifies all connected web sockets that new broker information
        is available.
        """
        req = Request(TopologyModule.BROKER_REGISTRY_QUERY_TOPIC)

        if client_id:
            req.payload = "{ \"brokerGuid\":\"" + client_id + "\"}"
        else:
            req.payload = "{}"

        # Send the request
        dxl_response = self.app.dxl_service_client.sync_request(req, 5)

        if dxl_response.message_type == Message.MESSAGE_TYPE_ERROR:
            logger.error("Error response returned from the broker registry: %s",
                         dxl_response.error_message)
            return {}

        dxl_response_dict = MessageUtils.json_payload_to_dict(dxl_response)
        logger.info("Broker registry response: %s", dxl_response_dict)

        brokers = {}
        for broker_guid in dxl_response_dict["brokers"]:
            brokers[broker_guid] = dxl_response_dict["brokers"][
                broker_guid]

        self.current_connected_broker = dxl_response.source_broker_id

        return brokers

    def _refresh_broker_registry(self):
        """
        A thread target that will run forever and do a complete refresh of the
        broker list on an interval or if the DXL client reconnects
        """
        while True:
            # Wait for a connect notification from the DXL client or the update interval
            with self.app.dxl_service_client._connected_lock:
                self.app.dxl_service_client._connected_wait_condition.wait(
                    self.BROKER_UPDATE_INTERVAL)
                if self.app.dxl_service_client.connected:
                    logger.info("Refreshing broker registry...")
                    self.update_broker_registry()

    def update_broker_registry(self):
        """
        Updates the broker registry and notifies all clients
        """
        self.get_broker_registry()
        self.app.send_all_web_socket_message(u"brokersUpdated")


class BrokerRegistryQueryHandler(BaseRequestHandler):
    """
    Handles requests to get broker registry output
    """

    def __init__(self, application, request, module):
        super(BrokerRegistryQueryHandler, self).__init__(application, request)
        self._module = module

    def data_received(self, chunk):
        pass

    @tornado.web.authenticated
    def get(self, *args, **kwargs):

        response_wrapper = dxlconsole.util.create_sc_response_wrapper()

        response = response_wrapper["response"]

        query_broker_id = self.get_query_argument("id", None)

        brokers = self._module.get_broker_registry(query_broker_id)

        current_broker = query_broker_id if query_broker_id \
            else self._module.current_connected_broker

        self._build_connected_broker_list(current_broker, brokers, response["data"])

        response['totalRows'] = len(response["data"])
        response["endRow"] = max(0, response['totalRows'] - 1)

        logger.debug("Broker registry handler response: %s", json.dumps(response_wrapper))
        self.write(json.dumps(response_wrapper))

    def _build_connected_broker_list(self, current_broker, brokers, connected_broker_list):
        broker = brokers.pop(current_broker)
        logger.debug("Adding broker, brokerGuid: %s", current_broker)
        entry = {"brokerId": broker.get("guid"),
                 "connectionLimit": str(broker.get("connectionLimit")),
                 "epoName": broker.get("epoName"),
                 "hostname": broker.get("hostname"),
                 "policyHostname": broker.get("policyHostname"),
                 "policyHub": broker.get("policyHub"),
                 "policyIpAddress": broker.get("policyIpAddress"),
                 "policyPort": str(broker.get("policyPort")),
                 "port": str(broker.get("port")),
                 "webSocketPort":
                     str(broker.get("webSocketPort"))
                     if (broker.get("webSocketPort") is not None
                         and broker.get("webSocketPort") != 0)
                     else "",
                 "topicRouting": str(broker.get("topicRouting")),
                 "ttlMins": str(broker.get("ttlMins")),
                 "startTime": broker.get("startTime"),
                 "version": broker.get("version"),
                 "local": broker.get("local"),
                 "bridgeChildren": broker.get("bridgeChildren"),
                 "bridges": broker.get("bridges"),
                 "brokerParentId":
                     broker.get("bridgeChildren")[0] if broker.get("bridgeChildren") else None}

        connected_broker_list.append(entry)

        for connected_broker_guid in broker.get("bridges"):
            if connected_broker_guid not in brokers:
                continue
            self._build_connected_broker_list(connected_broker_guid, brokers, connected_broker_list)


class _FabricChangeEventCallback(EventCallback):
    """
    A DXL event callback to handle fabric change events
    """

    def __init__(self, module):
        super(_FabricChangeEventCallback, self).__init__()
        self._module = module

    def on_event(self, event):
        """
        Notifies all clients that there are changes to the broker registry

        :param event: the incoming event
        """
        fabric_change_event = MessageUtils.json_payload_to_dict(event)
        logger.info("Received broker fabric change event: %s", fabric_change_event)

        # Spawn a new thread to update the broker list as it requires a DXL request
        thread = Thread(target=self._module.update_broker_registry)
        thread.start()
