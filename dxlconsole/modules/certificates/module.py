import pkg_resources
import logging
import codecs
import zipfile
import json
import uuid
import tornado
import os
import socket
import tornado.httputil
import subprocess
import traceback

from StringIO import StringIO
from os.path import join
from OpenSSL import crypto

from dxlconsole.module import Module
from dxlconsole.handlers import BaseRequestHandler

# Configure local logger
logger = logging.getLogger(__name__)


class CertificateModule(Module):

    # Client certificate file name in the zip file
    ZIP_CLIENT_CERT_FILE_NAME = "client.crt"
    # Client key file name in the zip file
    ZIP_CLIENT_KEY_FILE_NAME = "client.key"
    # Broker CA bundle file name in the zip file
    ZIP_BROKER_CA_BUNDLE_FILE_NAME = "ca-broker.crt"
    # The DXL client configuration file name in the zip file
    DXL_CONFIG_FILE_NAME = "dxlclient.config"

    # Signing digest algorithm
    DIGEST = "sha256"

    #: The name of the "Certificates" section within the application configuration file
    CERTS_CONFIG_SECTION = "Certificates"
    #: The location of the client CA certificate file (used for signing)
    CERTS_CLIENT_CA_CERT_FILE_PROP = "clientCaCertFile"
    #: The location of the client CA key file (used for signing)
    CERTS_CLIENT_CA_KEY_FILE_PROP = "clientCaKeyFile"
    #: The password for the client CA
    CERTS_CLIENT_CA_PASSWORD_PROP = "clientCaPassword"
    #: The location of the broker CA bundle file
    CERTS_BROKER_CA_BUNDLE_FILE_PROP = "brokerCaBundleFile"
    #: The location of the client configuration template file
    CLIENT_CONFIG_TEMPLATE_FILE_PROP = "clientConfigTemplateFile"

    def __init__(self, app):
        super(CertificateModule, self).__init__(
            app, "certificates", "Certificate Management", "/public/images/cert.png", "certs_stack")
        bootstrap_app = self.app.bootstrap_app
        config = bootstrap_app.config

        self._client_ca_cert_file = None
        self._client_ca_key_file = None
        self._client_ca_password = None
        self._broker_ca_bundle_file = None
        self._client_config_template_file = None

        # Client CA certificate file
        try:
            self._client_ca_cert_file = config.get(self.CERTS_CONFIG_SECTION, self.CERTS_CLIENT_CA_CERT_FILE_PROP)
        except Exception:
            pass

        # Client CA key file
        try:
            self._client_ca_key_file = config.get(self.CERTS_CONFIG_SECTION, self.CERTS_CLIENT_CA_KEY_FILE_PROP)
        except Exception:
            pass

        # Client CA password
        try:
            self._client_ca_password = config.get(self.CERTS_CONFIG_SECTION, self.CERTS_CLIENT_CA_PASSWORD_PROP)
        except Exception:
            pass

        # Broker CA bundle file
        try:
            self._broker_ca_bundle_file = config.get(self.CERTS_CONFIG_SECTION, self.CERTS_BROKER_CA_BUNDLE_FILE_PROP)
        except Exception:
            pass

        # Client configuration template file
        try:
            self._client_config_template_file = config.get(self.CERTS_CONFIG_SECTION, self.CLIENT_CONFIG_TEMPLATE_FILE_PROP)
        except Exception:
            pass

    @property
    def client_ca_cert_file(self):
        return self._client_ca_cert_file

    @property
    def client_ca_key_file(self):
        return self._client_ca_key_file

    @property
    def client_ca_password(self):
        return self._client_ca_password

    @property
    def broker_ca_bundle_file(self):
        return self._broker_ca_bundle_file

    @property
    def client_config_template_file(self):
        return self._client_config_template_file

    @property
    def content(self):
        return pkg_resources.resource_string(__name__, "content.html")

    @property
    def enabled(self):
        bootstrap_app = self.app.bootstrap_app

        return \
            bootstrap_app.local_broker and \
            self.client_ca_cert_file and \
            os.path.isfile(self.client_ca_cert_file) and \
            self.client_ca_key_file and \
            os.path.isfile(self.client_ca_key_file) and \
            self.broker_ca_bundle_file and \
            os.path.isfile(self.broker_ca_bundle_file) and \
            self.client_ca_password and \
            self.client_config_template_file and \
            os.path.isfile(self.client_config_template_file)

    @property
    def handlers(self):
        return [
            (r'/generate_cert', GenerateCertHandler, dict(module=self))
        ]


class GenerateCertHandler(BaseRequestHandler):
    """
    Handles post request to generate certs with the provided parameters
    """

    def __init__(self, application, request, module):
        super(GenerateCertHandler, self).__init__(application, request)
        self._module = module
        self._bootstrap_app = application.bootstrap_app

    def data_received(self, chunk):
        pass

    def __generate_client_cert(self, commonname, country=None, state=None, locality=None,
                               orgname=None, orgunit=None, emailaddress=None):
        client_ca_cert_file = self._module.client_ca_cert_file
        client_ca_key_file = self._module.client_ca_key_file
        client_ca_password = self._module.client_ca_password
        broker_ca_bundle_file = self._module.broker_ca_bundle_file

        # load the CA key
        ca_keyfile = None
        try:
            ca_keyfile = open(client_ca_key_file, "rt")
            ca_keyfile_str = ca_keyfile.read()
            self._ca_key = crypto.load_privatekey(crypto.FILETYPE_PEM, ca_keyfile_str, client_ca_password)
        except IOError as e:
            logger.info("Cannot find Certificate Authority key file:" + client_ca_key_file)
            raise e
        finally:
            if ca_keyfile is not None:
                ca_keyfile.close()

        # load the CA cert
        ca_cert_file = None
        try:
            ca_cert_file = open(client_ca_cert_file, "rt")
            ca_cert_file_str = ca_cert_file.read()
            self._ca_cert = crypto.load_certificate(crypto.FILETYPE_PEM, ca_cert_file_str)
        except IOError as e:
            print join("Cannot find Certificate Authority file:", client_ca_cert_file)
            raise e
        finally:
            if ca_cert_file is not None:
                ca_cert_file.close()

        # load the Broker CA cert chain
        ca_certchain_file = None
        try:
            ca_certchain_file = open(broker_ca_bundle_file, "rt")
            self._ca_certchain = ca_certchain_file.read()
        except IOError as e:
            print join("Cannot find Broker Certificate trust store file:", broker_ca_bundle_file)
            raise e
        finally:
            if ca_certchain_file is not None:
                ca_certchain_file.close()

        logger.debug("Gathering certificate information")
        # create a key pair for cert
        bits = 2048
        cert_key = crypto.PKey()
        cert_key.generate_key(crypto.TYPE_RSA, bits)

        # create a csr
        req = crypto.X509Req()
        req_subj = req.get_subject()
        # use the values specified by the user
        req.get_subject().CN = commonname  # we have already checked for none
        if country is not None:
            req_subj.C = country
        if state is not None:
            req_subj.ST = state
        if locality is not None:
            req_subj.L = locality
        if orgname is not None:
            req_subj.O = orgname
        if orgunit is not None:
            req_subj.OU = orgunit
        if emailaddress is not None:
            req_subj.emailAddress = emailaddress
        base_constraints = ([
            crypto.X509Extension("basicConstraints", False, "CA:FALSE")
        ])
        x509_extensions = base_constraints
        req.add_extensions(x509_extensions)

        req.set_pubkey(cert_key)
        req.sign(cert_key, CertificateModule.DIGEST)

        logger.info("Generating cert for subject:" + str(req_subj))

        # create a client cert signed by the ca using the req built above
        cert = crypto.X509()
        cert.set_subject(req_subj)
        # generate a random serial number
        cert.set_serial_number(uuid.uuid4().int)
        # set validity (10 years) from now
        cert.gmtime_adj_notBefore(0)
        # 10 years
        cert.gmtime_adj_notAfter(10 * 365 * 24 * 60 * 60)
        # the issuer is the ca that was loaded earlier
        cert.set_issuer(self._ca_cert.get_subject())
        cert.set_pubkey(cert_key)

        # Sign with CA Key
        cert.sign(self._ca_key, CertificateModule.DIGEST)

        return {'cert': cert, 'key': cert_key}

    def _updateconfig_file(self):

        with open(self._module.client_config_template_file, 'r') as f:
            content = f.read()

        content = content.replace("@BROKER_CA_BUNDLE_FILE@", CertificateModule.ZIP_BROKER_CA_BUNDLE_FILE_NAME)
        content = content.replace("@CLIENT_CERT_FILE@", CertificateModule.ZIP_CLIENT_CERT_FILE_NAME)
        content = content.replace("@CLIENT_KEY_FILE@", CertificateModule.ZIP_CLIENT_KEY_FILE_NAME)

        # Host and IP address from incoming request
        server_host = tornado.httputil.split_host_and_port(self.request.host)[0]
        server_addr = socket.gethostbyname(server_host)
        content = content.replace("@EXTERNAL_BROKER_HOST@", server_host)
        content = content.replace("@EXTERNAL_BROKER_IP@", server_addr)

        # Local docker network
        docker_ip = subprocess.check_output("route -n | awk '/^\s*0.0.0.0/ {print $2}'", shell=True)
        content = content.replace("@DOCKER_BROKER_IP@", docker_ip.strip())
        return content

    @tornado.web.authenticated
    def post(self):
        """ 
        Returns a client cert package using specified values
        """

        in_memory_output_file = None

        try:
            request_params = json.loads(self.request.body)

            if 'cn' in request_params:
                common_name = request_params['cn'].strip()
                if common_name is None:
                    raise Exception("No common name specified")
            else:
                raise Exception("No common name specified")

            # this has to be 2 characters
            country = None
            if 'country' in request_params:
                country = request_params['country'].strip()

            if country is not None and len(str(country)) != 2:
                raise Exception("Country Name has to be 2 characters")

            state = None
            if 'state' in request_params:
                state = request_params['state'].strip()

            locality = None
            if 'locality' in request_params:
                locality = request_params['locality'].strip()

            org = None
            if 'org' in request_params:
                org = request_params['org'].strip()

            ou = None
            if 'ou' in request_params:
                ou = request_params['ou'].strip()

            email = None
            if 'email' in request_params:
                email = request_params['email'].strip()

            certandkey = self.__generate_client_cert(common_name, country, state, locality, org, ou, email)

            logger.debug("Updating dxlclient.config information")
            config_out = self._updateconfig_file()

            # build the zip file in memory
            in_memory_output_file = StringIO()
            zf = zipfile.ZipFile(in_memory_output_file, mode='w')

            try:
                logger.debug("Adding client certificate file to zip")
                zf.writestr(CertificateModule.ZIP_CLIENT_CERT_FILE_NAME,
                            crypto.dump_certificate(crypto.FILETYPE_PEM, certandkey['cert']))
                logger.debug("Adding client certificate key file to zip")
                zf.writestr(CertificateModule.ZIP_CLIENT_KEY_FILE_NAME,
                            crypto.dump_privatekey(crypto.FILETYPE_PEM, certandkey['key']))
                logger.debug("Adding DXL Broker certificate authority to zip")
                zf.writestr(CertificateModule.ZIP_BROKER_CA_BUNDLE_FILE_NAME, self._ca_certchain)
                logger.debug("Adding DXL Config file to zip")
                zf.writestr(CertificateModule.DXL_CONFIG_FILE_NAME, config_out)
            finally:
                zf.close()  # have to close before we read the contents

            in_memory_output_file.seek(0)
            contents = in_memory_output_file.getvalue()

            # write the zip file to the response stream
            self.write(codecs.encode(contents, 'base64'))

        except Exception as e:
            if in_memory_output_file is not None:
                in_memory_output_file.close()
            logger.error("Exception while processing generate cert request." + str(e))
            logger.error(traceback.format_exc())
            self.set_status(500)
            self.write("Failed to generate certs:" + str(e))
