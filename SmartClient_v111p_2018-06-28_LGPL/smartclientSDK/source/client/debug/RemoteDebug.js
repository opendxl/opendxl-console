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
isc.defineClass("RemoteDebug").addClassProperties({

isEnabled: false,

// Some of the required modules may be optional modules (RealtimeMessaging, for
// example).  But even if the user has not purchased a license to these, we still allow
// the use of them specifically for RemoteDebugging.
// So: load from development/
modulesDir: "system/development/",

getUniqueChannelName : function () {
    return navigator.userAgent;
},

// this is called on page load at the end of this file
conditionallyEnable : function () {
    this.logDebug("conditionally enabling debug");

    // by default only enable on mobile to avoid noise in remote dropdown
    if (window.isc_remoteDebug && isc.Browser.isMobile) {
        this.enable();
    } else if (isc.params["isc_remoteDebug"] == "true") {
        // but explicit query param forces it on
        this.enable();
    } 
},

requiredModules: ["RealtimeMessaging"],
loadRequiredModules : function (callback) {
    var _this = this;
    isc.FileLoader.ensureLoaded(function () {
        var modulesDir = isc.FileLoader.modulesDir;
        isc.FileLoader.modulesDir = _this.modulesDir
        isc.FileLoader.loadModules(_this.requiredModules, function () {
            // restore modulesDir
            isc.FileLoader.modulesDir = modulesDir;
            _this.fireCallback(callback);

        });
        // restore modulesDir - note: doing this twice to make really sure - it's possible
        // that callback above would fire synchronously on some platforms - in which case
        // any logic requiring FileLoader in the callback may be broken by the reset modulesDir
        isc.FileLoader.modulesDir = modulesDir;
    });
},

// call this method to enable RemoteDebug on the page that you want to debug
enable : function (callback) {
    if (this.isEnabled) {
        _this.fireCallback(callback);
    }

    // we need the SCServer for messaging to enable remoting 
    if (!isc.hasOptionalModules("SCServer")) {
        // alert() because remoting is typically enabled on mobile where logging to the dev
        // console won't help 
        alert("Remote debugging requires a Pro or better license.");
        return;
    }

    if (!isc.Log.logViewer) isc.Log.logViewer = isc.LogViewer.create();

    var _this = this;
    this.loadRequiredModules(function () {
        isc.debugTarget = isc.DebugTarget.create({

        });
        isc.debugTarget.start(function () { 
            // let all listening debug masters know we are available
            isc.debugTarget.sendTargetAvailableNotify();
            _this.isEnabled = true;
            _this.logInfo("Remote debug enabled");
            _this.fireCallback(callback);
        });
    });
},

enableLocal : function (callback) {
    // kill any remote debug session
    if (isc.debugTarget) {
        isc.debugTarget.debugDisable();
    }
    
    var _this = this;
    
    this.isEnabled = false;
    isc.debugTarget = isc.DebugTarget.create({
        socketProperties: {
            directBindingOnly: true
        }
    });
    isc.debugTarget.start(function () {
        _this.fireCallback(callback);
    });
}

});

if (isc.Page.isLoaded()) {
    isc.RemoteDebug.conditionallyEnable();
} else {
    isc.Page.setEvent("load", "isc.RemoteDebug.conditionallyEnable()", isc.Page.FIRE_ONCE);
}
