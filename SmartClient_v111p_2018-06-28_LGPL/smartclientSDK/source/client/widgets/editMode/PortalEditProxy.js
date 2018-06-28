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
isc.defineClass("PortletEditProxy", "EditProxy").addMethods({
    canAdd : function (type) {
        // Don't let Portlets be added directly to Portlets, because it is almost never what
        // would be wanted. But let the caller ask parents ...
        if (type == "Portlet") return null;
        return this.Super("canAdd", arguments);
    },

    drop : function () {
        return null;
    },

    dropMove : function () {
        return null;
    },

    dropOver : function () {
        return null;
    }
});

isc.defineClass("PortalRowEditProxy", "LayoutEditProxy");
isc.PortalRowEditProxy.addProperties({
    // PortalRow has internal logic which handles drag/drop
    // in editMode, so defer to that.
    
    dropMove : function () {
        return this.creator.dropMove();
    },

    dropOver : function () {
        return this.creator.dropOver();
    },

    drop : function () {
        return this.creator.drop();
    }
});

isc.defineClass("PortalLayoutEditProxy", "LayoutEditProxy").addMethods({
    canAdd : function (type) {
        var result = this.Super("canAdd", type);

        // Don't allow drops to bubble out of the PortalLayout,
        // because the PortalLayout will handle everything
        // except for the "dead zone" in the column header,
        // which should conclusively be dead. So, we convert
        // any "null" response to "false", to conclusively deny
        // the drop.
        return result || false;
    }
});

isc.defineClass("PortalColumnEditProxy", "LayoutEditProxy").addMethods({
    // We don't actually want to add anything via drag & drop ... that will be
    // handled by PortalColumnBody
    canAdd : function (type) {
        return null;
    },
    
    drop : function () {
        return null;
    },

    dropMove : function () {
        return null;
    },

    dropOver : function () {
        return null;
    }
});

