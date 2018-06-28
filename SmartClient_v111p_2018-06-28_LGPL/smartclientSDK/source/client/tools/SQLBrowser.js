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
isc.defineClass("SQLBrowser", "VLayout").addClassProperties({

showWindow : function (windowProps, sqlBrowserProps) {
    isc.Window.create({
        title: "SQL Browser",
        width: "100%",
        height: "100%",
        canDragReposition: false,
        closeClick : function () { this.destroy(); },
        items: [
            isc.SQLBrowser.create({autoDraw: false}, sqlBrowserProps)
        ]
    }, windowProps).show();
}

});

isc.SQLBrowser.addProperties({

dbListDefaults: {
    _constructor: "DBList",
    height: 150,
    canDragSelectText: true,
    autoFetchData: true,
    canHover: true,
    defaultFields: [
        {name: "name"},
        {name: "status"}
    ]
},

dbListRefreshButtonDefaults: {
    _constructor: "Img",
    size: 16,
    src: "[SKIN]/actions/refresh.png",    
    click: "this.creator.dbList.invalidateCache()"
},

dbSchemaTreeDefaults: {
    _constructor: "DBSchemaTree",
    canDragSelectText: true,
    animateFolders: false,
    showConnectors: false,
//    showAllRecords: true,
    recordClick : function (viewer, record) {
        this.creator.showTablePane(record);
    }
},

dbSchemaRefreshButtonDefaults: {
    _constructor: "Img",
    size: 16,
    src: "[SKIN]/actions/refresh.png",    
    click: "this.creator.dbSchemaTree.invalidateCache()"
},


leftSectionDefaults: {
    _constructor: "SectionStack",
    headerHeight: 25,
    width: 300,
    showResizeBar: true,
    animateSections: isc.Browser.isSafari,
    visibilityMode: "visible",
    autoParent: "mainLayout"
},

mainLayoutDefaults: {
    _constructor: "HLayout",
    height: "*"
},

rightPaneDefaults: {
    _constructor: "TabSet",
    tabs: [
        {name: "welcome", title: "Welcome", ID: "dsb_welcome_tab", canClose: true, 
         pane: isc.Label.create({
             height: 10,
             autoDraw: false,
             overflow: "visible",
             contents: "Select a database on the left..."
         })
        }
    ]
},

autoChildren: ["mainLayout"],

initWidget : function () {
    this.Super("initWidget", arguments);

    this.dbList = this.createAutoChild("dbList", {
        selectionChanged : "if (state) this.creator.databaseChanged(record)"
    });
    this.dbListRefreshButton = this.createAutoChild("dbListRefreshButton");

    this.dbSchemaTree = this.createAutoChild("dbSchemaTree", {

    });
    this.dbSchemaRefreshButton = this.createAutoChild("dbSchemaRefreshButton");

    this.leftSection = this.createAutoChild("leftSection", {
        sections: [
            {name: "databases", title: "Databases", expanded: true, controls: [this.dbListRefreshButton], items: [
                this.dbList                       
            ]},
            {name: "tables", title: "Tables & Views", expanded: true, controls:[this.dbSchemaRefreshButton], items: [
                this.dbSchemaTree                       
            ]}
        ]
    });

    this.addAutoChildren(this.autoChildren);
    this.mainLayout.addMember(this.leftSection);

    this.rightPane = this.createAutoChild("rightPane");
    this.mainLayout.addMember(this.rightPane);
},

dbPaneDefaults: {
    _constructor: "DBPane"
},
showDBPane : function () {
    var db = this.db;    
    this.showPane({ID: this.escapeForId("db_"+db.name), title: db.name, paneClass: "dbPane"}, db);
},
databaseChanged : function (db) {
    if (db.status == "OK") {
        this.db = db;
        this.dbSchemaTree.loadSchema(db);
        this.showDBPane();
    }
},


showTablePane : function (record) {
    this.showDBPane();
    this.currentPane.showTableBrowser(record);
},

escapeForId : function (s) {
    return isc.isA.String(s) ? s.replace(/(\/|\.)/g, '_') : s;
},

showPane : function (props, childConfig) {
    var tab = this.rightPane.getTab(props.ID);
    if (tab) {
        this.currentPane = tab.pane;
        this.rightPane.selectTab(tab);
        return;
    }
    tab = {};

    isc.addProperties(tab, props, {canClose: true, pane: this.createAutoChild(props.paneClass, {config:childConfig})});

    var firstTab = this.rightPane.getTab(0);
    if (firstTab && firstTab.name == "welcome") this.rightPane.removeTab(0);

    this.rightPane.addTab(tab);
    this.rightPane.selectTab(tab);
    this.currentPane = tab.pane;
}

});
