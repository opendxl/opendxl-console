from __future__ import absolute_import
import base64
import uuid

import pkg_resources
import tornado
from tornado.web import RequestHandler, Application, StaticFileHandler
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

from dxlclient.client_config import DxlClientConfig

import dxlconsole
from .modules.certificates.module import CertificateModule
from .modules.broker.module import BrokerModule
from .modules.monitor.module import MonitorModule
from .handlers import BaseRequestHandler

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
                self.set_secure_cookie("user", username)
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
            self.set_secure_cookie("user", self.get_argument("username"))
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
        self.clear_cookie("user")
        self.redirect("/login")


class WebConsole(Application):
    """
    The web console application
    """

    def __init__(self, app):
        """
        Constructor parameters:

        :param app: The OpenDXL bootstrap application that the console is a part of
        """
        self._bootstrap_app = app
        self._modules = [
            MonitorModule(self),
            CertificateModule(self),
            BrokerModule(self)
        ]

        handlers = [
            (r'/public/(.*)', ConsoleStaticFileRequestHandler, {'path': ''}),
            (r'/favicon.ico(.*)', ConsoleStaticFileRequestHandler,
             {'path': 'images/favicon.ico'}),
            (r'/login', LoginHandler),
            (r'/logout', LogoutHandler),
            (r'/', ConsoleRequestHandler)
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
