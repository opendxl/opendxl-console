from __future__ import absolute_import
from codecs import encode
from io import BytesIO, StringIO
import json
import logging
import os
import socket
import subprocess
from tempfile import NamedTemporaryFile
import traceback
from zipfile import ZipFile

import pkg_resources
import tornado
import tornado.httputil

from dxlconsole.handlers import BaseRequestHandler
from dxlconsole.module import Module
from ..._compat import ConfigParser, read_file

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
        """
        Constructor parameters:

        :param app: The application that the module is a part of
        """
        super(CertificateModule, self).__init__(
            app, "certificates", "Certificate Management",
            "/public/images/cert.png", "certs_stack")
        bootstrap_app = self.app.bootstrap_app
        config = bootstrap_app.config

        self._client_ca_cert_file = None
        self._client_ca_key_file = None
        self._client_ca_password = None
        self._broker_ca_bundle_file = None
        self._client_config_template_file = None

        # Client CA certificate file
        try:
            self._client_ca_cert_file = config.get(self.CERTS_CONFIG_SECTION,
                                                   self.CERTS_CLIENT_CA_CERT_FILE_PROP)
        except Exception:
            pass

        # Client CA key file
        try:
            self._client_ca_key_file = config.get(self.CERTS_CONFIG_SECTION,
                                                  self.CERTS_CLIENT_CA_KEY_FILE_PROP)
        except Exception:
            pass

        # Client CA password
        try:
            self._client_ca_password = config.get(self.CERTS_CONFIG_SECTION,
                                                  self.CERTS_CLIENT_CA_PASSWORD_PROP)
        except Exception:
            pass

        # Broker CA bundle file
        try:
            self._broker_ca_bundle_file = config.get(self.CERTS_CONFIG_SECTION,
                                                     self.CERTS_BROKER_CA_BUNDLE_FILE_PROP)
        except Exception:
            pass

        # Client configuration template file
        try:
            self._client_config_template_file = config.get(
                self.CERTS_CONFIG_SECTION,
                self.CLIENT_CONFIG_TEMPLATE_FILE_PROP)
        except Exception:
            pass

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
    def client_config_template_file(self):
        """
        Returns the path to the client configuration template file

        :return: The path to the client configuration template file
        """
        return self._client_config_template_file

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
            self.client_ca_password and \
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

    def _updateconfig_file(self):
        """
        Creates the dxlclient.config file

        :return: The ``dxlclient.config`` contents
        """
        with open(self._module.client_config_template_file, 'r') as f:
            content = f.read()

        content = content.replace("@BROKER_CA_BUNDLE_FILE@",
                                  CertificateModule.ZIP_BROKER_CA_BUNDLE_FILE_NAME)
        content = content.replace("@CLIENT_CERT_FILE@",
                                  CertificateModule.ZIP_CLIENT_CERT_FILE_NAME)
        content = content.replace("@CLIENT_KEY_FILE@",
                                  CertificateModule.ZIP_CLIENT_KEY_FILE_NAME)

        # Host and IP address from incoming request
        server_host = tornado.httputil.split_host_and_port(self.request.host)[
            0]
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
        return content

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

    def _create_client_cert(self, temp_csr_file, temp_cert_file):
        """
        Create a client certificate signed by the Client CA of the standalone broker.

        :param temp_csr_file: CSR file for creating the certificate
        :param temp_cert_file: Certificate file created
        :raise Exception: Error running the openssl command to create the certificate
        """
        # load the client ca cert for signing
        client_ca_file = self._module.client_ca_cert_file
        client_ca_key_file = self._module.client_ca_key_file

        password = 'pass:' + self._module.client_ca_password
        # Sign the CSR with the client cert file
        return_code = subprocess.call(
            ['openssl', 'x509', '-req', '-passin', password,
             '-CAcreateserial', '-days', '3650',
             '-CA', client_ca_file, '-CAkey',
             client_ca_key_file,
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

    def _generate_client_cert(self, subject, temp_key_file, temp_csr_file,
                              temp_cert_file):
        """
        Uses openssl to create a csr with the info provided and sign the cert with the CA key
        The cert is written to the disk using the specified file names

        :param subject: The subject string
        :param temp_key_file: temp key file name to persist the key
        :param temp_csr_file: temp csr file to persist the csr
        :param temp_cert_file: temp csr file to persist the certificate
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
        self._create_client_cert(temp_csr_file, temp_cert_file)

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

            # generate the cert subject string
            subject = self._generate_subject_str_from_request(request_params)

            temp_key_file = NamedTemporaryFile('w+b', delete=False)
            temp_csr_file = NamedTemporaryFile('w+b', delete=False)
            temp_cert_file = NamedTemporaryFile('w+b', delete=False)

            # generate the cert with the subject string using the temp files above
            self._generate_client_cert(subject, temp_key_file, temp_csr_file,
                                       temp_cert_file)

            logger.debug("Updating dxlclient.config information")

            # create the dxlclient.config file
            config_out = self._updateconfig_file()

            # build the zip file in memory that is sent back to the caller
            in_memory_output_file = BytesIO()
            zip_file = ZipFile(in_memory_output_file, mode='w')

            broker_ca_bundle_file = self._module.broker_ca_bundle_file

            try:
                logger.debug("Adding client certificate file to zip")
                zip_file.write(temp_cert_file.name,
                               arcname=CertificateModule.ZIP_CLIENT_CERT_FILE_NAME)
                logger.debug("Adding client certificate key file to zip")
                zip_file.write(temp_key_file.name,
                               arcname=CertificateModule.ZIP_CLIENT_KEY_FILE_NAME)
                logger.debug("Adding DXL Broker certificate authority to zip")
                zip_file.write(broker_ca_bundle_file,
                               arcname=CertificateModule.ZIP_BROKER_CA_BUNDLE_FILE_NAME)
                logger.debug("Adding DXL Config file to zip")
                zip_file.writestr(CertificateModule.DXL_CONFIG_FILE_NAME, config_out.encode("utf8"))
            finally:
                zip_file.close()  # have to close before we read the contents

            in_memory_output_file.seek(0)
            contents = in_memory_output_file.getvalue()

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
            self._create_client_cert(temp_csr_file, temp_cert_file)

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
