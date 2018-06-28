----------------------------------------------------------------
 SmartClient Deployment README
----------------------------------------------------------------


--------------------------------
 Components
--------------------------------
This package contains deployable components of the SmartClient AJAX RIA system:

  * client-only components (server agnostic) in the 'isomorphic' directory
  
    If you're using just the client-side components (SmartClient LGPL, for example), you just
    need to copy the isomorphic/ directory into your webRoot to install SmartClient.

  * If using the Optional SmartClient Server: Java components (Servlets 2.3+) in the 'WEB-INF' directory

     For information on merging the server components with a Java web application, please see
     "Deploying SmartClient" in the SmartClient Reference

--------------------------------
 Developer Console
--------------------------------

The SmartClient Developer Console is enabled by default in this deployment package. Isomorphic currently recommends deploying with this configuration, for easier debugging and problem resolution in your production applications.

If you wish to disable Developer Console access in your deployed applications, simply delete the isomorphic/system/development/ directory from this package. The modules in that directory are provided to support the SmartClient Developer Console only.


--------------------------------
 http://forums.smartclient.com
--------------------------------

