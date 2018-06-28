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
//> @groupDef gwtFloatVsDouble
// In GWT code, you should generally use Java Doubles rather than Java Float values.
// <p>
// In the current implementation of GWT, Float and Double types are both represented as
// JavaScript Number, so there is no storage or performance advantage to using Float over
// Double, and double provides higher precision.
// <p>
// In addition, because GWT uses true Java Floats <i>in development mode</i> but uses higher
// precision JavaScript Number values in compiled mode, math operations on Float can differ
// between development mode vs compiled mode.
// <p>
// The SmartGWT field type "float" is represented as a JavaScript Number, the same storage GWT
// uses for Doubles, so in any code that accesses or manipulates values stored in a field of
// type "float", use Record.getAttributeAsDouble(), DoubleItem.getValueAsDouble(), and similar
// APIs to avoid being tripped up by GWT's different behavior in development mode.
//
// @title Float vs Double
// @visibility sgwt 
//<

//> @class DoubleItem
//TextForm item for managing a text field that displays a decimal value.
// @inheritsFrom FloatItem
//@visibility external
//<
isc.ClassFactory.defineClass("DoubleItem", "FloatItem");

isc.DoubleItem.addMethods({

    //> @method DoubleItem.getValueAsDouble()
    // Return the value tracked by this form item as a Double.  If the value cannot
    // be parsed to a valid double, null will be returned.
    //
    // @return (Double) the value of this element
    //
    // @see method:FormItem.getValue
    // @visibility external
    //<
    
    getValueAsDouble : function () {
        var origValue   = this.getValue(),
            parsedValue = parseFloat(origValue);
        return isNaN(parsedValue) ? null : parsedValue;
    }

});
