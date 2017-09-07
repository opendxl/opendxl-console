import pkg_resources

from dxlconsole.module import Module


class BrokerModule(Module):

    def __init__(self, app):
        super(BrokerModule, self).__init__(
            app, "broker", "Broker Details", "/public/images/broker.png", "broker_layout" )

    @property
    def content(self):
        return pkg_resources.resource_string(__name__, "content.html")

    @property
    def enabled(self):
        return self.app.bootstrap_app.local_broker

