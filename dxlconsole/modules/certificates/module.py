from codecs import encode
import json
import logging
import os
import socket
import subprocess
import traceback

import pkg_resources
from StringIO import StringIO
from tempfile import NamedTemporaryFile
import tornado
import tornado.httputil
from zipfile import ZipFile

from dxlconsole.handlers import BaseRequestHandler
from dxlconsole.module import Module

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

    def _generate_client_cert(self, subject, temp_key_file, temp_csr_file, temp_cert_file):
        """
        Uses openssl to create a csr with the info provided and sign the cert with the CA key
        The cert is written to the disk using the specified file names
        :param subject:
        :param temp_key_file: temp key file name to persist the key
        :param temp_csr_file: temp csr file to persist the csr
        :param temp_cert_file: temp csr file to persist the certificate
        """

        # Create the private key and csr using openssl command
        # stderr=open(os.devnull, 'wb') to suppress the err output from the openssl command
        rc = subprocess.call(['openssl', 'req', '-nodes', '-new', '-newkey', 'rsa:2048',
                              '-keyout', temp_key_file.name, '-out', temp_csr_file.name, '-subj', subject],
                             stderr=open(os.devnull, 'wb'))
        if rc != 0:
            raise Exception("Error creating key and csr")

        logger.debug("Temp key file:" + temp_key_file.name)
        logger.debug("Temp csr file:" + temp_csr_file.name)

        client_ca_file = self._module.client_ca_cert_file
        client_ca_key_file = self._module.client_ca_key_file

        password = 'pass:' + self._module.client_ca_password
        # Sign the CSR with the client cert file
        rc = subprocess.call(['openssl', 'x509', '-req', '-passin', password,
                              '-CAcreateserial', '-days', '3650',
                              '-CA', client_ca_file, '-CAkey', client_ca_key_file,
                              '-out', temp_cert_file.name, '-in', temp_csr_file.name],
                             stderr=open(os.devnull, 'wb'))

        if rc != 0:
            raise Exception("Error creating certificate")

        logger.debug("Temp cert name:" + temp_cert_file.name)

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

    def _generate_subject_str_from_request(self, request_params):
        """
        Reads the parameters from the requests and builds the subject string for the certificate
        :param request_params: request parameters from the request
        :return: subject string
        """

        if 'cn' in request_params:
            common_name = request_params['cn'].strip()
            if common_name is None:
                raise Exception("No common name specified")

        else:
            raise Exception("No common name specified")

        subject = "/CN=" + common_name

        # this has to be 2 chars
        country = None
        if 'country' in request_params:
            country = request_params['country'].strip()

        # openssl expects Country to have maxsize of 2.
        # asn1 encoding routines:ASN1_mbstring_ncopy:string too long:.\crypto\asn1\a_mbstr.c:158:maxsize=2
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

        if country is not None:
            subject += "/C=" + country
        if state is not None:
            subject += "/ST=" + state
        if locality is not None:
            subject += "/L=" + locality
        if org is not None:
            subject += "/O=" + org
        if ou is not None:
            subject += "/OU=" + ou
        if email is not None:
            subject += "/E=" + email

        return subject

    @tornado.web.authenticated
    def post(self):
        """
        Returns a client cert package using specified values
        """

        # in memory zip file
        in_memory_output_file = None
        # temp files for the key,csr and cert
        temp_key_file = None
        temp_cert_file = None
        temp_csr_file = None

        try:
            request_params = json.loads(self.request.body)

            # generate the cert subject string
            subject = self._generate_subject_str_from_request(request_params)

            temp_key_file = NamedTemporaryFile('w+b', delete=False)
            temp_csr_file = NamedTemporaryFile('w+b', delete=False)
            temp_cert_file = NamedTemporaryFile('w+b', delete=False)

            # generate the cert with the subject string using the temp files above
            self._generate_client_cert(subject, temp_key_file, temp_csr_file, temp_cert_file)

            logger.debug("Updating dxlclient.config information")

            # create the dxlclient.config file
            config_out = self._updateconfig_file()

            # build the zip file in memory that is sent back to the caller
            in_memory_output_file = StringIO()
            zf = ZipFile(in_memory_output_file, mode='w')

            broker_ca_bundle_file = self._module.broker_ca_bundle_file

            try:
                logger.debug("Adding client certificate file to zip")
                zf.write(temp_cert_file.name, arcname=CertificateModule.ZIP_CLIENT_CERT_FILE_NAME)
                logger.debug("Adding client certificate key file to zip")
                zf.write(temp_key_file.name, arcname=CertificateModule.ZIP_CLIENT_KEY_FILE_NAME)
                logger.debug("Adding DXL Broker certificate authority to zip")
                zf.write(broker_ca_bundle_file, arcname=CertificateModule.ZIP_BROKER_CA_BUNDLE_FILE_NAME)
                logger.debug("Adding DXL Config file to zip")
                zf.writestr(CertificateModule.DXL_CONFIG_FILE_NAME, config_out)
            finally:
                zf.close()  # have to close before we read the contents

            in_memory_output_file.seek(0)
            contents = in_memory_output_file.getvalue()

            # write the base64 encoded zip file to the response stream
            self.write(encode(contents, 'base64'))

        except Exception as e:
            if in_memory_output_file is not None:
                in_memory_output_file.close()
            logger.error("Exception while processing generate cert request." + str(e))
            logger.error(traceback.format_exc())
            self.set_status(500)
            self.write("Failed to generate certs:" + str(e))
        finally:
            if temp_key_file is not None:
                temp_key_file.close()
                os.remove(temp_key_file.name)
            if temp_cert_file is not None:
                temp_cert_file.close()
                os.remove(temp_cert_file.name)
            if temp_csr_file is not None:
                temp_csr_file.close()
                os.remove(temp_csr_file.name)
