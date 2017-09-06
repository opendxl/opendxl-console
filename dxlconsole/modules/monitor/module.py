import logging

import pkg_resources
import json
import uuid

import tornado.web
import tornado.websocket

from dxlclient.client import DxlClient
from dxlclient.client_config import DxlClientConfig
from dxlclient.callbacks import EventCallback, ResponseCallback
from dxlclient.message import Event, Request, Message
from dxlbootstrap.util import MessageUtils

from dxlconsole.module import Module

# Configure local logger
logger = logging.getLogger(__name__)


class MonitorModule(Module):

    # Request topic for service registry queries
    SERVICE_REGISTRY_QUERY_TOPIC = '/mcafee/service/dxl/svcregistry/query'

    # Event topics for service registry changes
    SERVICE_REGISTRY_REGISTER_EVENT_TOPIC = '/mcafee/event/dxl/svcregistry/register'
    SERVICE_REGISTRY_UNREGISTER_EVENT_TOPIC = '/mcafee/event/dxl/svcregistry/unregister'

    # The cookie to store client IDs in to maintain a session
    CLIENT_COOKIE_KEY = 'client_id'

    # A default SmartClient JSON response to show no results
    NO_RESULT_JSON = u"""{response:{status:0,startRow:0,endRow:0,totalRows:0,data:[]}}"""

    def __init__(self, app):
        super(MonitorModule, self).__init__(
            app, "monitor", "Fabric Monitor", "/public/images/monitor.png", "monitor_layout")

        # dictionary to store DXL Client instances unique to each "session"
        self._client_dict = {}

        # dictionary to store web sockets for each "session"
        self._web_socket_dict = {}

        # dictionary to store incoming messages for each "session"
        self._pending_messages = {}

        # dictionary to cache service state
        self._services = {}

        self._message_id_topics = {}

        self._client_config = DxlClientConfig.create_dxl_config_from_file(self.app.bootstrap_app.client_config_path)

        # DXL Client to perform operations that are the same for all users(svc registry queries)
        self._dxl_service_client = DxlClient(self._client_config)
        self._dxl_service_client.connect()

        self._dxl_service_client.add_event_callback(
            MonitorModule.SERVICE_REGISTRY_REGISTER_EVENT_TOPIC, _ServiceEventCallback(self))
        self._dxl_service_client.add_event_callback(
            MonitorModule.SERVICE_REGISTRY_UNREGISTER_EVENT_TOPIC, _ServiceEventCallback(self))

        self._refresh_all_services()

    @property
    def handlers(self):
        return [
            (r'/update_services', ServiceUpdateHandler, dict(module=self)),
            (r'/subscriptions', SubscriptionsHandler, dict(module=self)),
            (r'/messages', MessagesHandler, dict(module=self)),
            (r'/send_message', SendMessageHandler, dict(module=self)),
            (r'/websocket', WebSocketHandler, dict(module=self))
        ]

    @property
    def content(self):
        content = pkg_resources.resource_string(__name__, "content.html")
        return content.replace("@PORT@", str(self.app.bootstrap_app.port))

    @property
    def services(self):
        return self._services

    @property
    def web_socket_dict(self):
        return self._web_socket_dict

    @property
    def message_id_topics(self):
        return self._message_id_topics

    @property
    def client_config(self):
        return self._client_config

    def get_dxl_client(self, request_handler):
        """
        Retrieves the DxlClient for the given request. If there is not one associated with
        the incoming request it creates a new one and saves the generated client_id as a cookie

        :param request_handler: the handler for the incoming request
        :return: the DxlClient specific to this "session"
        """
        # TODO concurrency
        client_id = request_handler.get_cookie(MonitorModule.CLIENT_COOKIE_KEY)
        if not client_id:
            client_id = str(uuid.uuid4())
            self._create_client_for_connection(client_id)
            request_handler.set_cookie(MonitorModule.CLIENT_COOKIE_KEY, client_id)
        elif not self._client_exists_for_connection(client_id):
            self._create_client_for_connection(client_id)

        client = self._client_dict[client_id]
        if not client.connected:
            client.connect()

        return client

    def _create_client_for_connection(self, client_id):
        """
        Creates a DxlClient and stores it for the give client_id

        :param client_id: the client_id for the DxlClient
        """
        # TODO concurrency
        client = DxlClient(self.client_config)
        client.connect()
        logger.info("Initializing new dxl client for client_id: " + str(client_id))
        self._client_dict[client_id] = client

    def _client_exists_for_connection(self, client_id):
        """
        Checks if there is already an existing DxlClient for the given client_id.

        :param client_id: the ID of the DxlClient to check for
        :return: whether there is an existing DxlClient for this ID
        """
        # TODO concurrency
        return client_id in self._client_dict

    @staticmethod
    def create_smartclient_response_wrapper():
        """
        Creates a wrapper object containing the standard fields required by SmartClient responses

        :return: an initial SmartClient response wrapper
        """
        response_wrapper = {"response": {}}
        response = response_wrapper["response"]
        response["status"] = 0
        response["startRow"] = 0
        response["endRow"] = 0
        response["totalRows"] = 0
        response["data"] = []
        return response_wrapper

    def queue_message(self, message, client_id):
        """
        Adds the given message to the pending messages queue for the give client.

        :param message: the message to enqueue
        :param client_id: the client the message is intended for
        """
        # TODO concurrency
        if client_id not in self._pending_messages:
            self._pending_messages[client_id] = []

        self._pending_messages[client_id].append(message)

    def get_messages(self, client_id):
        """
        Retrieves the messages pending for the given client. This does not clear the queue after retrieving.

        :param client_id: the client to retrieve messages for
        :return: a List of messages for the client
        """
        # TODO concurrency
        if client_id in self._pending_messages:
            return self._pending_messages[client_id]
        return None

    def clear_messages(self, client_id):
        """
        Clears the pending messages for the given client.

        :param client_id: the client to clear messages for
        """
        # TODO concurrency
        self._pending_messages[client_id] = []

    def _refresh_all_services(self):
        req = Request(MonitorModule.SERVICE_REGISTRY_QUERY_TOPIC)

        req.payload = "{}"
        # Send the request
        dxl_response = self._dxl_service_client.sync_request(req, 5)
        dxl_response_dict = MessageUtils.json_payload_to_dict(dxl_response)
        logger.info("Service registry response: " + str(dxl_response_dict))

        for serviceGuid in dxl_response_dict["services"]:
            self._services[serviceGuid] = dxl_response_dict["services"][serviceGuid]

    def get_message_topic(self, message):
        if (message.message_type == Message.MESSAGE_TYPE_RESPONSE
            or message.message_type == Message.MESSAGE_TYPE_ERROR) and \
                        message.request_message_id in self.message_id_topics:
            topic = self.message_id_topics[message.request_message_id]
            del self.message_id_topics[message.request_message_id]
        else:
            topic = message.destination_topic
        return topic


class _ServiceEventCallback(EventCallback):
    """
    A DXL event callback to handle service change events(register and unregister)
    """

    def __init__(self, module):
        super(_ServiceEventCallback, self).__init__()
        self._module = module

    def on_event(self, event):
        """
        Notifies all clients that there are changes to the service registry

        :param event: the incoming event
        """
        service_event = MessageUtils.json_payload_to_dict(event)
        logger.info("Received service registry event: " + str(service_event))
        if event.destination_topic == MonitorModule.SERVICE_REGISTRY_REGISTER_EVENT_TOPIC:
            self._module.services[service_event['serviceGuid']] = service_event
        elif event.destination_topic == MonitorModule.SERVICE_REGISTRY_UNREGISTER_EVENT_TOPIC:
            if service_event['serviceGuid'] in self._module.services:
                del self._module.services[service_event['serviceGuid']]

        for key in self._module.web_socket_dict:
            self._module.web_socket_dict[key].write_message(u"serviceUpdates")


class _WebSocketEventCallback(EventCallback):
    """
    A DXL event callback to handle all events by adding them to delivery queues and notifying the browser
    through WebSockets.
    """

    def __init__(self, web_socket, module):
        super(EventCallback, self).__init__()
        self._socket = web_socket
        self._module = module

    def on_event(self, event):
        """
        Adds the event to a pending messages queue and notifies the associated WebSocket that an event is waiting

        :param event: the incoming event
        """
        logger.debug("Received event: " + event.payload.decode())
        self._module.queue_message(event, self._socket.get_cookie(MonitorModule.CLIENT_COOKIE_KEY))
        self._socket.write_message(u"Messages pending")


class _WebSocketResponseCallback(ResponseCallback):
    """
    A DXL Response callback to handle all responses by adding them to delivery queues and notifying the browser
    through WebSockets.
    """

    def __init__(self, web_socket, module):
        super(ResponseCallback, self).__init__()
        self._socket = web_socket
        self._module = module

    def on_response(self, response):
        """
        Adds the response to a pending messages queue and notifies the associated WebSocket that a response is waiting

        :param response: the incoming response
        """
        logger.debug("Received response: " + response.payload.decode())
        self._module.queue_message(response, self._socket.get_cookie(MonitorModule.CLIENT_COOKIE_KEY))
        self._socket.write_message(u"Messages pending")


class WebSocketHandler(tornado.websocket.WebSocketHandler):
    """
    Handles the WebSocket connection used to notify the client of updates in real time
    """

    def data_received(self, chunk):
        pass

    def __init__(self, application, request, module):
        super(WebSocketHandler, self).__init__(application, request)
        self._event_callback = None
        self._response_callback = None
        self._client = None
        self._module = module

    def open(self):
        self._event_callback = _WebSocketEventCallback(self, self._module)
        self._response_callback = _WebSocketResponseCallback(self, self._module)
        # WebSocketHandlers can not set cookies, so ensure it exists before attempting to get the client
        if self.get_cookie(MonitorModule.CLIENT_COOKIE_KEY):
            self._client = self._module.get_dxl_client(self)
            self._module.web_socket_dict[self.get_cookie(MonitorModule.CLIENT_COOKIE_KEY)] = self
        else:
            self._client = DxlClient(self._module.client_config)
            self._client.connect()

        self._client.add_event_callback(None, self._event_callback)
        self._client.add_response_callback(None, self._response_callback)

    def on_message(self, message):
        pass

    def on_close(self):
        # TODO: Reap stale DXL clients
        # TODO: Reap stale web socket references
        self._client.remove_event_callback(None, self._event_callback)
        self._client.remove_response_callback(None, self._response_callback)
        # self.client.disconnect()


class ServiceUpdateHandler(tornado.web.RequestHandler):
    """
    Handles requests for updates to the service listing
    """

    def __init__(self, application, request, module):
        super(ServiceUpdateHandler, self).__init__(application, request)
        self._module = module

    def data_received(self, chunk):
        pass

    def get(self):
        # We're only ever one level deep so if a parent is specified return an empty response
        if self.get_query_argument("parentId", "null") != "null":
            self.write(MonitorModule.NO_RESULT_JSON)
            return

        response_wrapper = MonitorModule.create_smartclient_response_wrapper()

        response = response_wrapper["response"]

        for serviceGuid in self._module.services:
            service = self._module.services[serviceGuid]
            logger.debug("Adding service, serviceGuid: " + serviceGuid)
            entry = {"itemId": service.get("serviceGuid"),
                     "itemName": service.get("serviceType"),
                     "serviceType": service.get("serviceType"),
                     "managed": str(service.get("managed")),
                     "registrationTime": service.get("registrationTime"),
                     "ttlMins": service.get("ttlMins"),
                     "unauthorizedChannels": service.get("unauthorizedChannels"),
                     "clientGuid": service.get("clientGuid"),
                     "certificates": service.get("certificates"),
                     "requestChannels": service.get("requestChannels"),
                     "brokerGuid": service.get("brokerGuid"),
                     "local": service.get("local"),
                     "metaData": "<pre><code>" + json.dumps(service.get("metaData"), indent=4, sort_keys=True) +
                                 "</code></pre>"}
            response["data"].append(entry)

            response['totalRows'] += 1

            for request_channel in service["requestChannels"]:
                entry = {"itemId": service["serviceGuid"] + request_channel,
                         "itemName": request_channel,
                         "parentId": service["serviceGuid"]}
                response["data"].append(entry)

                response['totalRows'] += 1

        response["endRow"] = max(0, response['totalRows'] - 1)
        logger.debug("Service update handler response: %s", json.dumps(response_wrapper))
        self.write(json.dumps(response_wrapper))


class SubscriptionsHandler(tornado.web.RequestHandler):
    """
    Handles requests for the subscriptions list including fetch, add, and remove.
    """

    def __init__(self, application, request, module):
        super(SubscriptionsHandler, self).__init__(application, request)
        self._module = module

    def data_received(self, chunk):
        pass

    def get(self):
        client = self._module.get_dxl_client(self)

        response_wrapper = MonitorModule.create_smartclient_response_wrapper()

        response = response_wrapper["response"]

        if self.get_query_argument("_operationType") == "add":
            # add operations require an empty response?
            channel = str(self.get_query_argument("channel"))
            client.subscribe(channel)
        elif self.get_query_argument("_operationType") == "remove":
            # remove operations require an empty response?
            channel = str(self.get_query_argument("channel"))
            client.unsubscribe(channel)
        else:
            for subscription in client.subscriptions:
                # don't include the client response channel
                if "/mcafee/client" not in subscription:
                    subscription_entry = {'channel': subscription}
                    response["data"].append(subscription_entry)

            response["endRow"] = len(client.subscriptions) - 1
            response["totalRows"] = len(client.subscriptions) - 1

        logger.debug("Subscription handler response: " + json.dumps(response_wrapper))
        self.write(response_wrapper)


class MessagesHandler(tornado.web.RequestHandler):
    """
    Handles fetch requests for pending messages.
    """

    def __init__(self, application, request, module):
        super(MessagesHandler, self).__init__(application, request)
        self._module = module

    def data_received(self, chunk):
        pass

    def get(self):
        response_wrapper = MonitorModule.create_smartclient_response_wrapper()

        response = response_wrapper["response"]

        messages = self._module.get_messages(self.get_cookie(MonitorModule.CLIENT_COOKIE_KEY))

        if messages:
            for message in messages:
                # If we have a topic stored as a response for this message ID use it instead of the response channel
                topic = self._module.get_message_topic(message)
                if message.message_type == Message.MESSAGE_TYPE_ERROR:
                    payload = message.error_message
                    original_payload = payload
                else:
                    original_payload = MessageUtils.decode_payload(message)
                    try:
                        payload = "<pre><code>" + \
                                  MessageUtils.dict_to_json(MessageUtils.json_payload_to_dict(message), True) + \
                                  "</pre></code>"
                    except:
                        payload = message.payload.decode()

                message_entry = {
                    'channel': topic,
                    'received': '',
                    'id': message.message_id,
                    'type': "Event" if message.message_type == Message.MESSAGE_TYPE_EVENT
                    else "Response" if message.message_type == Message.MESSAGE_TYPE_RESPONSE
                    else "Request" if message.message_type == Message.MESSAGE_TYPE_REQUEST
                    else "Error Response" if message.message_type == Message.MESSAGE_TYPE_ERROR
                    else "Unknown",
                    # TODO: Limit max payload size it will return
                    'payload': payload,
                    'originalPayload': original_payload,
                    'sourceBroker': message.source_broker_id,
                    'sourceClient': message.source_client_id,
                    'otherFields': "<pre><code>" + MessageUtils.dict_to_json(message.other_fields, True) +
                                   "</pre></code>"
                }
                print("appending entry " + str(message_entry))
                response["data"].append(message_entry)

        self._module.clear_messages(self.get_cookie(MonitorModule.CLIENT_COOKIE_KEY))

        logger.debug("Message handler response: " + json.dumps(response_wrapper))
        self.write(response_wrapper)


class SendMessageHandler(tornado.web.RequestHandler):
    """
    Handles post requests to send messages
    """

    def __init__(self, application, request, module):
        super(SendMessageHandler, self).__init__(application, request)
        self._module = module

    def data_received(self, chunk):
        pass

    def post(self):
        client = self._module.get_dxl_client(self)

        try:
            request_params = json.loads(self.request.body)
            if 'type' in request_params:
                message_type = request_params['type']
            else:
                raise Exception("No type specified.")

            if 'channel' in request_params:
                message_channel = request_params['channel']
            else:
                raise Exception("No topic specified.")

            if 'payload' in request_params:
                message_payload = request_params['payload']
            else:
                message_payload = ""

            logger.error(
                "Sending " + message_type + " on topic " + message_channel + " with payload: " + message_payload)
            message_id = None
            if message_type == 'Event':
                event = Event(message_channel)
                event.payload = message_payload
                client.send_event(event)
                message_id = event.message_id
            elif message_type == 'Request':
                req = Request(message_channel)
                req.payload = message_payload
                self._module.message_id_topics[req.message_id] = message_channel
                client.async_request(req)
                message_id = req.message_id

            self.write("Message successfully sent.&nbsp;&nbsp;&nbsp;[ID : " + message_id + "]")
        except Exception as e:
            logger.error("Exception while processing send message request." + str(e))
            self.write("Failed to send message: " + str(e))
