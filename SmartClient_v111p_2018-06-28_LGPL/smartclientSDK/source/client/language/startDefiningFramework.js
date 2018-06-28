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



(function () {
    isc.definingFramework = true;

    function isc_startDefiningFramework(moduleName) {
        isc["module_" + moduleName] = 1;
        isc._moduleStart = isc["_" + moduleName + "_start"] = (isc.timestamp ? isc.timestamp() : new Date().getTime());
        isc._currentModule = moduleName;
    }

    function isc_processCurrentScriptSrc(src) {
        if (src == null) return;
        src = String(src);
        var moduleNamePrefix = "#module=",
            pos = src.indexOf(moduleNamePrefix);
        if (pos >= 0) isc_startDefiningFramework(src.substring(pos + moduleNamePrefix.length));
    }

    if (document.currentScript != null) {
        isc_processCurrentScriptSrc(document.currentScript.src);
    } else {
        var stack = new Error().stack;
        if (stack != null) {
            

            var atText = stack.indexOf(" at ") >= 0 ? " at " : "@";
            var lastAtPos = stack.lastIndexOf(atText);
            if (lastAtPos >= 0) {
                var src = stack.substring(lastAtPos + atText.length);

                // Remove the trailing lineno/colno.
                var re = new RegExp(":\\d+\\s*$");
                var result = re.exec(src);
                if (result) {
                    src = src.substring(0, result.index);
                    result = re.exec(src);
                    if (result) {
                        src = src.substring(0, result.index);
                    }
                }

                isc_processCurrentScriptSrc(src);
            }
        } else if (document.documentMode >= 8) {
            var oldOnerrorHandler = window.onerror;
            window.onerror = function (message, url, lineno) {
                alert(url);
                isc_processCurrentScriptSrc(url);
                window.onerror = oldOnerrorHandler;
                return true;
            };

            window.noSuchMethod();
        } else {
            var scriptElems = document.getElementsByTagName("script");
            var lastScriptElem = scriptElems[scriptElems.length - 1];
            isc_processCurrentScriptSrc(lastScriptElem.src);
        }
    }
})();
