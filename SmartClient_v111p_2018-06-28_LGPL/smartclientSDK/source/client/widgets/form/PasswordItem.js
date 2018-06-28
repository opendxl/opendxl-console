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
//>	@class	PasswordItem
// FormItem for password fields, where text input by the user should not be shown in readable text.
// @inheritsFrom TextItem
// @visibility external
//<
isc.ClassFactory.defineClass("PasswordItem", "TextItem").addClassProperties({
    _bullets:"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
});
isc.PasswordItem.addProperties({
    _elementType:"PASSWORD",

    showClippedValueOnHover: false
});

isc.PasswordItem.addMethods({

valueHoverHTML : function () {
    var elementValue = this.getElementValue();
    if (elementValue == null) elementValue = "";
    var bullets = isc.PasswordItem._bullets;
    while (bullets.length < elementValue.length) isc.PasswordItem._bullets = bullets += bullets;
    return bullets.substring(0, elementValue.length);
}

});

