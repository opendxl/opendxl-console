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
//>	@class	SpacerItem
// A SpacerItem takes up a single cell in the FormLayout, of arbitrary size.
// @inheritsFrom FormItem
// @visibility external
//<
isc.ClassFactory.defineClass("SpacerItem", "FormItem");
isc.SpacerItem.addProperties({
    // avoid attempting to save this item in the form's values array
    shouldSaveValue:false,

    //>	@attr	spacerItem.showTitle		(Boolean : false : IRW)
	//			we never show a separate title cell for spacers
	//		@group	appearance
    // @visibility external
	//<	
	showTitle:false,

    //>	@attr	spacerItem.width				(number : 20 : IRW)
	//			default width for the spacer
	//		@group	appearance
    // @visibility external
	//<
	width:20,

	//>	@attr	spacerItem.height			(number : 20 : IRW)
	//			default height for the spacer
	//		@group	appearance
    // @visibility external
	//<
	height:20,

    showHint:false,     // Don't show a hint for this item
    showIcons:false     // even if a user has defined icons for this item, suppress them
});
isc.SpacerItem.addMethods({

    // Override isEditable as this is non editable
    isEditable : function () {
        return false;
    },
    
	//>	@method	spacerItem.getElementHTML()	(A)
	//			output the HTML for this element
	//		@group	drawing
	//
	//		@param	value	(String)	Value of the element [Unused because it is more reliably set by setValue].
	//		@return	(HTMLString)	HTML output for this element
	//<
	getElementHTML : function (value) {
		return isc.Canvas.spacerHTML(this.width, this.height);
	},
    //>	@method	spacerItem.shouldShowTitle()	(A)
    //      Override formItem.shouldShowTitle to return false - we don't want
    //      to draw a cell for the item title
	//		@group	drawing
	//
	//		@return	(HTMLString)	title for the formItem
	//<
	shouldShowTitle : function () {
		return false;
	}
});

