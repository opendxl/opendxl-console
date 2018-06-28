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
isc.defineClass("SQLTableBrowser", "VLayout").addProperties({

previewGridDefaults: {
    _constructor: "ListGrid",
    canDragSelectText: true,
    autoFetchData: false,
    height: "*",
    minFieldWidth: 100,
    showFilterEditor: true,
    canEdit: true,
    dataProperties: {
        progressiveLoading: true
    }
},

previewGridStripDefaults: {
    _constructor: "GridToolStrip",
    width: "100%",

    generateDSButtonDefaults: {
        _constructor: "IAutoFitButton",
        title: "Show DataSource",
        layoutAlign: "center",
        click: "this.creator.creator.showDS()"
    },

    members: ["autoChild:removeButton", "autoChild:addButton", "autoChild:exportButton", "autoChild:generateDSButton",
              "starSpacer",
              "autoChild:refreshButton", "autoChild:totalRowsIndicator"
    ]
},

initWidget : function () {
    this.Super("initWidget", arguments);

    var ds = isc.DataSource.get("DataSourceStore");
    ds.performCustomOperation("dsFromTable", {schema:this.schema,dbName: this.dbName, tableName: this.config.name}, this.getID()+".dsLoaded(data)");
},


dsLoaded : function (data) {
    this.dataSource = data.ds;
    this.dataSourceXML = data.dsXML;

    this.addAutoChild("previewGrid", {
        dataSource: this.dataSource
    });
    this.addAutoChild("previewGridStrip", {
        grid: this.previewGrid
    });
    this.previewGrid.filterData();
},

showDS : function () {
    // server returns a bunch of internal flags as part of <DataSource> tag, so rebuild that
    // part from our config.
    var dsXMLHeader = "<DataSource ID=\""+this.config.name+"\" serverType=\"sql\" dbName=\""+this.dbName+"\" tableName=\""+this.config.name+"\"";
    if (this.schema) dsXMLHeader += " schema=\""+this.schema+"\"";
    dsXMLHeader += ">";

    var dsXML = this.dataSourceXML;
    dsXML = dsXML.substring(dsXML.indexOf(">")+1);
    dsXML = dsXMLHeader + dsXML;

    
    isc.Window.create({
        title: "DataSource XML for table: " + this.config.name,
        autoDraw: true,
        autoSize: true,
        autoCenter: true,
        items: [
            isc.DynamicForm.create({
                numCols: 1,
                width: 600,
                height: 600,
                autoFocus: true,
                selectOnFocus: true,
                fields: [
                    {name: "dsData", showTitle: false, type: "textArea", wrap: isc.TextAreaItem.OFF, defaultValue: dsXML, width: "*", height: "*"}
                ],
                closeClick : function () {
                     this.destroy();
                     return false;
                }
            })
        ]
    });
}

});
