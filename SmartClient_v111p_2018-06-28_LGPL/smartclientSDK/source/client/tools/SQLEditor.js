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
isc.defineClass("SQLEditor", "VLayout").addProperties({

sqlInputFormDefaults: {
    _constructor: "DynamicForm",
    height: 150,
    showResizeBar: true
},

actionButtonsDefaults: {
    _constructor: "HLayout",
    layoutMargin: 5,
    membersMargin: 5,
    height: 20
},

execSQLButtonDefaults: {
    _constructor: "IButton",
    title: "Exec SQL",
    click: "this.creator.execSQL();",
    autoParent: "actionButtons"
},

previewGridDefaults: {
    _constructor: "ListGrid",
    dataProperties: {
        progressiveLoading: true
    },
    minFieldWidth: 100,
    autoFetchData: false
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

    members: ["autoChild:exportButton",
              "starSpacer",
              "autoChild:refreshButton", "autoChild:totalRowsIndicator"
    ]
},

initWidget : function () {
    this.Super("initWidget", arguments);

    var sqlEditor = this;
    this.addAutoChild("sqlInputForm", {
        fields: [
            {name: "sql", showTitle: false, type: "textarea",
             width: "*", height: "*", colSpan: "*",
             keyPress:function (item, form, keyName) {
                if (keyName == 'Enter' && isc.EH.ctrlKeyDown()) {
                   if (isc.Browser.isSafari) item.setValue(item.getElementValue());
                   sqlEditor.execSQL();
                   if (isc.Browser.isSafari) return false;
                }
            }}
        ]
    });

    this.addAutoChildren(["actionButtons", "execSQLButton"]);
},

execSQL : function () {
    var sql = this.sqlInputForm.getValue("sql");
    if (sql) {
        // strip whitespaces and trailing semicolons - these produce a syntax error when passed
        // to the JDBC tier
        sql = sql.trim().replace(/(.*);+/, "$1");
        var ds = isc.DataSource.get("DataSourceStore");
        ds.performCustomOperation("dsFromSQL", {dbName: this.config.name, sql: sql}, this.getID()+".dsLoaded(data)");
    }
},

dsLoaded : function (data) {
    var ds = data.ds;
    if (!this.previewGrid) this.addAutoChild("previewGrid", {dataSource: ds});
    else this.previewGrid.setDataSource(ds);
    this.previewGrid.fetchData();

    this.addAutoChild("previewGridStrip", {
        grid: this.previewGrid
    });
}

});
