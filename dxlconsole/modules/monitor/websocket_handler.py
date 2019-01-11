from __future__ import absolute_import
import logging
from dxlclient import EventCallback, ResponseCallback

from dxlconsole.handlers import WebSocketEventHandler

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
        self._module.queue_message(event, self._socket.client_id)
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
        self._module.queue_message(response, self._socket.client_id)
        self._module.io_loop.add_callback(self._socket.write_message,
                                          u"messagesPending")


class MonitorWebSocketEventHandler(WebSocketEventHandler):
    """
    Handles the WebSocket events to notify the client when monitor updates are available
    """

    def __init__(self, module):
        WebSocketEventHandler.__init__(self)
        self._module = module

    def on_web_socket_opened(self, client_id, web_socket):
        logger.debug("Initializing web socket for client: %s", client_id)
        web_socket.client_id = client_id
        web_socket.event_callback = _WebSocketEventCallback(web_socket, self._module)
        web_socket.response_callback = _WebSocketResponseCallback(web_socket, self._module)
        web_socket.client = self._module.get_dxl_client(str(client_id))

        web_socket.client.add_event_callback(None, web_socket.event_callback)
        web_socket.client.add_response_callback(None, web_socket.response_callback)

    def on_web_socket_closed(self, client_id, web_socket):
        logger.debug("Web socket closed for client: %s", client_id)
        if web_socket.client:
            web_socket.client.remove_event_callback(None, web_socket.event_callback)
            web_socket.client.remove_response_callback(None, web_socket.response_callback)

    def on_web_socket_message(self, client_id, message):
        self._module.client_keep_alive(client_id)
