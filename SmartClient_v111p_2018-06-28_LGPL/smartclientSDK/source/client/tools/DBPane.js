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
isc.defineClass("DBPane", "TabSet").addProperties({

sqlEditorDefaults: {
    _constructor: "SQLEditor"
},


initWidget : function () {
    this.Super("initWidget", arguments);

    this.sqlEditor = this.createAutoChild("sqlEditor", {config: this.config});
    this.addTab({title: "SQL Editor", pane: this.sqlEditor});
},

tablePaneDefaults: {
    _constructor: "SQLTableBrowser"
},
showTableBrowser : function (table) {
    var tabId = this.escapeForId(this.config.name+'_'+table.name);
    this.showPane({ID: tabId, title: table.name, paneClass: "tablePane"}, table);    
},
escapeForId : function (s) {
    return isc.isA.String(s) ? s.replace(/(\/|\.)/g, '_') : s;
},
showPane : function (props, childConfig) {
    var tab = this.getTab(props.ID);
    if (tab) {
        this.selectTab(tab);
        return;
    }
    tab = {};

    isc.addProperties(tab, props, {canClose: true, pane: this.createAutoChild(props.paneClass, {config:childConfig,dbName:this.config.name})});

    this.addTab(tab);
    this.selectTab(tab);
    this.currentPane = tab.pane;
}

});
