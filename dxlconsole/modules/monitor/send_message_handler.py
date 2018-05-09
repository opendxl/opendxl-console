from __future__ import absolute_import
import traceback

import logging
import tornado
from dxlclient import Event, Request, json

from dxlconsole.handlers import BaseRequestHandler

logger = logging.getLogger(__name__)


class SendMessageHandler(BaseRequestHandler):
    """
    Handles post requests to send messages
    """

    def __init__(self, application, request, module):
        super(SendMessageHandler, self).__init__(application, request)
        self._module = module

    def data_received(self, chunk):
        pass

    @tornado.web.authenticated
    def post(self, *args, **kwargs):
        try:
            request_params = json.loads(self.request.body.decode("utf8"))

            if 'clientId' in request_params:
                client_id = request_params['clientId']
            else:
                raise Exception("No client ID sent with request.")

            client = self._module.get_dxl_client(str(client_id))

            if 'type' in request_params:
                message_type = request_params['type']
            else:
                raise Exception("No type specified.")

            if 'topic' in request_params:
                message_topic = request_params['topic']
            else:
                raise Exception("No topic specified.")

            if 'payload' in request_params:
                message_payload = request_params['payload']
            else:
                message_payload = ""

            logger.debug(
                "Sending " + message_type + " on topic " + message_topic +
                " with payload: " + message_payload)
            message_id = None
            if message_type == 'Event':
                event = Event(message_topic)
                event.payload = message_payload
                client.send_event(event)
                message_id = event.message_id
            elif message_type == 'Request':
                req = Request(message_topic)
                req.payload = message_payload
                if 'serviceId' in request_params:
                    if request_params['serviceId'] is not None and \
                            request_params['serviceId'] != "":
                        req.service_id = request_params['serviceId']
                self._module.message_id_topics[req.message_id] = message_topic
                client.async_request(req)
                message_id = req.message_id

            self.write("Message successfully sent.&nbsp;&nbsp;&nbsp;[ID : " + message_id + "]")
        except Exception as ex:
            logger.error("Exception while processing send message request. %s",
                         ex)
            logger.error(traceback.format_exc())
            self.write("Failed to send message: " + str(ex))
