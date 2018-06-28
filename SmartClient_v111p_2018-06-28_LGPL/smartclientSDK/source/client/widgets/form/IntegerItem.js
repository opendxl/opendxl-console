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
//>	@class	IntegerItem
// FormItem intended for inputting integer numbers.
//
// @inheritsFrom TextItem
// @visibility external
//<
isc.ClassFactory.defineClass("IntegerItem", "TextItem");
isc.IntegerItem.addProperties({
    
    defaultType: "integer"

});

isc.IntegerItem.addMethods({

    //> @method integerItem.getValueAsInteger()
    // Return the value tracked by this form item as a Integer.  If the value cannot
    // be parsed to an int that matches the original value, null will be returned.
    //
    // @return (Integer) value of this element
    //
    // @see method:FormItem.getValue
    // @visibility external
    //<
    
    getValueAsInteger : function () {
        var origValue   = this.getValue(),
            parsedValue = parseInt(origValue);
        
        return isNaN(parsedValue) || parsedValue.toString() != origValue ? null : parsedValue;
    },
    
    _getFormattedNumberString : function (numberValue) {
        return "" + numberValue;
    }

});
