from __future__ import absolute_import
import logging

import tornado
from bs4 import BeautifulSoup
from dxlbootstrap.util import MessageUtils
from dxlclient import Message, json

import dxlconsole.util
from dxlconsole.handlers import BaseRequestHandler

logger = logging.getLogger(__name__)


class MessagesHandler(BaseRequestHandler):
    """
    Handles fetch requests for pending messages.
    """

    # The max size to send down for the details payload
    _MAX_DETAILS_PAYLOAD_LENGTH = 10000

    # The max size to send down for the table payload
    _MAX_TABLE_PAYLOAD_LENGTH = 500

    def __init__(self, application, request, module):
        """
        Constructor parameters:

        :param application: The application associated with the request handler
        :param request: The request
        :param module: The module this request handler is associated with
        """
        super(MessagesHandler, self).__init__(application, request)
        self._module = module

    def data_received(self, chunk):
        """
        Invoked when streamed request data is received

        :param: chunk The next chuck of data
        """
        pass

    @staticmethod
    def escape(html):
        """Returns the given HTML with ampersands, quotes and carets encoded."""
        return html \
            .replace('&', '&amp;') \
            .replace('<', '&lt;') \
            .replace('>', '&gt;') \
            .replace('"', '&quot;') \
            .replace("'", ' &#39;')

    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        """HTTP GET"""
        client_id = self.get_query_argument("clientId", "null")
        if client_id == "null":
            self.write(dxlconsole.util.create_sc_error_response(
                "No client ID sent with request."))
            return

        response_wrapper = dxlconsole.util.create_sc_response_wrapper()

        response = response_wrapper["response"]

        messages = self._module.get_messages(client_id)

        if messages:
            for message in messages:
                # If we have a topic stored as a response for this message ID
                # use it instead of the response topic
                topic = self._module.get_message_topic(message)
                if message.message_type == Message.MESSAGE_TYPE_ERROR:
                    payload = self.escape(message.error_message + " (" + str(
                        message.error_code) + ")")
                    original_payload = payload
                else:
                    decoded_payload = MessageUtils.decode_payload(message)
                    original_payload = decoded_payload
                    try:
                        payload = "<pre><code>" + \
                                  self.escape(
                                      MessageUtils.dict_to_json(
                                          MessageUtils.json_payload_to_dict(
                                              message), True)) \
                                  + "</pre></code>"
                    except Exception:
                        try:
                            xml_payload = BeautifulSoup(original_payload,
                                                        "html.parser")
                            payload = "<pre lang='xml'><code>" + self.escape(
                                xml_payload.prettify()) + "</code></pre>"
                            original_payload = self.escape(original_payload)
                        except Exception as ex:
                            logger.exception(ex)
                            payload = original_payload
                    if len(payload) > self._MAX_DETAILS_PAYLOAD_LENGTH:
                        payload = payload[0:self._MAX_DETAILS_PAYLOAD_LENGTH] + \
                                  " ..."
                    if len(payload) > self._MAX_TABLE_PAYLOAD_LENGTH:
                        original_payload = \
                            original_payload[0:self._MAX_TABLE_PAYLOAD_LENGTH] + \
                            " ..."

                message_type = "Event" if message.message_type == Message.MESSAGE_TYPE_EVENT \
                    else "Response" if message.message_type == Message.MESSAGE_TYPE_RESPONSE \
                    else "Request" if message.message_type == Message.MESSAGE_TYPE_REQUEST \
                    else "Error Response" if message.message_type == Message.MESSAGE_TYPE_ERROR \
                    else "Unknown"

                message_entry = {
                    'topic': topic,
                    'received': '',
                    'id': message.message_id,
                    'type': message_type,
                    'payload': payload,
                    'originalPayload': original_payload,
                    'sourceBroker': message.source_broker_id,
                    'sourceClient': message.source_client_id,
                    'otherFields': "<pre><code>" +
                                   self.escape(MessageUtils.dict_to_json(
                                       message.other_fields, True)) +
                                   "</pre></code>"
                }
                response["data"].append(message_entry)

        self._module.clear_messages(client_id)

        logger.debug(
            "Message handler response: %s", json.dumps(response_wrapper))
        self.write(response_wrapper)
