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
isc.defineClass("NavStackPagedPanel", "SplitPanePagedPanel").addProperties({
    animateScrollDuration: 300,
    pagesContainerBaseStyle: "navStackPagedPanelPagesContainer",

    push : function (widget, scrollFinishedCallback) {
        
        this.pages.add(widget);
        var newLength = this.pages.length;
        var i = newLength - 1;
        this._addPageToContainer(widget, i, newLength);
        this.setCurrentPage(i, false, scrollFinishedCallback);
        

        
    },

    pop : function (scrollFinishedCallback) {
        this.setCurrentPage(this.pages.length - 2, false, {
            target: this,
            method: function () {
                this.pages[this.pages.length - 1].deparent();
                this.pages.setLength(this.pages.length - 1);
                if (scrollFinishedCallback != null) this.fireCallback(scrollFinishedCallback);
            }
        });
    },

    setSinglePanel : function (singlePanel, scrollFinishedCallback) {
        this.setPages([singlePanel]);
        if (scrollFinishedCallback != null) this.fireCallback(scrollFinishedCallback);

        
    }
});

isc.defineClass("NavStack", "VLayout");

isc.NavStack.addProperties({

    navStackPagedPanelConstructor: "NavStackPagedPanel",

    navStackPagedPanelDefaults: {
        width: "100%",
        height: "*"
    },

    navigationBarConstructor: "NavigationBar",

    navigationBarDefaults: {
        autoParent: "none",
        hieght: 44,
        rightPadding: 5,
        leftPadding: 5,
        defaultLayoutAlign: "center",
        overflow: "hidden",
        showLeftButton: false,
        
        navigationClick : function (direction) {
            if ("back" == direction) {
                this.creator.pop();
            }
        }
    },

    initWidget : function () {
        this.Super("initWidget", arguments);
        if (this.navigationBar == null) {
            this.navigationBar = this.createAutoChild("navigationBar");
        }
        this.navStackPagedPanel = this.createAutoChild("navStackPagedPanel");
        this.setMembers([this.navigationBar, this.navStackPagedPanel]);
    },

    push : function (widget, scrollFinishedCallback) {
        if (this._isAnimating()) return;
        this.navigationBar.push(widget);
        this.navStackPagedPanel.push(widget, scrollFinishedCallback);
        if (this.navStackPagedPanel.pages.length > 1) {
            this.navigationBar.setShowLeftButton(true);
        }
    },

    pop : function (scrollFinishedCallback) {
        if (this._isAnimating()) return;
        var widget = this.navigationBar.pop();
        if (this.navStackPagedPanel.pages.length <= 2) {
            this.navigationBar.setShowLeftButton(false);
        }
        this.navStackPagedPanel.pop(scrollFinishedCallback);
    },

    setSinglePanel : function (singlePanel, scrollFinishedCallback) {
        this.navigationBar.setSinglePanel(singlePanel);
        this.navStackPagedPanel.setSinglePanel(singlePanel, scrollFinishedCallback);
        this.navigationBar.setShowLeftButton(false);
    },

    _isAnimating : function () {
        return !!this.navStackPagedPanel._animating;
    }
});
