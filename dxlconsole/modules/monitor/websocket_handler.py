from __future__ import absolute_import
import logging
import tornado
from tornado.websocket import WebSocketHandler
from dxlclient import EventCallback, ResponseCallback

logger = logging.getLogger(__name__)


class _WebSocketEventCallback(EventCallback):
    """
    A DXL event callback to handle all events by adding them to delivery queues
    and notifying the browser through WebSockets.
    """

    def __init__(self, web_socket, module):
        super(_WebSocketEventCallback, self).__init__()
        self._socket = web_socket
        self._module = module

    def on_event(self, event):
        """
        Adds the event to a pending messages queue and notifies the associated
        WebSocket that an event is waiting

        :param event: the incoming event
        """
        logger.debug("Received event on topic: %s", event.destination_topic)
        self._module.queue_message(event, self._socket._client_id)
        self._module.io_loop.add_callback(self._socket.write_message,
                                          u"messagesPending")


class _WebSocketResponseCallback(ResponseCallback):
    """
    A DXL Response callback to handle all responses by adding them to delivery
    queues and notifying the browser through WebSockets.
    """

    def __init__(self, web_socket, module):
        super(_WebSocketResponseCallback, self).__init__()
        self._socket = web_socket
        self._module = module

    def on_response(self, response):
        """
        Adds the response to a pending messages queue and notifies the
        associated WebSocket that a response is waiting

        :param response: the incoming response
        """
        logger.debug(
            "Received response to message: %s", response.request_message_id)
        self._module.queue_message(response, self._socket._client_id)
        self._module.io_loop.add_callback(self._socket.write_message,
                                          u"messagesPending")


class ConsoleWebSocketHandler(WebSocketHandler):
    """
    Handles the WebSocket connection used to notify the client of updates in real time
    """

    def __init__(self, application, request, module):
        super(ConsoleWebSocketHandler, self).__init__(application, request)
        self._event_callback = None
        self._response_callback = None
        self._client = None
        self._client_id = None
        self._module = module

    def get_current_user(self):
        return self.get_secure_cookie("user")

    def data_received(self, chunk):
        pass

    @tornado.web.authenticated
    def open(self, *args, **kwargs):
        client_id = self.get_query_argument("id", "null")
        if client_id == "null":
            logger.error("No client ID sent with web socket connection.")
            return

        logger.debug("Creating web socket for client: %s", client_id)
        self._client_id = client_id
        self._event_callback = _WebSocketEventCallback(self, self._module)
        self._response_callback = _WebSocketResponseCallback(self, self._module)
        self._client = self._module.get_dxl_client(str(client_id))
        self._module.add_web_socket(client_id, self)

        self._client.add_event_callback(None, self._event_callback)
        self._client.add_response_callback(None, self._response_callback)

    def on_message(self, message):
        self._module.client_keep_alive(self._client_id)

    def on_close(self):
        logger.debug("Web socket closed for client: %s", self._client_id)
        if self._client:
            self._client.remove_event_callback(None, self._event_callback)
            self._client.remove_response_callback(None, self._response_callback)

        self._module.remove_web_socket(self._client_id)
