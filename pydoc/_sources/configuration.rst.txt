Configuration
=============

The OpenDXL Console requires a set of configuration files to operate.

This distribution contains a ``config`` sub-directory that includes the configuration files that must
be populated prior to running the console.

Each of these files are documented throughout the remained of this page.

Console configuration directory:

    .. code-block:: python

        config/
            dxlclient.config
            dxlconsole.config
            logging.config (optional)

.. _dxl_client_config_file_label:

DXL Client Configuration File (dxlclient.config)
------------------------------------------------

    The required ``dxlclient.config`` file is used to configure the DXL client that will connect to the DXL fabric.

    The steps to populate this configuration file are the same as those documented in the `OpenDXL Python
    SDK`, see the
    `OpenDXL Python SDK Samples Configuration <https://opendxl.github.io/opendxl-client-python/pydoc/sampleconfig.html>`_
    page for more information.

    The following is an example of a populated DXL client configuration file:

        .. code-block:: python

            [Certs]
            BrokerCertChain=c:\\certificates\\brokercerts.crt
            CertFile=c:\\certificates\\client.crt
            PrivateKey=c:\\certificates\\client.key

            [Brokers]
            {5d73b77f-8c4b-4ae0-b437-febd12facfd4}={5d73b77f-8c4b-4ae0-b437-febd12facfd4};8883;mybroker.mcafee.com;192.168.1.12
            {24397e4d-645f-4f2f-974f-f98c55bdddf7}={24397e4d-645f-4f2f-974f-f98c55bdddf7};8883;mybroker2.mcafee.com;192.168.1.13

.. _dxl_console_config_file_label:

OpenDXL Console (dxlconsole.config)
-----------------------------------

    The required ``dxlconsole.config`` file is used to configure the console.

    The following is an example of a populated console configuration file:

        .. code-block:: python

            [General]

            # The user name for the console
            username=admin

            # The password for the console
            password=password

            # The port for the server (required)
            port=8443

    **General**

        The ``General`` section contains the following properties:

        +------------------------+----------+--------------------------------------------------------------------+
        | Name                   | Required | Description                                                        |
        +========================+==========+====================================================================+
        | username               | yes      | The user name required to login to the console.                    |
        |                        |          | Defaults to ``admin``.                                             |
        +------------------------+----------+--------------------------------------------------------------------+
        | password               | yes      | The password required to login to the console.                     |
        |                        |          | Defaults to ``password``.                                          |
        +------------------------+----------+--------------------------------------------------------------------+
        | port                   | yes      | The port for the console.                                          |
        |                        |          | Defaults to ``8443``.                                              |
        +------------------------+----------+--------------------------------------------------------------------+

Logging File (logging.config)
-----------------------------

    The optional ``logging.config`` file is used to configure how the console writes log messages.
