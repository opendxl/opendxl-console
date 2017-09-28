import json

import logging
import tornado

from dxlconsole.handlers import BaseRequestHandler

logger = logging.getLogger(__name__)

class ServiceUpdateHandler(BaseRequestHandler):
    """
    Handles requests for updates to the service listing
    """

    def __init__(self, application, request, module):
        super(ServiceUpdateHandler, self).__init__(application, request)
        self._module = module

    def data_received(self, chunk):
        pass

    @tornado.web.authenticated
    def get(self):

        # We're only ever one level deep so if a parent is specified return an empty response
        if self.get_query_argument("parentId", "null") != "null":
            self.write(self._module.NO_RESULT_JSON)
            return

        response_wrapper = self._module.create_smartclient_response_wrapper()

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

            for request_topic in service["requestChannels"]:
                entry = {"itemId": service["serviceGuid"] + request_topic,
                         "itemName": request_topic,
                         "parentId": service["serviceGuid"]}
                response["data"].append(entry)

                response['totalRows'] += 1

        response["endRow"] = max(0, response['totalRows'] - 1)
        logger.debug("Service update handler response: %s", json.dumps(response_wrapper))
        self.write(json.dumps(response_wrapper))
