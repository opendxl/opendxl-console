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
if (typeof isc.Params != "object") {



//>	@object	Params
//
//	Generate an array of parameters for a particular window/frame or URL.
//	One is generated automatically for the default frame and called "isc.params"
//	or you can create one for any other window, frame or URL.
//
//	To access the parameters of the window by name, simply access that
//	property of the params object:
//
//		alert("Parameter 'action' of this page is " + params.action);
//
//	To create a new params object, call the window level function and pass a window handle:
//
//		var otherWindow = window.open(...);
//		var otherWindowParams = getParams(otherWindow)
//
//	or pass a URL
//
//		var myParams = getParams("http://yoursite.com/page.html?foo=bar");
//
//	NOTE: this is not a class, but rather a simple JS object since
//		we do not want to potentially conflict the values of the params
//		with the built-in stuff in the Class object.
//<
isc.addGlobal("Params", function (frame) {
	// if no frame passed in, use the window this executes in
	if (!frame) frame = window;
	// convert the frame to an href string
    // Note: can't use isA because Params is part of the ISC_FileLoader module, which does not
    // include ISA
    var url = typeof frame == "string" ? frame : frame.location.href;

	// get the location of the question mark
	var questionIndex = url.indexOf("?"),
        // The params end at the first "#", or the end of the url
        hashIndex = url.indexOf("#");
    if (hashIndex < 0 || hashIndex< questionIndex) hashIndex = url.length;
    
	if (questionIndex != -1) {        
		var params = url.substring(questionIndex+1, hashIndex).split("&");
        //alert("paramPairs: " + params);
		for (var i = 0, param, equalIndex; i < params.length; i++) {
			param = params[i];
			if (!param) continue;
			equalIndex = param.indexOf("=");
            //alert("param: " + [it.substring(0, equalIndex),unescape(it.substring(equalIndex+1))]);
			this[param.substring(0, equalIndex)] = unescape(param.substring(equalIndex+1));
		}
    }
})


// create a default "params" object for applications to use
isc.params = new isc.Params();

//>	@function	getParams()
//		Create a top-level function called getParams() that creates a new params object for you.
//		Access parameters of the window in question by direct access on the returned object:
//		
//			var myParams = getParams(someOtherWindow);
//			alert(myParams.someNamedParameter);
//
//		@param	window		(Window | Frame | String)		window to get params for
//<
isc.getParams = function (window) { return new isc.Params(window) }

}    
