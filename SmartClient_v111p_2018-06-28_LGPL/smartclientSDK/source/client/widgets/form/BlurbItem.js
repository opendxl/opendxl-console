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
//>	@class	BlurbItem
// FormItem intended for inserting blurbs of instructional HTML into DynamicForms.
// <p>
// Set the <code>defaultValue</code> of this item to the HTML you want to embed in the form.
// @inheritsFrom FormItem
// @visibility external
//<
isc.ClassFactory.defineClass("BlurbItem", "FormItem");
isc.BlurbItem.addProperties({
    // avoid attempting to save this item in the form's values array
    shouldSaveValue:false,

    //>	@attr	blurbItem.height		(boolean : false : IRW)
	//			don't specify a height so the table cell will expand
	//			to show the entire contents.  Note that this can 
	//			mess up dynamic height calculations in forms.
	//		@group	appearance
	//<
	height:null,

    //>	@attr	blurbItem.showTitle		(Boolean : false : IRW)
	// Blurb items show no title by default.
	//		@group	appearance
    // @visibility external
	//<	
	showTitle:false,

    //>	@attr	blurbItem.colSpan		(int | String : "*" : IRW)
	// By default, texts span all remaining columns
	//		@group	appearance
    // @visibility external
	//<	
	colSpan:"*",						

    //>	@attr	blurbItem.startRow		(boolean : true : IRW)
	// These items are in a row by themselves by default
	//		@group	appearance
	//<
	startRow:true,						
	
    //>	@attr	blurbItem.endRow			(boolean : true : IRW)
	// These items are in a row by themselves by default
	//		@group	appearance
	//<
	endRow:true,

    //>	@attr	blurbItem.textBoxStyle     (CSSStyleName : "staticTextItem" : IRW)
	//  Base css style for this item.
	//  @group	appearance
    //  @visibility external
	//<
	textBoxStyle:"staticTextItem",
	
	//> @attr blurbItem.canSelectText (boolean : true : IRW)
	// Should the user be able to select the text in this item?
	// @visibility external
	//<
	canSelectText:true,

    
    // override emptyDisplayValue to show &nbsp; so styling will work properly
    emptyDisplayValue:"&nbsp;",

    //>	@attr	blurbItem.wrap		(boolean : null : IRW)
	// @include FormItem.wrap
	//		@group	appearance
    // @visibility external
	//<

    //>@attr    blurbItem.clipValue (Boolean : false : IRW)
    // @include FormItem.clipValue
    // @group appearance
    // @visibility external
    //<
    clipValue:false

});
