from __future__ import absolute_import
import base64
import logging
import uuid
import threading

import pkg_resources

import tornado
from tornado.web import RequestHandler, Application, StaticFileHandler
from tornado.httpserver import HTTPServer
from tornado.websocket import WebSocketHandler
from tornado.ioloop import IOLoop

from dxlclient.client_config import DxlClientConfig

import dxlconsole
from .modules.certificates.module import CertificateModule
from .modules.topology.module import TopologyModule
from .modules.broker.module import BrokerModule
from .modules.monitor.module import MonitorModule
from .handlers import BaseRequestHandler

logger = logging.getLogger(__name__)


class ConsoleStaticFileRequestHandler(StaticFileHandler):
    """
    Class that is used to serve up static content in the console
    """

    def data_received(self, chunk):
        """
        Invoked when streamed request data is received

        :param chunk: The next chuck of data
        """
        pass

    @classmethod
    def get_absolute_path(cls, root, path):
        """
        Returns the absolute location of ``path`` relative to ``root``.

        :param root: The root path
        :param path: The path specified
        :return: The absolute location of ``path`` relative to ``root``.
        """

        # This is a bit hackish, but we are controlling how our static pages are
        # served. If a ``root`` is specified, it is used to load from the
        # package resources. If a ``path`` is specified, it is used to load from
        # the package resources. This allows us to specify specific paths via
        # root (favicon, etc.), and also use the incoming path to resolve
        # resources.
        if root:
            resource_path = '/'.join(("web", root))
        else:
            resource_path = '/'.join(("web", path))
        return pkg_resources.resource_filename(__name__, resource_path)

    def validate_absolute_path(self, root, absolute_path):
        """
        Validate and return the absolute path.

        :param root: The root path
        :param absolute_path: The absolute path
        """
        # Use the absolute path we already determined
        return absolute_path


class ConsoleRequestHandler(BaseRequestHandler):
    """
    Handler that returns the content for the console
    """

    def data_received(self, chunk):
        """
        Invoked when streamed request data is received

        :param: chunk The next chuck of data
        """
        pass

    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        """
        HTTP GET
        """
        console_html = pkg_resources.resource_string(
            __name__, "console.html").decode("utf8")
        console_html = console_html.replace("@VERSION@",
                                            dxlconsole.get_version())
        console_html = console_html.replace("@CONSOLE_NAME@",
                                            self.application.bootstrap_app.console_name)
        module_names = ""
        first_button = None
        first_pane = None

        for module in self.application.modules:
            if module.enabled:
                module.on_load(self.request)
                name = module.name
                button_name = name + "_button"
                if not first_button:
                    first_button = button_name
                    first_pane = module.root_content_name
                toolstrip_button = \
                    "isc.ToolStripButton.create({ \
                        autoDraw:false, \
                        ID: '" + button_name + "', \
                        iconWidth:64, \
                        iconHeight:64, \
                        icon: '" + module.get_icon_path + "', \
                        actionType: 'radio', \
                        showClippedTitleOnHover: true, \
                        titleHoverHTML: function() { return '" + module.title + "'; }, \
                        titleClipped: function() { return true; }, \
                        radioGroup: 'console_module', \
                        click: 'console_deck.setCurrentPane(\"" + \
                        module.root_content_name + "\")', \
                    });"
                console_html += "\n" + toolstrip_button
                console_html += "\n" + "console_toolstrip.addMember('" + button_name + "');"
                console_html += module.content
                if module_names:
                    module_names += ","
                module_names += "'" + module.root_content_name + "'"
        console_html += "console_toolstrip.addMember(isc.ToolStripSpacer.create());"
        console_html += "console_toolstrip.addMember('console_version_label');"
        console_html += \
            "isc.Deck.create({autoDraw:false, ID: 'console_deck', panes: [" + module_names + "] });"
        if first_button:
            console_html += first_button + ".select();"
            console_html += "console_deck.setCurrentPane('" + first_pane + "');"
        console_html += \
            "isc.HLayout.create({ width: '100%', height: '100%', " + \
            "members: ['console_toolstrip', 'console_deck'] });"
        self.write(console_html + "\n</SCRIPT></BODY></HTML>")


class LoginHandler(RequestHandler):
    """
    Handler for logging into the console
    """

    def data_received(self, chunk):
        """
        Invoked when streamed request data is received

        :param: chunk The next chuck of data
        """
        pass

    def get(self, *args, **kwargs):
        """
        If used from the browser the login page is displayed. From an OpenDXL
        client ``provisionconfig`` CLI, this will be handled by the certificate
        module
        """
        auth_header = self.request.headers.get('Authorization')
        if auth_header is not None:
            auth_decoded = base64.b64decode(auth_header[6:]).decode('utf8')
            username, password = auth_decoded.split(':', 2)
            details = ""
            for values in self.request.arguments.values():
                details += ",".join([value.decode("utf8") for value in values])
            if username == self.application.bootstrap_app.username and \
                    password == self.application.bootstrap_app.password:
                self.set_secure_cookie(self.application.bootstrap_app.user_cookie_name, username)
                self.redirect(details)
            else:
                self.set_status(401)
                self.write("Invalid credentials.Check username/password")
        else:
            console_html = pkg_resources.resource_string(
                __name__, "login.html").decode("utf8")
            console_html = console_html.replace("@CONSOLE_NAME@",
                                                self.application.bootstrap_app.console_name)
            self.write(console_html)

    def post(self, *args, **kwargs):
        """
        HTTP Post
        """
        name = self.get_argument("username")
        password = self.get_argument("password")
        if name == self.application.bootstrap_app.username and \
                password == self.application.bootstrap_app.password:
            self.set_secure_cookie(self.application.bootstrap_app.user_cookie_name,
                                   self.get_argument("username"))
            self.redirect("/")
        else:
            self.redirect("/login")


class LogoutHandler(RequestHandler):
    """
    Handler for logging out of the console
    """

    def data_received(self, chunk):
        """
        Invoked when streamed request data is received

        :param: chunk The next chuck of data
        """
        pass

    def get(self, *args, **kwargs):
        """
        HTTP GET
        """
        self.clear_cookie(self.application.bootstrap_app.user_cookie_name)
        self.redirect("/login")


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
        return self.get_secure_cookie(self.application.bootstrap_app.user_cookie_name)

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
        self._module.add_web_socket(client_id, self)

    def on_message(self, message):
        self._module.on_web_socket_message(self._client_id, message)

    def on_close(self):
        logger.debug("Web socket closed for client: %s", self._client_id)

        self._module.remove_web_socket(self._client_id, self)


class WebConsole(Application):
    """
    The web console application
    """

    _web_socket_dict_lock = threading.Lock()

    def __init__(self, app):
        """
        Constructor parameters:

        :param app: The OpenDXL bootstrap application that the console is a part of
        """
        self._bootstrap_app = app

        # Store the bootstrap DXL client to allow access for modules
        self._dxl_service_client = self._bootstrap_app.client

        # dictionary to store web sockets for each "session"
        self._web_socket_dict = {}

        # handlers for web socket events
        self._web_socket_event_handlers = []

        self._modules = [
            MonitorModule(self),
            TopologyModule(self),
            CertificateModule(self),
            BrokerModule(self)
        ]

        handlers = [
            (r'/public/(.*)', ConsoleStaticFileRequestHandler, {'path': ''}),
            (r'/favicon.ico(.*)', ConsoleStaticFileRequestHandler,
             {'path': 'images/favicon.ico'}),
            (r'/login', LoginHandler),
            (r'/logout', LogoutHandler),
            (r'/', ConsoleRequestHandler),
            (r'/websocket', ConsoleWebSocketHandler, dict(module=self))
        ]

        settings = {
            "cookie_secret": str(uuid.uuid4()),
            "login_url": "/login",
        }

        for module in self._modules:
            if module.enabled:
                handlers.extend(module.handlers)

        self._io_loop = IOLoop.instance()
        super(WebConsole, self).__init__(handlers, **settings)

    def add_web_socket(self, client_id, web_socket):
        """
        Stores a web socket associated with the given client id

        :param client_id: the client id key the web socket to
        :param web_socket:  the web socket to store
        """
        logger.debug("Adding web socket for client: %s", client_id)
        with self._web_socket_dict_lock:
            self._web_socket_dict[client_id] = web_socket

        for handler in self._web_socket_event_handlers:
            handler.on_web_socket_opened(client_id, web_socket)

    def remove_web_socket(self, client_id, web_socket):
        """
        Removes any web socket associated with the given client_id

        :param web_socket: The web socket to remove
        :param client_id: The client ID
        """
        logger.debug("Removing web socket for client: %s", client_id)
        with self._web_socket_dict_lock:
            self._web_socket_dict.pop(client_id, None)

        for handler in self._web_socket_event_handlers:
            handler.on_web_socket_closed(client_id, web_socket)

    def on_web_socket_message(self, client_id, message):
        """
        Called when a new web socket message is received. Notifies all listeners of
        the message and client

        :param client_id: The client owning the web socket
        :param message: the message received
        """
        for handler in self._web_socket_event_handlers:
            handler.on_web_socket_message(client_id, message)

    def add_web_socket_event_handler(self, handler):
        """
        Adds a new handler for web socket events. Expects a WebSocketEventHandler

        :param handler: a WebSocketEventHandler to handle events
        """
        self._web_socket_event_handlers.append(handler)

    def send_web_socket_message(self, client_id, message):
        """
        Sends a message to the specified web socket

        :param client_id: the client ID owning the desired web socket
        :param message: the message to send
        """
        with self._web_socket_dict_lock:
            self.io_loop.add_callback(
                self._web_socket_dict[client_id].write_message,
                message)

    def send_all_web_socket_message(self, message):
        """
        Sends a message to all active web sockets

        :param message: the message to send
        """
        with self._web_socket_dict_lock:
            for key in self._web_socket_dict:
                try:
                    self.io_loop.add_callback(
                        self._web_socket_dict[key].write_message,
                        message)
                except Exception:
                    pass

    @property
    def dxl_service_client(self):
        """
        Returns the general purpose DXL client for modules

        :return: the general purpose DXL client for modules
        """
        return self._dxl_service_client

    @property
    def bootstrap_app(self):
        """
        Returns the OpenDXL bootstrap application that the console is a part of

        :return: The OpenDXL bootstrap application that the console is a part of
        """
        return self._bootstrap_app

    @property
    def modules(self):
        """
        Returns the Tornado modules that are a part of the console

        :return: The Tornado modules that are a part of the console
        """
        return self._modules

    @property
    def io_loop(self):
        """
        Returns the Tornado IOLoop that the web console uses

        :return: The Tornado IOLoop instance
        """
        return self._io_loop

    def start(self):
        """
        Starts the web console
        """
        client_config = DxlClientConfig.create_dxl_config_from_file(
            self.bootstrap_app.client_config_path)
        http_server = HTTPServer(self, ssl_options={
            "certfile": client_config.cert_file,
            "keyfile": client_config.private_key,
        })
        http_server.listen(self._bootstrap_app.port)
        self._io_loop.start()
