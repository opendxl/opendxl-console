import pkg_resources

from tornado.web import RequestHandler, Application, StaticFileHandler
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

from dxlclient.client_config import DxlClientConfig

import dxlconsole
from .modules.certificates.module import CertificateModule
from .modules.broker.module import BrokerModule
from .modules.monitor.module import MonitorModule


class ConsoleStaticFileRequestHandler(StaticFileHandler):

    def data_received(self, chunk):
        pass

    def initialize(self, path, default_filename=None):
        super(ConsoleStaticFileRequestHandler, self).initialize(path, default_filename)

    @classmethod
    def get_absolute_path(cls, root, path):
        resource_path = '/'.join(("web", path))
        return pkg_resources.resource_filename(__name__, resource_path)

    def validate_absolute_path(self, root, absolute_path):
        return absolute_path


class ConsoleRequestHandler(RequestHandler):

    def data_received(self, chunk):
        pass

    def __init__(self, application, request):
        super(ConsoleRequestHandler, self).__init__(application, request)

    def get(self):
        console_html = pkg_resources.resource_string(__name__, "console.html")
        console_html = console_html.replace("@VERSION@", dxlconsole.get_version())
        module_names = ""
        first_button = None
        first_pane = None

        for module in self.application.modules:
            if module.enabled:
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
                        click: 'console_deck.setCurrentPane(\"" + module.root_content_name + "\")', \
                    });"
                console_html += "\n" + toolstrip_button
                console_html += "\n" + "console_toolstrip.addMember('" + button_name + "');"
                console_html += module.content
                if len(module_names) != 0:
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
            "isc.HLayout.create({ width: '100%', height: '100%', members: ['console_toolstrip', 'console_deck'] });"
        self.write(console_html + "\n</SCRIPT></BODY></HTML>")


class WebConsole(Application):

    def __init__(self, app):
        self._bootstrap_app = app
        self._modules = [
            MonitorModule(self),
            CertificateModule(self),
            BrokerModule(self)
        ]

        handlers = [
            (r'/public/(.*)', ConsoleStaticFileRequestHandler, {'path': '__unused__'}),
            (r'/', ConsoleRequestHandler)
        ]

        for module in self._modules:
            if module.enabled:
                handlers.extend(module.handlers)

        super(WebConsole, self).__init__(handlers)

    @property
    def bootstrap_app(self):
        return self._bootstrap_app

    @property
    def modules(self):
        return self._modules

    def start(self):
        client_config = DxlClientConfig.create_dxl_config_from_file(self.bootstrap_app.client_config_path)
        http_server = HTTPServer(self, ssl_options={
            "certfile": client_config.cert_file,
            "keyfile": client_config.private_key,
        })
        http_server.listen(self._bootstrap_app.port)
        IOLoop.instance().start()
