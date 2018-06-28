/*

  SmartClient Ajax RIA system
  Version v11.1p_2018-06-28/LGPL Deployment (2018-06-28)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/
// define a FileLoader stub for bootstrapping, if FileLoader has not been loaded
if (!isc.FileLoader) {
    isc.defineClass("FileLoader").addClassProperties({   
        // flag for SA_Core -> defineClass, allowing redefinition
        _isStub: true,

        // Some of the required modules may be optional modules (RealtimeMessaging, for
        // example).  But even if the user has not purchased a license to these, we still allow
        // the use of them specifically for RemoteDebugging - which requires the bootstrap
        // So: load from development/
        modulesDir: "system/development/",

        ensureLoaded : function (callback) {
            isc.fileLoaderLoaded = function () {
                isc.fileLoaderLoaded = null;
                callback();
            };
            isc.Comm.sendScriptInclude({
                // Note: no callback param - since we control the code in FileLoader,   
                // we have logic there in _pageLoad() to simply call a function on the isc
                // object, if registered once loaded.  This way we don't require server collusion
                URL: isc.Page.getIsomorphicDir()+this.modulesDir+"/ISC_FileLoader.js"
            });
        }
    });

    // FL synonym for FileLoader
    isc.addGlobal("FL", isc.FileLoader);
}
