import pkg_resources

from tornado.web import RequestHandler, Application
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

import dxlconsole
from .modules.certificates.module import CertificateModule
from .modules.broker.module import BrokerModule


class ConsoleStaticFileRequestHandler(RequestHandler):

    def __init__(self, application, request):
        super(ConsoleStaticFileRequestHandler, self).__init__(application, request)

    def get(self, path):
        resource_path = '/'.join(("web", path))
        html = pkg_resources.resource_string(__name__, resource_path)
        self.write(html)


class ConsoleRequestHandler(RequestHandler):

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
        console_html += "console_toolstrip.addMember(isc.ToolStripSpacer.create({space:5}));"
        console_html += \
            "isc.Deck.create({autoDraw:false, ID: 'console_deck', panes: [" + module_names + "] });"
        if first_button:
            console_html += first_button + ".select();"
            console_html += "console_deck.setCurrentPane('" + first_pane + "');"
        console_html += \
            "isc.HLayout.create({ width: '100%', height: '100%', members: ['console_toolstrip', 'console_deck'] });"
        self.write(console_html + "\n</SCRIPT></BODY></HTML>")


class WebConsole(Application):

    def __init__(self):
        self._modules = [
            CertificateModule(self),
            BrokerModule(self)
        ]

        handlers = [
            (r'/public/(.*)', ConsoleStaticFileRequestHandler),
            (r'/', ConsoleRequestHandler)
        ]

        super(WebConsole, self).__init__(handlers)

    @property
    def modules(self):
        return self._modules

    def start(self):
        server = HTTPServer(self)
        server.listen(8080)  # TODO: Set port
        IOLoop.instance().start()
