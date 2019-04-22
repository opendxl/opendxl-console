from __future__ import absolute_import
from codecs import encode
from io import BytesIO
import json
import logging
import os
import socket
import subprocess
import re
from tempfile import NamedTemporaryFile
import traceback
from zipfile import ZipFile

import pkg_resources
import tornado
import tornado.httputil

from dxlconsole.handlers import BaseRequestHandler
from dxlconsole.module import Module
from ..._compat import ConfigParser, read_file, StringIO

# Configure local logger
logger = logging.getLogger(__name__)


class CertificateModule(Module):
    """
    Module used to generate client certificates that are compatible with the OpenDXL broker
    """

    # Client certificate file name in the zip file
    ZIP_CLIENT_CERT_FILE_NAME = "client.crt"
    # Client key file name in the zip file
    ZIP_CLIENT_KEY_FILE_NAME = "client.key"
    # Client CA certificate file name in the zip file
    ZIP_CLIENT_CA_CERT_FILE_NAME = "ca-client.crt"
    # Broker certificate file name in the zip file
    ZIP_BROKER_CERT_FILE_NAME = "broker.crt"
    # Broker key file name in the zip file
    ZIP_BROKER_KEY_FILE_NAME = "broker.key"
    # Broker CA list file name in the zip file
    ZIP_BROKER_CA_LIST_FILE_NAME = "ca-brokers.lst"
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
    #: The location of the broker CA key file
    CERTS_BROKER_CA_KEY_FILE_PROP = "brokerCaKeyFile"
    #: The password for the broker CA
    CERTS_BROKER_CA_PASSWORD_PROP = "brokerCaPassword"
    #: The location of the broker CA list file
    CERTS_BROKER_CA_LIST_FILE_PROP = "brokerCaListFile"
    #: The location of the broker state policy file
    CERTS_BROKER_STATE_POLICY_FILE_PROP = "brokerStatePolicyFile"
    #: The location of the client configuration template file
    CLIENT_CONFIG_TEMPLATE_FILE_PROP = "clientConfigTemplateFile"

    def __init__(self, app):
        """
        Constructor parameters:

        :param app: The application that the module is a part of
        """
        super(CertificateModule, self).__init__(
            app, "certificates", "Certificate Management",
            "/public/images/cert.png", "certs_stack")
        bootstrap_app = self.app.bootstrap_app
        config = bootstrap_app.config

        # Client CA certificate file
        try:
            self._client_ca_cert_file = config.get(self.CERTS_CONFIG_SECTION,
                                                   self.CERTS_CLIENT_CA_CERT_FILE_PROP)
        except Exception:
            self._client_ca_cert_file = ""

        # Client CA key file
        try:
            self._client_ca_key_file = config.get(self.CERTS_CONFIG_SECTION,
                                                  self.CERTS_CLIENT_CA_KEY_FILE_PROP)
        except Exception:
            self._client_ca_key_file = ""

        # Client CA password
        try:
            self._client_ca_password = config.get(self.CERTS_CONFIG_SECTION,
                                                  self.CERTS_CLIENT_CA_PASSWORD_PROP)
        except Exception:
            self._client_ca_password = ""

        # Broker CA bundle file
        try:
            self._broker_ca_bundle_file = config.get(self.CERTS_CONFIG_SECTION,
                                                     self.CERTS_BROKER_CA_BUNDLE_FILE_PROP)
        except Exception:
            self._broker_ca_bundle_file = ""

        # Broker CA key file
        try:
            self._broker_ca_key_file = config.get(
                self.CERTS_CONFIG_SECTION, self.CERTS_BROKER_CA_KEY_FILE_PROP)
        except Exception:
            self._broker_ca_key_file = ""
            if self._broker_ca_bundle_file:
                self._broker_ca_key_file = os.path.splitext(
                    self._broker_ca_bundle_file)[0] + ".key"

        # Broker CA password
        try:
            self._broker_ca_password = config.get(
                self.CERTS_CONFIG_SECTION, self.CERTS_BROKER_CA_PASSWORD_PROP)
        except Exception:
            self._broker_ca_password = ""

        # Broker CA list file
        try:
            self._broker_ca_list_file = config.get(
                self.CERTS_CONFIG_SECTION, self.CERTS_BROKER_CA_LIST_FILE_PROP)
        except Exception:
            self._broker_ca_list_file = ""
            if self._broker_ca_bundle_file:
                self._broker_ca_list_file = os.path.splitext(
                    self._broker_ca_bundle_file)[0] + "s.lst"

        # Client configuration template file
        try:
            self._client_config_template_file = config.get(
                self.CERTS_CONFIG_SECTION,
                self.CLIENT_CONFIG_TEMPLATE_FILE_PROP)
        except Exception:
            self._client_config_template_file = ""

        # Broker state policy file
        try:
            self._broker_state_policy_file = config.get(
                self.CERTS_CONFIG_SECTION,
                self.CERTS_BROKER_STATE_POLICY_FILE_PROP)
        except Exception:
            self._broker_state_policy_file = ""

    @property
    def client_ca_cert_file(self):
        """
        Returns the path to the CA certificate file

        :return: The path to the CA certificate file
        """
        return self._client_ca_cert_file

    @property
    def client_ca_key_file(self):
        """
        Returns the path to the CA key file

        :return: The path to the CA key file
        """
        return self._client_ca_key_file

    @property
    def client_ca_password(self):
        """
        Returns the password for the client CA

        :return: The password for the client CA
        """
        return self._client_ca_password

    @property
    def broker_ca_bundle_file(self):
        """
        Returns the path to the broker CA bundle file

        :return: The path to the broker CA bundle file
        """
        return self._broker_ca_bundle_file

    @property
    def broker_ca_key_file(self):
        """
        Returns the path to the broker CA key file

        :return: The path to the broker CA key file
        """
        return self._broker_ca_key_file

    @property
    def broker_ca_password(self):
        """
        Returns the password for the broker CA

        :return: The password for the broker CA
        """
        return self._broker_ca_password

    @property
    def broker_ca_list_file(self):
        """
        Returns the path to the broker CA list file

        :return: The path to the broker CA list file
        """
        return self._broker_ca_list_file

    @property
    def client_config_template_file(self):
        """
        Returns the path to the client configuration template file

        :return: The path to the client configuration template file
        """
        return self._client_config_template_file

    @property
    def broker_state_policy_file(self):
        """
        Returns the location of the broker state policy file

        :return: The location of the broker state policy file
        """
        return self._broker_state_policy_file

    @property
    def content(self):
        """
        The content of the module (JS code)

        :return: The content of the module (JS code)
        """
        return pkg_resources.resource_string(
            __name__, "content.html").decode("utf8")

    @property
    def enabled(self):
        """
        Returns whether the module is enabled

        :return: Whether the module is enabled
        """
        bootstrap_app = self.app.bootstrap_app
        return \
            bootstrap_app.local_broker and \
            self.client_ca_cert_file and \
            os.path.isfile(self.client_ca_cert_file) and \
            self.client_ca_key_file and \
            os.path.isfile(self.client_ca_key_file) and \
            self.broker_ca_bundle_file and \
            os.path.isfile(self.broker_ca_bundle_file) and \
            self.broker_ca_key_file and \
            os.path.isfile(self.broker_ca_key_file) and \
            (not self.broker_ca_list_file or
             os.path.isfile(self.broker_ca_list_file)) and \
            self.client_config_template_file and \
            os.path.isfile(self.client_config_template_file)

    @property
    def handlers(self):
        """
        Web (Tornado) handlers for the module

        :return: The web (Tornado) handlers for the module
        """
        return [
            (r'/generate_cert', GenerateCertHandler, dict(module=self)),
            (
                r'/remote/DxlBrokerMgmt.generateOpenDXLClientProvisioningPackageCmd',
                ProvisionManagementServiceHandler, dict(module=self)),
            (r'/remote/DxlClientMgmt.createClientCaBundle',
             CreateClientBundleManagementServiceHandler, dict(module=self)),
            (r'/remote/DxlClientMgmt.getBrokerList',
             GetBrokerListManagementServiceHandler, dict(module=self))
        ]


class _BaseCertHandler(BaseRequestHandler):
    """
    Handles post request to generate certs with the provided parameters
    """

    def __init__(self, application, request, module):
        self._module = module
        super(_BaseCertHandler, self).__init__(application, request)

    def data_received(self, chunk):
        """
        Invoked when streamed request data is received

        :param: chunk The next chuck of data
        """
        pass

    @staticmethod
    def _comment_remover(text):
        """
        Removes C-style comments from the text

        :param text: The text to remove comment from
        :return: The text with comments removed
        """
        def replacer(match):
            match_string = match.group(0)
            if match_string.startswith('/'):
                return " "  # note: a space and not an empty string
            return match_string

        pattern = re.compile(
            r'//.*?$|/\*.*?\*/|\'(?:\\.|[^\\\'])*\'|"(?:\\.|[^\\"])*"',
            re.DOTALL | re.MULTILINE
        )
        return re.sub(pattern, replacer, text)

    def _updateconfig_file(self):
        """
        Creates the dxlclient.config file

        :return: The ``dxlclient.config`` contents
        """
        with open(self._module.client_config_template_file, 'r') as f:
            content = f.read().decode("utf8")

        content = content.replace("@BROKER_CA_BUNDLE_FILE@",
                                  CertificateModule.ZIP_BROKER_CA_BUNDLE_FILE_NAME)
        content = content.replace("@CLIENT_CERT_FILE@",
                                  CertificateModule.ZIP_CLIENT_CERT_FILE_NAME)
        content = content.replace("@CLIENT_KEY_FILE@",
                                  CertificateModule.ZIP_CLIENT_KEY_FILE_NAME)

        # Host and IP address from incoming request
        server_host = tornado.httputil.split_host_and_port(self.request.host)[0]
        try:
            server_addr = socket.gethostbyname(server_host)
        except socket.gaierror:
            server_addr = ""
        content = content.replace("@EXTERNAL_BROKER_HOST@", server_host)
        content = content.replace("@EXTERNAL_BROKER_IP@", server_addr)

        # Local docker network
        docker_ip = subprocess.check_output(
            r"route -n | awk '/^\s*0.0.0.0/ {print $2}'", shell=True).strip()
        if not docker_ip:
            docker_ip = subprocess.check_output(
                "ip route | sed -n 's/.*default via \\([^ ]*\\).*/\\1/p'",
                shell=True).strip()
        content = content.replace("@DOCKER_BROKER_IP@",
                                  docker_ip.decode("utf8"))

        buf = StringIO(content)
        config_parser = ConfigParser()
        read_file(config_parser, buf)

        if not config_parser.has_section("BrokersWebSockets"):
            config_parser.add_section("BrokersWebSockets")
            config_parser.set("BrokersWebSockets", "local", "local;443;localhost;127.0.0.1")
            config_parser.set("BrokersWebSockets", "external",
                              "external;443;{};{}".format(server_host, server_addr))
            config_parser.set("BrokersWebSockets", "docker",
                              "docker;443;{};{}".format(docker_ip.decode("utf8"),
                                                        docker_ip.decode("utf8")))

        # Add other brokers from broker state file
        state_policy_file = self._module.broker_state_policy_file
        if state_policy_file and os.path.isfile(state_policy_file):
            try:
                with open(state_policy_file, 'r') as f:
                    policy_content = f.read()
                    policy_content = _BaseCertHandler._comment_remover(policy_content)
                    policy = json.loads(policy_content)
                if "brokers" in policy:
                    for broker in policy["brokers"]:
                        broker_str = "{id};{port};{host};{alt}".format(
                            id=broker["id"], port=broker["port"],
                            host=broker["hostname"], alt=broker.get("altHostname", ""))
                        config_parser.set("Brokers", broker["id"], broker_str)
                        if "webSocketPort" in broker:
                            broker_str = "{id};{port};{host};{alt}".format(
                                id=broker["id"], port=broker["webSocketPort"],
                                host=broker["hostname"], alt=broker.get("altHostname", ""))
                            config_parser.set("BrokersWebSockets", broker["id"], broker_str)

            except Exception as ex:
                logger.error("Error reading broker state policy file: %s, %s",
                             state_policy_file, ex)

        config_buffer = StringIO()
        config_parser.write(config_buffer)

        contents = config_buffer.getvalue()
        config_buffer.close()

        return contents

    def _get_configparser(self):
        """
        Loads the ``dxlclient.config`` contents into a ConfigParser

        :return: The config parser
        """
        # create the dxlclient.config file
        config_contents = self._updateconfig_file()

        buf = StringIO(config_contents)
        # read as a ConfigParser Object
        config_parser = ConfigParser()
        read_file(config_parser, buf)

        return config_parser

    @staticmethod
    def _create_cert(temp_csr_file, temp_cert_file,
                     ca_cert_file, ca_key_file, ca_password):
        """
        Create a certificate signed by the supplied CA.

        :param temp_csr_file: CSR file for creating the certificate
        :param temp_cert_file: Certificate file created
        :param ca_cert_file: Certificate file for the CA issuing the certificate
        :param ca_key_file: Private key file for the CA issuing the certificate
        :param ca_password: Password used to unencrypt the CA private key file
        :raise Exception: Error running the openssl command to create the certificate
        """
        password = 'pass:' + ca_password

        # Sign the CSR with the client cert file
        return_code = subprocess.call(
            ['openssl', 'x509', '-req', '-passin', password,
             '-CAcreateserial', '-days', '3650',
             '-CA', ca_cert_file, '-CAkey', ca_key_file,
             '-outform', 'PEM',
             '-out', temp_cert_file.name, '-in',
             temp_csr_file.name],
            stderr=open(os.devnull, 'wb'))

        if return_code != 0:
            raise Exception("Error creating certificate")

        logger.debug("Temp cert name: %s", temp_cert_file.name)


class GenerateCertHandler(_BaseCertHandler):
    """
    Handles post request to generate certs with the provided subject parameters
    """

    def __init__(self, application, request, module):
        super(GenerateCertHandler, self).__init__(application, request, module)
        self._module = module
        self._bootstrap_app = application.bootstrap_app

    def data_received(self, chunk):
        """
        Invoked when streamed request data is received

        :param: chunk The next chuck of data
        """
        pass

    def _generate_cert(self, subject, temp_key_file, temp_csr_file,
                       temp_cert_file, ca_cert_file, ca_key_file,
                       ca_password):
        """
        Uses openssl to create a csr with the info provided and sign the cert with the CA key
        The cert is written to the disk using the specified file names

        :param subject: The subject string
        :param temp_key_file: temp key file name to persist the key
        :param temp_csr_file: temp csr file to persist the csr
        :param temp_cert_file: temp csr file to persist the certificate
        :param ca_cert_file: Certificate file for the CA issuing the certificate
        :param ca_key_file: Private key file for the CA issuing the certificate
        :param ca_password: Password used to unencrypt the CA private key file
        """

        # Create the private key and csr using openssl command
        # stderr=open(os.devnull, 'wb') to suppress the err output from the openssl command
        return_code = subprocess.call(
            ['openssl', 'req', '-nodes', '-new', '-newkey', 'rsa:2048',
             '-keyout', temp_key_file.name, '-out', temp_csr_file.name,
             '-subj',
             subject],
            stderr=open(os.devnull, 'wb'))
        if return_code != 0:
            raise Exception("Error creating key and csr")

        logger.debug("Temp key file: %s", temp_key_file.name)
        logger.debug("Temp csr file: %s", temp_csr_file.name)

        # call openssl command to create the cert
        self._create_cert(temp_csr_file, temp_cert_file,
                          ca_cert_file, ca_key_file, ca_password)

    @staticmethod
    def _generate_subject_str_from_request(request_params):
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

        # weird quirk of openssl. It wants email first if present
        email = None
        if 'email' in request_params:
            email = request_params['email'].strip()

        subject = ''
        if email is not None:
            subject = "/emailAddress=" + email

        subject += "/CN=" + common_name

        # this has to be 2 chars
        country = None
        if 'country' in request_params:
            country = request_params['country'].strip()

        # openssl expects Country to have maxsize of 2.
        # asn1 encoding routines:ASN1_mbstring_ncopy:string too
        # long:.\crypto\asn1\a_mbstr.c:158:maxsize=2
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

        org_unit = None
        if 'ou' in request_params:
            org_unit = request_params['ou'].strip()

        if country is not None:
            subject += "/C=" + country
        if state is not None:
            subject += "/ST=" + state
        if locality is not None:
            subject += "/L=" + locality
        if org is not None:
            subject += "/O=" + org
        if org_unit is not None:
            subject += "/OU=" + org_unit

        return subject

    def _create_cert_zip_file(self, cert_file, key_file, config_type="client"):
        """
        Create a zip file with certificate-related content.

        :param config_type: Type of zip file to create. For "client" (the
            default), fill the zip file with client configuration content. For
            "broker", fill the zip file with broker keystore content.
        :param cert_file: The certificate file to include in the zip file.
        :param key_file: The key file to include in the zip file.
        :return: Content of the zip file (as bytes)
        """
        logger.debug("Updating dxlclient.config information")

        # create the dxlclient.config file
        config_out = self._updateconfig_file()

        # build the zip file in memory that is sent back to the caller
        in_memory_output_file = BytesIO()
        zip_file = ZipFile(in_memory_output_file, mode='w')

        broker_ca_bundle_file = self._module.broker_ca_bundle_file
        broker_ca_list_file = self._module.broker_ca_list_file
        client_ca_cert_file = self._module.client_ca_cert_file

        try:
            if config_type == "broker":
                # Broker keystore
                logger.debug("Adding broker certificate key file to zip")
                zip_file.write(
                    key_file.name,
                    arcname=CertificateModule.ZIP_BROKER_KEY_FILE_NAME)
                logger.debug("Adding broker certificate file to zip")
                zip_file.write(
                    cert_file.name,
                    arcname=CertificateModule.ZIP_BROKER_CERT_FILE_NAME)
                if os.path.exists(broker_ca_list_file):
                    logger.debug("Adding broker CA list file to zip")
                    zip_file.write(
                        broker_ca_list_file,
                        arcname=CertificateModule.ZIP_BROKER_CA_LIST_FILE_NAME)
                logger.debug(
                    "Adding DXL Client certificate authority to zip")
                zip_file.write(
                    client_ca_cert_file,
                    arcname=CertificateModule.ZIP_CLIENT_CA_CERT_FILE_NAME)
            else:
                # Client configuration
                logger.debug("Adding client certificate file to zip")
                zip_file.write(
                    cert_file.name,
                    arcname=CertificateModule.ZIP_CLIENT_CERT_FILE_NAME)
                logger.debug("Adding client certificate key file to zip")
                zip_file.write(
                    key_file.name,
                    arcname=CertificateModule.ZIP_CLIENT_KEY_FILE_NAME)
                logger.debug("Adding DXL Config file to zip")
                zip_file.writestr(CertificateModule.DXL_CONFIG_FILE_NAME,
                                  config_out.encode("utf8"))
            logger.debug("Adding DXL Broker certificate authority to zip")
            zip_file.write(
                broker_ca_bundle_file,
                arcname=CertificateModule.ZIP_BROKER_CA_BUNDLE_FILE_NAME)
        finally:
            zip_file.close()  # have to close before we read the contents

        in_memory_output_file.seek(0)
        return in_memory_output_file.getvalue()

    @tornado.web.authenticated
    def post(self, *args, **kwargs):
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
            request_params = json.loads(self.request.body.decode("utf8"))

            # Determine the type of cert package to create
            config_type = request_params.get("configType", "client").lower()
            if config_type == "client":
                # Client configuration
                ca_cert_file = self._module.client_ca_cert_file
                ca_key_file = self._module.client_ca_key_file
                ca_password = self._module.client_ca_password
            elif config_type == "broker":
                # Broker keystore
                ca_cert_file = self._module.broker_ca_bundle_file
                ca_key_file = self._module.broker_ca_key_file
                ca_password = self._module.broker_ca_password
            else:
                raise Exception(
                    "Unsupported configType: {}".format(config_type))

            # generate the cert subject string
            subject = self._generate_subject_str_from_request(request_params)

            temp_key_file = NamedTemporaryFile('w+b', delete=False)
            temp_csr_file = NamedTemporaryFile('w+b', delete=False)
            temp_cert_file = NamedTemporaryFile('w+b', delete=False)

            # generate the cert with the subject string using the temp files above
            self._generate_cert(subject, temp_key_file, temp_csr_file,
                                temp_cert_file, ca_cert_file, ca_key_file,
                                ca_password)

            # Create the cert zip file package
            contents = self._create_cert_zip_file(temp_cert_file,
                                                  temp_key_file, config_type)

            # write the base64 encoded zip file to the response stream
            self.write(encode(contents, 'base64'))

        except Exception as ex:
            if in_memory_output_file is not None:
                in_memory_output_file.close()
            logger.error(
                "Exception while processing generate cert request. %s", ex)
            logger.error(traceback.format_exc())
            self.set_status(500)
            self.write("Failed to generate certs:" + str(ex))
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


class ProvisionManagementServiceHandler(_BaseCertHandler):
    """
    This mimics the ePO service which is called by the Python client CLI
    provisionconfig command The response is similar to the ePO remote command
    "DxlBrokerMgmt.generateOpenDXLClientProvisioningPackageCmd"
    """

    def __init__(self, application, request, module):
        super(ProvisionManagementServiceHandler, self).__init__(application,
                                                                request,
                                                                module)
        self._module = module
        self._bootstrap_app = application.bootstrap_app

    def _get_broker_list_string(self):
        """
        Builds the broker list one per line from the config file.

        :return: comma delimited list of brokers
        """
        content = []
        # read as a config
        config_parser = self._get_configparser()
        # extract the broker list from the config
        for name, value in config_parser.items("Brokers"):
            content.append('{}={}\n'.format(name, value))

        content.append(",")

        # extract the WebSocket broker list from the config
        if config_parser.has_section("BrokersWebSockets"):
            for name, value in config_parser.items("BrokersWebSockets"):
                content.append('{}={}\n'.format(name, value))

        return ''.join(content)

    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        """
        Returns a client cert package using submitted CSR

        The HTTP response payload for this request should look
        like the following:

        OK:
        "[ca bundle],[signed client cert],[broker config]"

        Sections of the response include:

        * A line with the text 'OK:' if the request was successful, else error on failure.
        * A JSON-encoded string with a double-quote character at the beginning
          and end and with the following parts, comma-delimited:
        * [ca bundle] - a concatenation of one or more PEM-encoded CA
          certificates
        * [signed client cert] - a PEM-encoded certificate signed from the
          certificate request
        * [broker config] - zero or more lines, each delimited by a line feed
          character, for each of the brokers known to the management service.
          Each line contains a key and value, delimited by an equal sign. The
          key contains a broker guid. The value contains other metadata for the
          broker, e.g., the broker guid, port, hostname, and ip address. For
          example:'[guid1]=[guid1];8883;broker;10.10.1.1<newline>[guid2]=[guid2]...'.

        :return: provisioning information
        """
        logging.debug("Provisioning Management service invoked")

        # temp files for the csr and cert
        temp_cert_file = None
        temp_csr_file = None

        try:
            csr_string = self.get_argument('csrString', True)

            if csr_string is None:
                raise Exception("No CSR string passed")

            temp_csr_file = NamedTemporaryFile('wb', delete=False)
            temp_cert_file = NamedTemporaryFile('wb', delete=False)

            with open(temp_csr_file.name, 'w') as csr_file:
                csr_file.write(csr_string)
            #
            # generate the cert with the subject string using the temp files above
            self._create_cert(temp_csr_file, temp_cert_file,
                              self._module.client_ca_cert_file,
                              self._module.client_ca_key_file,
                              self._module.client_ca_password)

            broker_ca_bundle_file = self._module.broker_ca_bundle_file

            # First part of the response is the ca bundle
            with open(broker_ca_bundle_file, 'r') as cert_ca_file:
                ca_content = cert_ca_file.read()
            # Second part of the response is the signed cert
            with open(temp_cert_file.name, 'r') as cert_file:
                cert_content = cert_file.read()

            # Third part of the response is the broker list
            config_out = self._get_broker_list_string()

            # Response includes chain of CAs, cert signed by the client CA, list of brokers.
            # These parts are delimited by ','
            response_str = ",".join((ca_content, cert_content, config_out))
            # mimicking the ePO response for output string = json. Needs to be OK:"body"
            json_string = "OK:\r\n{}\r\n".format(json.dumps(response_str))

            self.write(json_string)

        except Exception as ex:
            logger.error(
                "Exception while processing Provision config request. %s", ex)
            logger.error(traceback.format_exc())
            error_string = "Failed to generate Provision config with the specified CSR:" + str(
                ex)
            # json_string = "ERROR:\r\n{}\r\n".format(json.dumps(error_string))
            # Raising exception again so the python client will show the error
            raise tornado.web.HTTPError(500, reason=error_string,
                                        log_message=error_string)
        finally:
            if temp_cert_file is not None:
                temp_cert_file.close()
                os.remove(temp_cert_file.name)
            if temp_csr_file is not None:
                temp_csr_file.close()
                os.remove(temp_csr_file.name)


class CreateClientBundleManagementServiceHandler(_BaseCertHandler):
    """
    This mimics the ePO service which is called by the Python client CLI updateconfig command
    The response is similar to the ePO remote command "DxlClientMgmt.createClientCaBundle"
    """

    def __init__(self, application, request, module):
        super(CreateClientBundleManagementServiceHandler, self).__init__(
            application, request, module)
        self._module = module
        self._bootstrap_app = application.bootstrap_app

    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        """
        The HTTP response payload for this request should look
        like the following:

        OK:
        "[ca bundle]"

        Sections of the response include:

        * A line with the text "OK:" if the request was successful, else error on failure.
        * A JSON-encoded string with a double-quote character at the beginning
          and end. The string contains a concatenation of one or more PEM-encoded
          CA certificates.

        :return: CA certificates
        """
        try:
            broker_ca_bundle_file = self._module.broker_ca_bundle_file

            # First part of the response is the ca bundle
            with open(broker_ca_bundle_file, 'r') as cert_ca_file:
                ca_content = cert_ca_file.read()

            # mimicking the ePO response for output string = json. Needs to be OK:"body"
            json_string = "OK:\r\n{}\r\n".format(json.dumps(ca_content))
            self.write(json_string)

        except Exception as ex:
            logger.error(
                "Exception while processing createClientCaBundle request. %s",
                ex)
            logger.error(traceback.format_exc())
            error_string = "Failed to return createClientCaBundle:" + str(ex)
            # json_string = "ERROR:\r\n{}\r\n".format(json.dumps(error_string))
            # Raising exception again so the python client will show the error
            raise tornado.web.HTTPError(500, reason=error_string,
                                        log_message=error_string)


class GetBrokerListManagementServiceHandler(_BaseCertHandler):
    """
    This mimics the ePO service which is called by the Python client CLI updateconfig command
    The response is similar to the ePO remote command "DxlClientMgmt.getBrokerList"
    """

    def __init__(self, application, request, module):
        super(GetBrokerListManagementServiceHandler, self).__init__(
            application,
            request,
            module)
        self._module = module
        self._bootstrap_app = application.bootstrap_app

    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        """
        Returns the broker list.The HTTP response payload for this request should look
        like the following:

        OK:
        "[broker config]"

        Sections of the response include:

        * A line with the text "OK:" if the request was successful, else error on failure.
        * A JSON-encoded string with a double-quote character at the beginning
          and end. The string should contain a JSON document which looks similar
          to the following

          .. code-block:: json

              {
                "brokers": [
                    {
                        "guid": "{2c5b107c-7f51-11e7-0ebf-0800271cfa58}",
                        "hostName": "broker1",
                        "ipAddress": "10.10.100.100",
                        "port": 8883
                    },
                    {
                        "guid": "{e90335b2-8dc8-11e7-1bc3-0800270989e4}",
                        "hostName": "broker2",
                        "ipAddress": "10.10.100.101",
                        "port": 8883
                    }
                ],
                "certVersion": 0
              }

        :return: Json broker list
        """
        try:
            # response is the broker list in json format
            brokers = []
            # read as a config
            config_parser = self._get_configparser()
            # extract the broker list from the config
            for name, value in config_parser.items("Brokers"):
                # split the value on ";". format is guid;port;host;ip
                _, port, host, ip_address = value.split(';')
                broker = {"hostName": host, "port": int(port), "guid": name,
                          "ipAddress": ip_address}
                brokers.append(broker)

            # build the json
            json_data = {"brokers": brokers, "certVersion": 0}
            # this the json of our response
            json_string_data = json.dumps(json_data)
            # ePO output=json creates json again
            json_string = "OK:\r\n{}\r\n".format(json.dumps(json_string_data))

            # write the response
            self.write(json_string)
        except Exception as ex:
            logger.error(
                "Exception while processing getBrokerList request. %s", ex)
            logger.error(traceback.format_exc())
            error_string = "Failed to return getBrokerList:" + str(ex)
            # json_string = "ERROR:\r\n{}\r\n".format(json.dumps(error_string))
            # Raising exception again so the python client will show the error
            raise tornado.web.HTTPError(500, reason=error_string,
                                        log_message=error_string)
