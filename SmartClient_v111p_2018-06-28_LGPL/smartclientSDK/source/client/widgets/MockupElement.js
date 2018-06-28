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
//>	@class	MockupElement
// MockupElements are produced by the +link{group:balsamiqImport,Balsamiq Mockup Importer} as
// placeholders for Balsamiq controls that cannot be meaningfully translated to SmartClient
// controls (such as the big red X markup control).
// <p>
// MockupElement is just an instance of Img that uses .png files stored in the
// tools/visualBuilder/mockups folder.  
// <p>
// MockupElement is not intended to be included in any final applications.
//
// @inheritsFrom Img
// @treeLocation Client Reference/Tools
// @visibility external
//<


isc.overwriteClass("MockupElement", "Img");

isc.MockupElement.addProperties({
    controlName:"MockupElement",
    defaultWidth:16,
    defaultHeight:28,
    measuredW:-1,
    measuredH:-1
});
    
isc.MockupElement.addMethods({
    initWidget : function () {
        this.Super(this._$initWidget, arguments);
        var url = isc.Page.getToolsDir()+"visualBuilder/mockups/";
        var postfix = this.controlName.substr(this.controlName.indexOf("::") + 2, 
            this.controlName.length) + ".png";
        this.src=url + postfix;
        if (this.title != null) {
            this.addChild(
                isc.Label.create({
                    ID:this.getID() + "_titleLabel",
                    autoDraw:true,
                    left: 10,
                    top: 0,
                    width: this.width,
                    height: this.height,
                    zIndex: this.getZIndex(true) + 1,
                    contents: this.title
                })
            );
        }
    }
});
