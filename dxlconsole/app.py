from __future__ import absolute_import
import logging
import hashlib

from dxlbootstrap.app import Application
from .console import WebConsole

# Configure local logger
logger = logging.getLogger(__name__)


class OpenDxlConsole(Application):
    """
    The "OpenDXL Console" application class.
    """

    #: The name of the "General" section within the application configuration file
    GENERAL_CONFIG_SECTION = "General"
    #: The web server port property
    GENERAL_PORT_CONFIG_PROP = "port"
    #: The console user name
    GENERAL_USERNAME_PROP = "username"
    #: The console password
    GENERAL_PASSWORD_PROP = "password"
    #: Whether the console is embedded in the broker
    GENERAL_LOCAL_BROKER_PROP = "localBroker"

    def __init__(self, config_dir, unique_id=None):
        """
        Constructor parameters:

        :param config_dir: The location of the configuration files for the application
        :param unique_id: The unique identifier of the console (optional)
        """
        super(OpenDxlConsole, self).__init__(config_dir, "dxlconsole.config")

        self._web_console = None
        self._port = 8443
        self._local_broker = False
        self._username = None
        self._password = None
        self._unique_id = None
        if unique_id:
            md5 = hashlib.md5()
            md5.update(unique_id)
            self._unique_id = md5.hexdigest()

    @property
    def user_cookie_name(self):
        """
        Returns the cookie name to use for the user

        :return: The cookie name to use for the user
        """
        return self._unique_id + "_user" if self._unique_id else "user"

    @property
    def console_name(self):
        """
        Returns the console name (title)

        :return: The console name (title)
        """
        return "OpenDXL Broker Console" if self.local_broker else "OpenDXL Console"

    @property
    def port(self):
        """
        Returns the console port

        :return: The console port
        """
        return self._port

    @property
    def local_broker(self):
        """
        Returns whether the console is for managing an OpenDXL broker

        :return: Whether the console is for managing an OpenDXL broker
        """
        return self._local_broker

    @property
    def username(self):
        """
        Returns the console user name

        :return: The console username
        """
        return self._username

    @property
    def password(self):
        """
        Returns the console password

        :return: The console password
        """
        return self._password

    @property
    def client(self):
        """
        The DXL client used by the application to communicate with the DXL fabric
        """
        return self._dxl_client

    @property
    def client_config_path(self):
        return self._dxlclient_config_path

    @property
    def config(self):
        """
        The application configuration (as read from the "dxlconsole.config" file)
        """
        return self._config

    def on_run(self):
        """
        Invoked when the application has started running.
        """
        logger.info("On 'run' callback.")

    def on_load_configuration(self, config):
        """
        Invoked after the application-specific configuration has been loaded

        This callback provides the opportunity for the application to parse
        additional configuration properties.

        :param config: The application configuration
        """
        logger.info("On 'load configuration' callback.")

        # Port
        try:
            self._port = int(config.get(self.GENERAL_CONFIG_SECTION,
                                        self.GENERAL_PORT_CONFIG_PROP))
        except Exception:
            pass
        if not self._port:
            raise Exception("Port not found in configuration file: {0}"
                            .format(self._app_config_path))

        # Local broker
        try:
            self._local_broker = config.getboolean(self.GENERAL_CONFIG_SECTION,
                                                   self.GENERAL_LOCAL_BROKER_PROP)
        except Exception:
            pass

        # Username
        try:
            self._username = config.get(self.GENERAL_CONFIG_SECTION,
                                        self.GENERAL_USERNAME_PROP)
        except Exception:
            pass
        if not self._username:
            raise Exception("Username not found in configuration file: {0}"
                            .format(self._app_config_path))

        # Password
        try:
            self._password = config.get(self.GENERAL_CONFIG_SECTION,
                                        self.GENERAL_PASSWORD_PROP)
        except Exception:
            pass
        if not self._password:
            raise Exception("Password not found in configuration file: {0}"
                            .format(self._app_config_path))

    def on_dxl_connect(self):
        """
        Invoked after the client associated with the application has connected
        to the DXL fabric.
        """
        logger.info("On 'DXL connect' callback.")

        self._web_console = WebConsole(self)
        self._web_console.start()
