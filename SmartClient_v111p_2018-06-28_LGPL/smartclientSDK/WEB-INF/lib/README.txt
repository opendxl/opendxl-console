----------------------------------------------------------------------
SmartClient SDK server components
Version v11.1p_2018-06-28/LGPL Deployment (2018-06-28)
Java server edition
----------------------------------------------------------------------

This directory contains a set of Java server components (jars) that are either:

    1) required by the STANDARD SmartClient server; or

    2) required by OPTIONAL SmartClient modules, or

    3) SUPPLEMENTARY components that are provided for developer examples and prototyping only

Please see below for detailed lists of these components. The license agreements for third-party components are located in the WEB-INF/licenses/ directory of this package. Currently all third-party components except for the HSQLDB embedded database are provided under the Apache Software License (ASL).


----------------------------------------
Standard Components
----------------------------------------

The following components are required by the standard SmartClient server. These components are also provided in SmartClient DEPLOY (runtime) packages, for deployment on production application servers:

    SmartClient components
        isomorphic_core_rpc

    Apache Software Foundation components
        commons-cli
        commons-codec
        commons-collections
        commons-fileupload
        commons-jxpath
        commons-pool
        httpcore
        httpclient
        log4j
        velocity
        xercesImpl
        xml-apis


----------------------------------------
Optional Components
----------------------------------------

The following components are required by optional SmartClient modules only. These components are provided in the SmartClient SDK for evaluation purposes. They are also provided in your SmartClient DEPLOY packages if you have licensed the respective options for deployment.

    SmartClient components - Network Performance Module
        isomorphic_assembly
        isomorphic_compression

    SmartClient components - Realtime Messaging Module
        isomorphic_realtime_messaging


----------------------------------------
Supplementary SDK Components
----------------------------------------

The following components are provided in the SmartClient SDK to support developer examples or SQL-based rapid prototyping only. These components are not intended or licensed for production deployment.

    SmartClient SDK components
        isomorphic_embedded_tomcat
        isomorphic_examples
        isomorphic_js_parser
        isomorphic_sql
        isomorphic_struts
        isomorphic_tools
        isomorphic_web_services
        isomorphic_webdriver
        isomorphic_applets
        isomorphic_applets_examples

    Apache Software Foundation components
        axis
        axis-schema
        commons-beanutils
        commons-dbcp
        commons-digester
        commons-discovery
        commons-logging
        commons-validator
        jakarta-oro
        jakarta-taglibs-standard
        jaxrpc
        jstl
        saaj
        struts
        wsld4j

    Other Third-Party components
        hsqldb


----------------------------------------------------------------------
For questions regarding the use or deployment of these components,
please visit http://forums.smartclient.com. Thank you!
----------------------------------------------------------------------
