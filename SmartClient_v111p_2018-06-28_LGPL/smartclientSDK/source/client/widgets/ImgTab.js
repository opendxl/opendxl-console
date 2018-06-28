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
//>	@class	ImgTab
// Specialized StretchImgButton used by TabSet/TabBar for tabs
//
// @inheritsFrom StretchImgButton
// @treeLocation Client Reference/Foundation
// @visibility external
//<

// class for Stretchable image buttons
isc.ClassFactory.defineClass("ImgTab", "StretchImgButton");

// add properties to the class
isc.ImgTab.addProperties({
    //>	@attr ImgTab.capSize		(number : 2 : IRW)
	// How big are the end pieces by default
	// @group appearance
    // @visibility external
	//<
	capSize:2,

    //>	@attr ImgTab.skinImgDir		(URL : "images/Tab/" : IRW)
	// Base path for the images.   <B>Note</B> that when used within a TabSet, the
    // +link{tabSet.tabBarPosition} is appended as an additional path segment, yielding
    // "images/Tab/top/" et al.
    //
    // @visibility external
	//<
	skinImgDir:"images/Tab/",
	
	//> @attr ImgTab.labelSkinImgDir (URL : "images/" : IRW)
	// Base path for images shown within this ImgTab's label. This will be used for
	// icons (such as the close icon) by default.
	// @visibility external
	//<
	labelSkinImgDir:"images/",
	
    //> @attr ImgTab.baseStyle (CSSStyleName : "tab" : IR)
    // @visibility external
    //<
    baseStyle:"tab",

    //> @attr ImgTab.titleStyle (CSSStyleName : null : IR)
    // Like +link{StretchImgButton.titleStyle}, can set to provide a separate style for the
    // title text.
    // <P>
    // If set and the ImgTab is +link{StretchImgButton.vertical,vertical}, a "v" will be
    // automatically prepended to the style name (hence "tabTitle" -> "vtabTitle").
    //
    // @visibility external
    //<

    //> @attr imgTab.src (SCImgURL : "[SKIN]tab.gif" : IRW)
	// Base URL for tab images
    // @visibility external
	//<
	src:"[SKIN]tab.gif",				

    //>	@attr ImgTab.showRollOver		(Boolean : false : IRW)
	// Should we visibly change state when the mouse goes over this tab
    // @visibility external
	//<
	showRollOver:false,					

    //>	@attr ImgTab.showFocus    (boolean : true : IRW)
	// Should we visibly change state when the tab receives keyboard focus?
    // @deprecated as of SmartClient 6.1 in favor of +link{imgTab.showFocused}
    // @visibility external
	//<
    //>	@attr ImgTab.showFocused    (Boolean : true : IRW)
	// Should we visibly change state when the tab receives keyboard focus?
    // @visibility external
	//<
	showFocused:true,

    //>	@attr ImgTab.align		(Alignment : isc.Canvas.CENTER : IRW)
	// Alignment of title text
	//		@group	positioning
    // @visibility external
	//<
    // agrees with superclass
	//align:isc.Canvas.CENTER,

	//>	@attr ImgTab.valign		(VerticalAlignment : isc.Canvas.CENTER : IRW)
	// Vertical alignment of title text.
	//		@group	positioning
	//<
    // agrees with superclass
	//valign:isc.Canvas.CENTER,

    //>	@attr ImgTab.actionType		(ButtonActionType : isc.Button.BUTTON : IRWA)
	//			button behavior -- BUTTON, RADIO or CHECKBOX
	//<                                        
	actionType:isc.Button.RADIO,
    
    
    mozOutlineOffset:"0px"
});

isc.ImgTab.addProperties({

    //>EditMode 
    // needed so that we can autodiscover this method to update the pane.
    setPane : function (pane) {
        this.parentElement.parentElement.updateTab(this, pane);
    }, 
    // needed to allow a zero-parameter action for selecting a tab
    selectTab : function () {
        this.parentElement.parentElement.selectTab(this);
    },
    //<EditMode
    
    initWidget : function (a,b,c,d,e,f) {    
        if (this.vertical && this.titleStyle) this.titleStyle = "v" + this.titleStyle;
        return this.invokeSuper(isc.ImgTab, this._$initWidget, a,b,c,d,e,f);
    },
	
	setCanClose : function(canClose) {
        var tabset = this.parentElement ? this.parentElement.parentElement : null;
		if (tabset && isc.isA.TabSet(tabset)) {
			tabset.setCanCloseTab(this, canClose);
		} else {
			// We have an orphaned tab that is not part of a tabset.  Not sure how much use 
			// such a thing would be, but set its canClose attribute for completeness
			this.canClose = canClose;
		}
	}

});
