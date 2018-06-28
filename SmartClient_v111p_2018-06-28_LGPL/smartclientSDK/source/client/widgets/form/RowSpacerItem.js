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
//>	@class	RowSpacerItem
// Form item that renders as a blank row in the form layout.<br>
// Set +link{rowSpacerItem.startRow} to <code>false</code> to create a rowSpacer that simply
// takes up every remaining column in the current row rather than starting a new row.
// @inheritsFrom SpacerItem
// @visibility external
//<
isc.ClassFactory.defineClass("RowSpacerItem", "SpacerItem");
isc.RowSpacerItem.addProperties({
    //>	@attr	rowSpacerItem.showTitle		(Boolean : false : IRW)
	//			we never show a separate title cell for separators
	//		@group	appearance
    // @visibility external
	//<	
	showTitle:false,					

    //>	@attr	rowSpacerItem.colSpan				(int | String : "*" : IRW)
	//			by default, separators span all remaining columns
	//		@group	appearance
    // @visibility external
	//<	
	colSpan:"*",						

    //>	@attr	rowSpacerItem.startRow		(Boolean : true : IRW)
	//			these items are in a row by themselves by default
	//		@group	appearance
    // @visibility external
	//<
	startRow:true,
	
    //>	@attr	rowSpacerItem.endRow			(Boolean : true : IRW)
	//			these items are in a row by themselves by default
	//		@group	appearance
    // @visibility external
	//<
	endRow:true,

    //>	@attr	rowSpacerItem.width				(number : 20 : IRW)
	//			default width for the separator
	//		@group	appearance
	//<
	width:20,

    //>	@attr	rowSpacerItem.height			(number : 20 : IRW)
	//			default height for the separator
	//		@group	appearance
	//<
	height:20							
});

