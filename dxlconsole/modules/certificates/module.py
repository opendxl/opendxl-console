import pkg_resources

from dxlconsole.module import Module


class CertificateModule(Module):
    def __init__(self, app):
        super(CertificateModule, self).__init__(
            app, "certificates", "Certificate Management", "/public/images/cert.png", "certs_stack")

    @property
    def content(self):
        return pkg_resources.resource_string(__name__, "content.html")

    @property
    def enabled(self):
        return self.app.bootstrap_app.local_broker

