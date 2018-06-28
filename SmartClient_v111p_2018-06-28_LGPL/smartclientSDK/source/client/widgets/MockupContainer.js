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
isc.ClassFactory.defineClass("MockupContainer", "Canvas");
isc.MockupContainer.addProperties({
    defaultWidth: "100%",
    defaultHeight: "100%",
    init : function () {
        if (!this.children && this.components) {
            this.children = this.components;
        }
        if (this.dataSources) {
            this.createDataSources();
        }
        this.Super("init", arguments);
    },
    createDataSources : function () {
        if (!this.dataSources) return;
        for (var i = 0; i < this.dataSources.length; i++) {
            isc.ClassFactory.newInstance(this.dataSources[i]._constructor, this.dataSources[i]);
        }
    },
    // Edit mode settings
    autoMaskChildren: true,
    editProxyProperties: {
        childrenSnapToGrid: true,
        childrenSnapAlign: true,
        persistCoordinates: true
    }
});
