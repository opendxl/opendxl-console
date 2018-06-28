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
//>	@class	Progressbar
//
// The Progressbar widget class extends the StretchImg class to implement image-based progress
// bars (graphical bars whose lengths represent percentages, typically of task completion).
//
//  @inheritsFrom StretchImg
//  @treeLocation Client Reference/Control
//  @visibility external
//<

// declare the class itself
isc.ClassFactory.defineClass("Progressbar", "StretchImg");

// add default properties
isc.Progressbar.addProperties( {
    //>	@attr	progressbar.percentDone		(number : 0 : [IRW])
    // Number from 0 to 100, inclusive, for the percentage to be displayed graphically in
    // this progressbar.
    // @group appearance
    // @visibility external
    //<
	percentDone:0,

    //> @attr progressbar.length (Number | String : 100 : IRW)
    // Length of the progressbar in pixels. This is effectively height for a vertical
    // progressbar, or width for a horizontal progressbar.
    // <P>
    // This property must be set instead of setting <code>width</code> or <code>height</code>.
    // @group appearance
    // @visibility external
    // @setter setLength
    // @getter getLength
    //<
	length: 100,

    //> @attr progressbar.breadth (number : 20 : IRW)
    // Thickness of the progressbar in pixels. This is effectively width for a vertical
    // progressbar, or height for a horizontal progressbar.
    // <P>
    // This property must be set instead of setting <code>width</code> or <code>height</code>.
    // @group appearance
    // @visibility external
    //<
    breadth: 20,

    //>	@attr progressbar.vertical (Boolean : false : IRW)
	// Indicates whether this is a vertical or horizontal progressbar.
	// @group appearance
    // @visibility external
	//<
	vertical:false,
	
	//>	@attr	progressbar.imgDir		(String : isc.Canvas.USE_WIDGET_IMG_DIR : IRW)
	//			where progress bar images come from
	//		@group	appearance
	//<
//	imgDir:isc.Canvas.USE_WIDGET_IMG_DIR,

    //>	@attr	progressbar.skinImgDir		(SCImgURL : "images/Progressbar/" : IRWA)
	//		Where do 'skin' images (those provided with the class) live?
	//		This is local to the Page.skinDir
	//		@group	appearance, images
	//<
	skinImgDir:"images/Progressbar/",

    //>	@attr	progressbar.src		(SCImgURL : "[SKIN]progressbar.gif" : IRW)
	//	The base file name for the progressbar image.
	// @group appearance
    // @visibility external
	//<
	src:"[SKIN]progressbar.gif",
	
	//>	@attr	progressbar.cacheImageSizes		(boolean : false : IRWA)
	//			don't cache image sizes automatically
	//		@group	appearance
	//<
	cacheImageSizes:false,

	backgroundColor:"CCCCCC",

	// Items arrays for the images, so we don't make them over and over
    verticalItems: [
	    {name:"v_empty_end",size:3},
	    {name:"v_empty_stretch",size:0},
	    {name:"v_empty_start",size:3},
	    {name:"v_end",size:3},
	    {name:"v_stretch",size:0},
	    {name:"v_start",size:3}
	],
    horizontalItems: [
	    {name:"h_start",size:3},
	    {name:"h_stretch",size:0},
	    {name:"h_end",size:3},
	    {name:"h_empty_start",size:3},
	    {name:"h_empty_stretch",size:0},
	    {name:"h_empty_end",size:3}
	]

});

isc.Progressbar.addMethods({

init : function () {
    if (this.vertical) {
        this.width = this.breadth;
        this.height = this.length;
        this.items = this.verticalItems;
    } else {
        this.width = this.length
        this.height = this.breadth
        this.items = this.horizontalItems;
    }
    this.Super("init", arguments);
},

//>	@method	progressbar.resizeImages()	(A)
// Resize the images according to the percentDone, called automatically during rendering.
// <P>
// Sets this.sizes array to the new sizes
//<
resizeImages : function() {

	var totalSize = this.getLength(),
		imgs = this.items,
		sizes = this._imgSizes = [],
		percentDone = this.percentDone;
		
	if (this.vertical) {
		// size the 'empty' cap images (3,5)
		sizes[0] = (percentDone < 100 ? imgs[0].size : 0);
		sizes[2]   = (percentDone < 100 ? imgs[2].size : 0);

		// size the 'bar' cap images (0,2)
		sizes[3] = (percentDone > 0 ? imgs[3].size : 0);
		sizes[5]   = (percentDone > 0 ? imgs[5].size : 0);

	} else {
		// size the 'bar' cap images (0,2)
		sizes[0] = (percentDone > 0 ? imgs[0].size : 0);
		sizes[2]   = (percentDone > 0 ? imgs[2].size : 0);

		// size the 'empty' cap images (3,5)
		sizes[3] = (percentDone < 100 ? imgs[3].size : 0);
		sizes[5]   = (percentDone < 100 ? imgs[5].size : 0);
	}

	// adjust the totalsize by the amounts allocated to the cap images
	totalSize -= sizes[0] + sizes[2] + sizes[3] + sizes[5];

	// size the stretch images
	if (this.vertical) {
		sizes[4] = Math.ceil(totalSize * percentDone/100);
		sizes[1] = Math.floor(totalSize * (100-percentDone)/100);
	} else {
		sizes[1] = Math.ceil(totalSize * percentDone/100);
		sizes[4] = Math.floor(totalSize * (100-percentDone)/100);
	}
},

//>	@method	progressbar.setPercentDone()    ([])
// Sets percentDone to newPercent.
//
//      @visibility external
//		@param	newPercent		(number)	percent to show as done (0-100)
//<
setPercentDone : function (newPercent) {
    if (this.percentDone == newPercent) return;

    newPercent = Math.min(100,(Math.max(0,newPercent)));

    this.percentDone = newPercent;
    if (this.isDrawn()) {
        if (isc.Canvas.ariaEnabled()) this.setAriaState("valuenow", newPercent);
        this.markForRedraw("percentDone updated");
    }
    this.percentChanged();
},

//>	@method	progressbar.percentChanged()    ([A])
// This method is called when the percentDone value changes. Observe this method to be notified upon
// a change to the percentDone value.
//
// @see method:class.observe
// @visibility external
//<
percentChanged : function () { },

//>	@method	progressbar.getLength()    ([])
// Returns the current width of a horizontal progressbar, or height of a vertical progressbar.
//
//      @visibility external
//		@return	(Number)	the length of the progressbar
//<
getLength : function () {
	return this.vertical ? this.getHeight() : this.getWidth();
},

//>	@method	progressbar.getBreadth()    ([])
// Returns the current height of a horizontal progressbar, or width of a vertical progressbar.
//
//      @visibility external
//		@return	(number)	the breadth of the progressbar
//<
getBreadth : function () {
	return this.vertical ? this.getWidth() : this.getHeight();
},

//>	@method	progressbar.setLength()
// Sets the length of the progressbar to newLength. This is the width of a horizontal progressbar,
// or the height of a vertical progressbar.
//
// @param newLength (Number) the new length of the progressbar
// @visibility external
//<
setLength : function (newLength) {
	this.length = newLength;
	this.vertical ? this.setHeight(newLength) : this.setWidth(newLength);
},

//>	@method	progressbar.setBreadth()
// Sets the breadth of the progressbar to newLength. This is the height of a horizontal progressbar,
// or the width of a vertical progressbar.
//
// @param newBreadth (number) the new breadth of the progressbar
// @visibility external
//<
setBreadth : function (newBreadth) {
	this.breadth = newBreadth;
	this.vertical ? this.setWidth(newBreadth) : this.setHeight(newBreadth);
}

});

