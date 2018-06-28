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
isc.defineClass("StringMethod");

// Actual string value of the method is stored in the "value" property

isc.StringMethod.addMethods({

getValue : function () {
    return this.value;
},

// Helper method to get a 'display value' for the stringMethod
// Returns the expression / body of the function or, for actions, the title of the action
getDisplayValue : function () {
    var value = this.getValue();
    if (value == null || isc.isA.String(value)) return value;
    if (value.title != null) return "[" + value.title + "]"
    // If we were created with a string value, return the raw expression
    return value;
    
},
        
// not allowed to have ]]> in a CDATA block
cdata : function (string) {
    var index = string.indexOf("]]>");
    if (index == -1) return "<![CDATA[" + string + "]]>";
    return this.cdata(string.slice(0, index)) + "]]&gt;" + this.cdata(string.slice(index+3));
},

_xmlSerialize : function (name, type, namespace, prefix, refs, path) {
    var value = this.value;
    if (isc.isA.String(value)) return isc.Comm._xmlValue(name, this.cdata(value), 
                                      type || "stringMethod", namespace, prefix);  
    else 
        return isc.StringMethod._xmlSerializeAction(value, name, prefix, refs, path);
        
}

});


// NOTE: toString functions CANNOT be added by addMethods, because a property named "toString"
// will not be enumerated by for..in.  This is actually part of the ECMAScript standard!

isc.StringMethod.getPrototype().toString = function () {
    var value = this.getValue();
    if (value == null || isc.isA.String(value)) return value;
    return value.toString();
},

isc.StringMethod.addClassMethods({

_$Action:"Action",
_xmlSerializeAction : function (action, name, indent, refs, path) {

        var actionDS = isc.DataSource.get(this._$Action);   
        if (!actionDS) return isc.Comm._xmlSerializeObject(name, action, path, refs, indent);

        return [isc.Comm._xmlOpenTag(name),
                 actionDS.xmlSerialize(action, null, indent + "        ", this._$Action),
                 "\n", indent,
                 isc.Comm._xmlCloseTag(name)].join(isc.emptyString);

}

})
