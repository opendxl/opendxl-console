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
isc.defineClass("ClassBrowser", "VLayout").addClassProperties({

showWindow : function (windowProps, props) {
    isc.Window.create({
        title: "Class Browser",
        width: "100%",
        height: "100%",
        canDragReposition: false,
        closeClick : function () { this.destroy(); },
        items: [
            isc.ClassBrowser.create({autoDraw: false}, props)
        ]
    }, windowProps).show();
}

});

isc.ClassBrowser.addProperties({


classTreeDefaults: {
    _constructor: "JVMClassTree",
    autoDraw: false,
    autoFetchData: true,
    recordDoubleClick : function (viewer, record) {
        if (this.data.isLeaf(record)) this.creator.showClassPane(record);
    }
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
             contents: "Select a class on the left..."
         })
        }
    ]
},

autoChildren: ["mainLayout"],

initWidget : function () {
    this.Super("initWidget", arguments);

    this.classTree = this.createAutoChild("classTree", {
        selectionChanged : "if (state) this.creator.classChanged(record)"
    });

    this.leftSection = this.createAutoChild("leftSection", {
        sections: [
            {name: "classes", title: "Classes", expanded: true, controls: [], items: [
                this.classTree                       
            ]}
        ]
    });

    this.addAutoChildren(this.autoChildren);
    this.mainLayout.addMember(this.leftSection);

    this.rightPane = this.createAutoChild("rightPane");
    this.mainLayout.addMember(this.rightPane);
},

classChanged : function (record) {
    this.showClassPane(record);
},

classPaneDefaults: {
    _constructor: "JavaClassPane"
},
showClassPane : function (record) {
    var tabId = "class_"+this.escapeForId(record.path);
    this.showPane({ID: tabId, title: "Class: "+record.name, paneClass: "classPane"}, record);
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