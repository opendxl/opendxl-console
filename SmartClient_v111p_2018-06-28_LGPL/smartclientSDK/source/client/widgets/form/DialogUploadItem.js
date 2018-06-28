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
// Class will not work without the ListGrid
if (isc.ListGrid) {




//> @class DialogUploadItem
// A FormItem that allows uploading a single file as a field in a record stored in a related
// DataSource.
//
// @inheritsFrom StaticTextItem
// @visibility internal
//<

isc.defineClass("DialogUploadItem", "StaticTextItem").addProperties({
    iconHeight: 16,
    iconWidth: 16,
    icons: [
        {src: "[SKIN]MultiUploadItem/icon_add_files.png", name:"upload", prompt: "Upload File",  click: "item.showPicker(true)"},
        {src: "[SKIN]MultiUploadItem/icon_remove_files.png", name:"remove", prompt: "Remove File", click: "item.removeFile()"}
    ],

    pickerConstructor: "DialogUploadPicker",
    noFileString: "[NONE]",


init : function () {
    this.Super("init", arguments);
    
    if (!this.pickerDefaults) this.pickerDefaults = {};
    isc.addProperties(this.pickerDefaults, {
        dataSource: this.dataSource
    });
},

mapValueToDisplay : function (value) {
    return value == null ? this.noFileString : this.Super("mapValueToDisplay", arguments);
},

showPicker : function () {
    this.Super("showPicker", arguments);
    var primaryKey = this.getValue('primaryKey');
    // pass primaryKey to ensure that uploads overwrite any existing file for this field.
    this.picker.foreignKeyValues = {
        primaryKey: primaryKey
    };
},

removeFile : function () {
    var primaryKey = this.getValue();
    if (primaryKey != this.defaultValue) {
        var ds = isc.DataSource.get(this.dataSource);
        ds.removeData({primaryKey: primaryKey}, this.getID()+".removeFileCallback(dsResponse)");
    }
},

removeFileCallback : function (dsResponse) {
    if (dsResponse.status != isc.DSResponse.STATUS_SUCCESS) {
        isc.warn("Unable to remove file: " + dsResponse.data);
        return;
    }
    this.setValue(this.defaultValue);
},
fileUploaded : function (dsRequest, dsResponse) {
    var data = dsResponse.data;
    var valueMap = {};
    valueMap[data.primaryKey] = data.file_filename;
    this.setValueMap(valueMap);
    this.setValue(data.primaryKey);
},

destroy : function () {
    if (this.picker) this.picker.destroy(); 
    this.Super("destroy", arguments);
},

_shouldAllowExpressions : function () {
    return false;
}


});


isc.defineClass("DialogUploadPicker", "MultiFilePicker").addProperties({
    maxUploadFields: 1,
    uploadWithoutPKButtonName: "Upload",
    uploadWithPKButtonName: "Upload",
    showUploadRemoveButton: false,
    uploadWithoutPK: true
});

}
