import logging

import tornado
from bs4 import BeautifulSoup
from dxlbootstrap.util import MessageUtils
from dxlclient import Message, json

from dxlconsole.handlers import BaseRequestHandler

logger = logging.getLogger(__name__)


class MessagesHandler(BaseRequestHandler):
    """
    Handles fetch requests for pending messages.
    """

    # The largest payload that will be sent to
    _MAX_PAYLOAD_LENGTH = 500

    def __init__(self, application, request, module):
        super(MessagesHandler, self).__init__(application, request)
        self._module = module

    def data_received(self, chunk):
        pass

    def escape(self, html):
        """Returns the given HTML with ampersands, quotes and carets encoded."""
        return html \
            .replace('&', '&amp;') \
            .replace('<', '&lt;') \
            .replace('>', '&gt;') \
            .replace('"', '&quot;') \
            .replace("'", ' &#39;')

    @tornado.web.authenticated
    def get(self):
        client_id = self.get_query_argument("clientId", "null")
        if client_id == "null":
            self.write(self._module.create_smartclient_error_response("No client ID sent with request."))
            return

        response_wrapper = self._module.create_smartclient_response_wrapper()

        response = response_wrapper["response"]

        messages = self._module.get_messages(client_id)

        if messages:
            for message in messages:
                # If we have a topic stored as a response for this message ID use it instead of the response topic
                topic = self._module.get_message_topic(message)
                if message.message_type == Message.MESSAGE_TYPE_ERROR:
                    payload = self.escape(message.error_message + " (" + str(message.error_code) + ")")
                    original_payload = payload
                else:
                    decoded_payload = MessageUtils.decode_payload(message)
                    if len(decoded_payload) > self._MAX_PAYLOAD_LENGTH:
                        original_payload = decoded_payload[0:self._MAX_PAYLOAD_LENGTH]
                        payload = original_payload
                    else:
                        original_payload = decoded_payload
                        try:
                            payload = "<pre><code>" + \
                                      self.escape(
                                          MessageUtils.dict_to_json(MessageUtils.json_payload_to_dict(message), True)) \
                                      + "</pre></code>"
                        except:
                            try:
                                xml_payload = BeautifulSoup(original_payload, "xml")
                                payload = "<pre lang='xml'><code>" + self.escape(
                                    xml_payload.prettify()) + "</code></pre>"
                                original_payload = self.escape(original_payload)
                            except Exception as e:
                                logger.exception(e)
                                payload = original_payload

                message_entry = {
                    'topic': topic,
                    'received': '',
                    'id': message.message_id,
                    'type': "Event" if message.message_type == Message.MESSAGE_TYPE_EVENT
                    else "Response" if message.message_type == Message.MESSAGE_TYPE_RESPONSE
                    else "Request" if message.message_type == Message.MESSAGE_TYPE_REQUEST
                    else "Error Response" if message.message_type == Message.MESSAGE_TYPE_ERROR
                    else "Unknown",
                    'payload': payload,
                    'originalPayload': original_payload,
                    'sourceBroker': message.source_broker_id,
                    'sourceClient': message.source_client_id,
                    'otherFields': "<pre><code>" +
                                   self.escape(MessageUtils.dict_to_json(message.other_fields, True)) +
                                   "</pre></code>"
                }
                response["data"].append(message_entry)

        self._module.clear_messages(client_id)

        logger.debug("Message handler response: " + json.dumps(response_wrapper))
        self.write(response_wrapper)
