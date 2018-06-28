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
//> @class TextExportSettings
// Settings for use with +link{DataSource.recordsAsText()}.
// @inheritsFrom TextSettings
// @treeLocation Client Reference/System
// @visibility external
//<
isc.ClassFactory.defineClass("TextExportSettings", "TextSettings");

isc.TextExportSettings.addClassProperties({
    //> @type ForceTextApproach
    // Approach to force a text value to be interpreted as text rather than parsed as a date, time
    // or other structured types, as can happen with Microsoft Excel.  For background information,
    // see +link{group:excelPasting}.
    //
    LEADING_SPACE: "leadingSpace",
    // @value "leadingSpace" a leading space character is added
    FORMULA: "formula"
    // @value "formula" text value is turned into a trivial Excel formula (eg "car" becomes ="car").
    // In Excel, this renders just the value "car" but editing the cell reveals the formula.
    // @visibility external
    //<
});

isc.TextExportSettings.addProperties({
    //> @attr textExportSettings.lineSeparator (String : "\n" : IR)
    // Separator between Records.  Default is a newline character ("\n").
    // @visibility external
    //<
    lineSeparator: "\n",

    //> @attr textExportSettings.quoteValues (Boolean : true : IR)
    // Whether to surround each value with quotes ("").
    // @visibility external
    //<
    quoteValues: true,

    //> @attr textExportSettings.nullValueText (String : "": IR)
    // Text to export for a field with a null value.  If this property is null, then
    // null fields will be assumed to have the default value for their field type.
    // @visibility external
    //<
    nullValueText: "",

    //> @attr textExportSettings.useDisplayValue (Boolean : false : IR)
    // Whether to convert each field's value to the corresponding display value
    // for export.  Default of false will directly export the field's value.
    // @visibility external
    //<
    useDisplayValue: false,

    //> @attr textExportSettings.forceText (ForceTextApproach : null : IR)
    // If set, all text fields will use the indicated +link{ForceTextApproach} unless they have
    // a specific setting for +link{dataSourceField.exportForceText}.
    // @visibility external
    //<
    forceText: null,

    //> @attr textExportSettings.dateFormat (DateDisplayFormat : null : IR)
    // Format to use when outputting date values.  Default is to use the format expected by
    // Microsoft Excel (eg 1-2-2011), which Excel will turn into a real date value (see
    // +link{group:excelPasting}).  The current month-day-year order as set by
    // +link{DateUtil.setInputFormat()} will be used.
    // @visibility external
    //<
    dateFormat: null,

    //> @attr textExportSettings.dateTimeFormat (DateDisplayFormat : null : IR)
    // Format to use when outputting datetime values.  Default is to combine the configured date
    // and time formats with a space (" ").
    // @visibility external
    //<
    dateTimeFormat: null,

    //> @attr textExportSettings.timeFormat (TimeDisplayFormat : null : IR)
    // Format to use when outputting time values.  Default is 24 hour time.
    // @visibility external
    //<
    timeFormat: null
});
