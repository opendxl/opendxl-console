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
//> @type ColorPickerMode
// @value "simple" Display a palette of 40 basic colors from which to pick.
// @value "complex" In addition to the 40 basic colors, the user can specify a color from anywhere
// in the spectrum, with an optional alpha component.
// @visibility external
//<


//> @class ColorPicker
// The ColorPicker widget allows the user to select a color from anywhere in the 
// color spectrum. It also supports selecting the alpha (opacity) value of the 
// color.  The picker supports a simple mode - which allows for one-click selection
// from a standard palette of colors - and a complex mode which allow the user to
// define any conceivable color. It is possible for the user to switch from simple
// mode to complex by interacting with the widget.  In general, the widget provides
// very similar functionality to the color picker dialogs found in graphics packages
// and other desktop software.
// @inheritsFrom Window
// @treeLocation Client Reference/Forms
// @visibility external
//<

if (isc.Window) {

isc.ClassFactory.defineClass("ColorPicker", isc.Window);

isc.ColorPicker.addClassMethods({

//> @classMethod ColorPicker.getSharedColorPicker
// Returns the shared global ColorPicker. 
// Many applications will only need one ColorPicker instance; for such use 
// cases, it is a good idea to use the shared object for performance reasons.
// <p>
// The optional second parameter to this method indicates whether the shared picker
// should retain the state (mode, color and opacity) it was in last time it was used, 
// or revert to defaults.
// Generally, you will want the picker to revert to default state; this gives the
// same user experience as creating a new instance without incurring the overhead.
// However, some use cases will benefit from the picker remembering what the user
// did last time.
// @param properties (Object) Properties to apply to the global ColorPicker object
// @param [keepCurrentState] (boolean) Should we keep the current state?
//                                    If false (or not provided), revert to default state
// @visibility external
//<
getSharedColorPicker : function (properties, keepCurrentState) {

    properties = properties || {};
    
    if (!isc.isA.ColorPicker(this._globalColorPicker)) {
        this._globalColorPicker = isc.ColorPicker.create(properties);
    } else {
        // Ensure previous colorSelected won't fire even if properties.colorSelected is undefined 
        if (properties.colorSelected == null) delete this._globalColorPicker.colorSelected;
        if (properties.colorChanged == null) delete this._globalColorPicker.colorChanged;

        // Set properties so that RichTextEditor can assign this._globalColorPicker.creator to itself (RichTextEditor.js, chooseColor method, line 587)
        this._globalColorPicker.setProperties(properties);
    }

    if (!keepCurrentState) {
        var picker = this._globalColorPicker;

        if (picker._currentPickMode != picker.defaultPickMode) {
            picker._currentPickMode = picker.defaultPickMode;
            if (picker._currentPickMode == 'simple') {  
                picker.removeComplexElements();
                if (picker.allowComplexMode) {
                    picker.modeToggleButton.setTitle(picker.moreButtonTitle);
                }
            } else {
                if (!picker._rgbForm) {
                    picker.createComplexElements();
                }
                picker.addComplexElements();
                picker.modeToggleButton.setTitle(picker.lessButtonTitle);
            }
        }

        // Note we already copied "properties" over to "picker" via the setProperties call
        // above.
        picker.setHtmlColor(picker.defaultColor);
        picker.setOpacity(picker.defaultOpacity);
    }
    return this._globalColorPicker;
}
});

// ColorChooser was an undocumented widget used by the RichTextEditor. This component
// supersedes it.
isc.addGlobal("ColorChooser", isc.ColorPicker);

isc.ColorPicker.addProperties({
 
// Default Window properties first
canFocusInHeaderButtons: true,
autoSize: true,
keepInParentRect: true,
isModal: true,
autoCenter: true,
autoDraw: false,
showMinimizeButton: false,
closeClick: function () { this.hide(); },

//layoutMargin: 2,

//> @attr colorPicker.okButton (AutoChild IButton : null : R)
// "OK" button for the ColorPicker
// @visibility external
//<

//> @attr colorPicker.showOkButton (Boolean : true : IRA)
// Should the OK button be visible. Set to false to hide the OK button.
// @visibility external
//<
showOkButton: true,

//>    @attr colorPicker.okButtonConstructor    (Class : IButton : IRWA)
//      The class of the "OK" button. It is intended that you use either IButton or 
//      Button - other classes are unlikely to work correctly.
//      @visibility external
//<
okButtonConstructor: "IButton",

okButtonDefaults: {
    width: 80,
    autoParent: "buttonLayout",
    click: function () {
        if (this.creator.colorSelected) {
            this.creator.colorSelected(this.creator.getHtmlColor(), this.creator.getOpacity());
        }
        this.creator.hide();
    }
},
    
    
//> @attr colorPicker.cancelButton (AutoChild IButton : null : R)
// Cancel button for the ColorPicker
// @visibility external
//<


//> @attr colorPicker.showCancelButton (Boolean : true : IRA)
// Should the Cancel button be visible. Set to false to hide the Cancel button.
// @visibility external
//<
showCancelButton: true,
    
//>    @attr colorPicker.cancelButtonConstructor    (Class : IButton : IRWA)
//      The class of the Cancel button. It is intended that you use either IButton or 
//      Button - other classes are unlikely to work correctly.
//      @visibility external
//<
cancelButtonConstructor: "IButton",

cancelButtonDefaults: {
    title: "Cancel",
    width: 80,
    autoParent: "buttonLayout",
    click: function () {
        this.creator._cancel();
    }
},

_cancel : function () {
    this.hide();
    if (this.pickerCancelled) this.pickerCancelled();
},

//> @attr colorPicker.modeToggleButton (AutoChild IButton : null : R)
// "More"/"Less" button for the ColorPicker
// @visibility external
//<

//> @attr colorPicker.showModeToggleButton (Boolean : true : IRA)
// Should the Mode Toggle button be visible. Set to false to hide the Mode Toggle button.
// @visibility external
//<
showModeToggleButton: true,
    
//>    @attr colorPicker.modeToggleButtonConstructor    (Class : IButton : IRWA)
//      The class of the mode toggle button. It is intended that you use either IButton or 
//      Button - other classes are unlikely to work correctly.
//      @visibility external
//<
modeToggleButtonConstructor: "IButton",
modeToggleButtonDefaults: {
    width: 80,
    autoParent: "buttonLayout",
    click: function () { 
        this.creator._togglePickMode();
    }
},

showButtonLayout: true,
buttonLayoutConstructor: "HLayout",
buttonLayoutDefaults: {
    width: "*",
    defaultLayoutAlign: "center"
},

// this is an VLayout that contains the contentLayout and the buttonLayout
// buttonLayout
bodyLayoutConstructor: "VLayout",
bodyLayoutDefaults: {
    autoDraw: false,
    width: "100%",
    height: "100%"
},

// this is the main "body" of the chooser - it contains the basicLabel and innerContentLayout
contentLayoutConstructor: "VLayout",
contentLayoutDefaults: {
    autoDraw: false,
    resized : function () {
        if (this.creator.buttonLayout) this.creator.buttonLayout.setWidth(this.getVisibleWidth());
    }
},

// this layout fills the window width and all the height that isn't taken by the basicLabel or 
// bottom buttonLayout
innerContentLayoutConstructor: "HLayout",
innerContentLayoutDefaults: {
    autoDraw: false,
    align: "center",
    membersMargin: 5
},

// this label sets immediately below the window header in the advanced view and reads "Basic Colors"
leftLayoutConstructor: "VLayout",
leftLayoutDefaults: {
    membersMargin: 10
},

// this label sets immediately below the window header in the advanced view and reads "Basic Colors"
basicLabelConstructor: "Label",
basicLabelDefaults: {
    autoDraw: false,
    margin: 0,
    paddingTop: 5,
    paddingBottom: 5,
    width: "100%", height: 15,
	wrap: false
},

// this layout contains the three DFs that contains RGB, HSL and HTML edit fields
formLayoutConstructor: "VLayout",
formLayoutDefaults: {
    autoDraw: false,
    membersMargin: 4
},

// this form contains items for editing the RGB values
rgbFormConstructor: "DynamicForm",
rgbFormDefaults: {
    autoDraw: false,
    cellPadding:1,
    width:65,
    colWidths: [60, "*"]
},

// this form contains items for editing the HSL values
hslFormConstructor: "DynamicForm",
hslFormDefaults: {
    autoDraw: false,
    cellPadding:1,
    width:65,
    colWidths: [60, "*"]
},

// this form contains an item for editing the HTML value
htmlFormConstructor: "DynamicForm",
htmlFormDefaults: {
    autoDraw: false,
    cellPadding:1,
    width:65
},

// the crosshair Img 
crossHairDefaults: {
    _constructor: "Img",
    autoDraw: false,
    imageWidth: 16, imageHeight: 16, 
    width: 16, height: 16, imageType: "normal",
    canDrag: true,
    canDrop: true,
    dragAppearance: "target",
    picker: this,
    dragMove: function () {
        this.picker._dragging = true;
        this.picker._crosshairMoved(
            this.parentElement.getOffsetX(), 
            this.parentElement.getOffsetY());
    }
},

// the box below the swatch, showing the current color
colorBoxDefaults: {
    _constructor: "Canvas",
    autoDraw: false, 
    width: "100%", 
    height: 30
},

// the box expressing opacity, overlaid on the colorBox (below the swatch, showing the current color)
opacityBoxDefaults: {
    _constructor: "Canvas",
    autoDraw: false, 
    width: 60, height: 30, 
    overflow: "hidden",
    // use the same style as the palette-squares, for the borders
    styleName: "colorChooserCell"
},

// the box expressing opacity, overlaid on the colorBox (below the swatch, showing the current color)
luminosityStackDefaults: {
    _constructor: "VStack",
    autoDraw: false,
    extraSpace: 5,
    overflow: "hidden",
    // use the same style as the palette-squares, for the borders
    styleName: "colorChooserCell"
},

opacitySliderDefaults : {
    _constructor: "Slider",
    autoDraw: false,
    vertical: false,
    minValue: 0,
    maxValue: 100,
    numValues: 100,
    length: 100,
    height: 12,
    width: 100,
    showTitle: false,
    showValue: false,
    labelWidth: 10,
    showRange: false,
    value: 100,
    dragStart : function () { return isc.EH.STOP_BUBBLING; },
    dragMove : function () { return isc.EH.STOP_BUBBLING; },
    dragStop : function () { return isc.EH.STOP_BUBBLING; }
},

//> @attr colorPicker.defaultColor (Text : #808080 : IR)
// The default color. This is the color that is selected when the picker first loads
// @visibility external
//<     
defaultColor: "#808080",

//> @attr colorPicker.colorButtonSize (number : 20 : IR)
// Width and height of the basic color boxes (they are always square, and they are
// all the same size).
// @visibility external
//<
colorButtonSize: 20,  

//> @attr colorPicker.colorButtonBaseStyle (CSSStyleName : "ColorChooserCell" : IR)
// Base CSS style applied to the basic color boxes 
// @visibility external
//<     
colorButtonBaseStyle : "colorChooserCell",

//> @attr colorPicker.colorArray (Array of String[] : [...] : IR)
// Array of 40 HTML color strings, used to render the basic color selection boxes.
// @visibility external
//<


colorArray: [
    "#000000",
    "#993300",
    "#333300",
    "#003300",
    "#003366",
    "#000080",
    "#333399",
    "#333333",

    "#800000",
    "#FF6600",
    "#808000",
    "#008000",
    "#008080",
    "#0000FF",
    "#666699",
    "#808080",

    "#FF0000",
    "#FF9900",
    "#99CC00",
    "#339966",
    "#33CCCC",
    "#3366FF",
    "#800080",
    "#999999",

    "#FF00FF",
    "#FFCC00",
    "#FFFF00",
    "#00FF00",
    "#00FFFF",
    "#00CCFF",
    "#993366",
    "#C0C0C0",

    "#FF99CC",
    "#FFCC99",
    "#FFFF99",
    "#CCFFCC",
    "#CCFFFF",
    "#99CCFF",
    "#CC99FF",
    "#FFFFFF"
],

numBasicColorRows: 5,
numBasicColorColumns: 8,

basicColorLayoutDefaults: {
    _constructor: "VLayout",
    autoParent: "none"
},

basicColorRowLayoutDefaults: {
    _constructor: "HLayout",
    layoutBottomMargin: 1,
    membersMargin: 1
},

basicColorSwatchDefaults: {
    autoDraw: false,
    _constructor: "StatefulCanvas",
    overflow: "hidden",
    title: "",
    showFocusOutline: false,
    showTitle: false,
    showFocused: true,
    showRollOver: true,
    showFocusedAsOver: true,
    canFocus: true,
    click : function () {
        var picker = this.creator;
        picker.setHtmlColor(this.backgroundColor);
        picker._oneClickColorSelected(this.backgroundColor);
    }
},

showLuminositySlider: false,
luminositySliderConstructor: "Slider",
luminositySliderDefaults: {
    autoDraw: true,
    minValue: 0,
    maxValue: 240,
    numValues: 240,
    width: 10,
    showTitle: false,
    showValue: false,
    showRange: false,
    dragStart : function () { return isc.EH.STOP_BUBBLING; },
    dragMove : function () { return isc.EH.STOP_BUBBLING; },
    dragStop : function () { return isc.EH.STOP_BUBBLING; }
},
    
//> @attr colorPicker.swatchWidth (number : 170 : IR)
// Displayed width of the color swatch image. The default width is approximately
// that used by the Windows&#174; XP color picking window
// @visibility external
//<     
swatchWidth:170,

//> @attr colorPicker.swatchHeight (number : 170 : IR)
// Displayed height of the color swatch image. The default height is approximately
// that used by the Windows&#174; XP color picking window
// @visibility external
//<     
swatchHeight:170, 

//> @attr colorPicker.lumStep (number : 4 : IR)
// The Luminosity bar shows the selected color tone at numerous levels of brightness,
// from black to white. It is implemented as a stack of isc.Canvas objects. This attribute
// determines the height of each of those canvases.
//<     
lumStep:4,           // The size of the steps in the Lum indicator

//> @attr colorPicker.lumWidth (number : 15 : IR)
// Width of the Luminosity bar
// @visibility external
//<     
lumWidth:15,       // The width of the Lum indicator
    
//> @attr colorPicker.supportsTransparency (Boolean : true : IR)
// Determines whether to show the opacity slider. This allows the user to select colors
// with an alpha element (ie, semi-transparent colors). If this attribute is set to false,
// no opacity slider is shown, and all colors are completely opaque.
// @visibility external
//<     
supportsTransparency:true, 

//> @attr colorPicker.opacityText (HTMLString : "Lorem ipsum dolor sit amet, consectetuer adipiscing elit." : IR)
// The text to show underneath the selected color box, so that it can 
// be seen through semi-transparent colors. If you do not want such text, set 
// this value to blank. This value is irrelevant if 
// +link{ColorPicker.supportsTransparency} is false.
// @visibility external
//<
opacityText: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",

//> @attr colorPicker.swatchImageURL (SCImgURL : "[SKIN]ColorPicker/spectrum.png" : IR)
// The location of the color swatch image file
// @visibility external
//<     
swatchImageURL: "[SKIN]ColorPicker/spectrum.png", 

//> @attr colorPicker.crosshairImageURL (SCImgURL : "[SKIN]ColorPicker/crosshair.png" : IR)
// The location of the crosshair image file
// @visibility external
//<     
crosshairImageURL: "[SKIN]ColorPicker/crosshair.png", 

//> @attr colorPicker.lessButtonTitle (HTMLString : "<< Less" : IR)
// The title for the button that switches to a less complex view.
// @group i18nMessages
// @visibility external
//<     
lessButtonTitle: "<< Less", 

//> @attr colorPicker.moreButtonTitle (HTMLString : "More >>" : IR)
// The title for the button that switches to a more complex view.
// @group i18nMessages
// @visibility external
//<
moreButtonTitle: "More >>", 

//> @attr colorPicker.basicColorLabel (HTMLString : "Basic Colors :" : IR)
// The label shown above the basic color blocks.
// @group i18nMessages
// @visibility external
//<
basicColorLabel: "Basic Colors :", 

//> @attr colorPicker.selectedColorLabel (HTMLString : "Selected Color" : IR)
// The label shown next to the selected color box.
// @group i18nMessages
// @visibility external
//<     
selectedColorLabel: "Selected Color:", 

//> @attr colorPicker.opacitySliderLabel (HTMLString : "Opacity" : IR)
// The label shown next to the opacity slider. Ignored if 
// +link{ColorPicker.supportsTransparency} is false.
// @group i18nMessages
// @visibility external
//<     
opacitySliderLabel: "Opacity:", 

//> @attr colorPicker.defaultOpacity (number : 100 : IR)
// The initial opacity value for the component, as a percentage value between 0 and 100
// @visibility external
//<     
defaultOpacity: 100, 

//> @attr colorPicker.redFieldTitle (HTMLString : "Red" : IR)
// The title for the 'Red' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<     
redFieldTitle: "Red", 

//> @attr colorPicker.redFieldPrompt (HTMLString : "The Red component of the selected color" : IR)
// The text to show when the mouse hovers over the 'Red' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<     
redFieldPrompt: "The Red component of the selected color", 

//> @attr colorPicker.greenFieldTitle (HTMLString : "Green" : IR)
// The title for the 'Green' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<     
greenFieldTitle: "Green", 

//> @attr colorPicker.greenFieldPrompt (HTMLString : "The Green component of the selected color" : IR)
// The text to show when the mouse hovers over the 'Green' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
greenFieldPrompt: "The Green component of the selected color", 

//> @attr colorPicker.blueFieldTitle (HTMLString : "Blue" : IR)
// The title for the 'Blue' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
blueFieldTitle: "Blue", 

//> @attr colorPicker.blueFieldPrompt (HTMLString : "The Blue component of the selected color" : IR)
// The text to show when the mouse hovers over the 'Blue' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
blueFieldPrompt: "The Blue component of the selected color", 

//> @attr colorPicker.htmlFieldTitle (HTMLString : "HTML" : IR)
// The title for the 'HTML' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
htmlFieldTitle: "HTML", 

//> @attr colorPicker.htmlFieldPrompt (HTMLString : "The selected color&#39;s HTML coding" : IR)
// The text to show when the mouse hovers over the 'HTML' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
htmlFieldPrompt: "The selected color&#39;s HTML coding", 

//> @attr colorPicker.hueFieldTitle (HTMLString : "Hue" : IR)
// The title for the 'Hue' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
hueFieldTitle: "Hue", 

//> @attr colorPicker.hueFieldPrompt (HTMLString : "The Hue (base tone) of the selected color" : IR)
// The text to show when the mouse hovers over the 'Hue' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
hueFieldPrompt: "The Hue (base tone) of the selected color", 

//> @attr colorPicker.satFieldTitle (HTMLString : "Sat" : IR)
// The title for the 'Sat' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
satFieldTitle: "Sat", 

//> @attr colorPicker.satFieldPrompt (HTMLString : "The Saturation (color purity) of the selected color" : IR)
// The text to show when the mouse hovers over the 'Saturation' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
satFieldPrompt: "The Saturation (color purity) of the selected color", 

//> @attr colorPicker.lumFieldTitle (HTMLString : "Luminosity" : IR)
// The title for the 'Luminosity' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
lumFieldTitle: "Lum", 

//> @attr colorPicker.lumFieldPrompt (HTMLString : "The Luminosity (brightness) of the selected color" : IR)
// The text to show when the mouse hovers over the 'Luminosity' field in the complex chooser.
// @group i18nMessages
// @visibility external
//<
lumFieldPrompt: "The Luminosity (brightness) of the selected color", 

//> @attr colorPicker.okButtonTitle (HTMLString : "OK" : IR)
// The title for the 'OK' button.
// @group i18nMessages
// @visibility external
//<
okButtonTitle: "OK", 

//> @attr colorPicker.cancelButtonTitle (HTMLString : "Cancel" : IR)
// The title for the 'Cancel' button.
// @group i18nMessages
// @visibility external
//<
cancelButtonTitle: "Cancel", 

//> @attr colorPicker.autoPosition (Boolean : true : IR)
// If true, causes the ColorPicker to appear near where the mouse was last clicked.
// If false, the ColorPicker is centered on first show; depending on the value of 
// +link{autoCenterOnShow}, it either reappears wherever it was last shown after hide/show(), 
// or centered regardless of where it was last shown.
// @see ColorPicker.autoCenterOnShow
// @visibility external
//<     
autoPosition: true,
    
//> @attr colorPicker.autoCenterOnShow (Boolean : true : IR)
// If +link{autoPosition} is false, this property controls whether to automatically center the
// colorPicker every time it is redisplayed with the show() method.
// @see ColorPicker.autoPosition
// @visibility external
//<     
autoCenterOnShow: true,

//> @attr colorPicker.autoHide (Boolean : null : IR)
// When this property is set to true, the <code>ColorPicker</code> will automatically hide when
// a color has been selected using the swatch picker, even in "complex" mode. By default it will
// only hide the <code>ColorPicker</code> in "simple" defaultPickMode.
// <p>
// Set this property to false to disable the <code>ColorPicker</code> from automatically hiding,
// this can be especially useful when for instance embedding this component inside another component.
//
// @see ColorPicker.defaultPickMode
// @visibility external
//<
autoHide: null,

//> @attr colorPicker.defaultPickMode (ColorPickerMode : "simple" : IR)
// The <code>ColorPicker</code> can operate in either a "simple" mode (where it displays just the
// 40 basic colors and allows the user to click one), or a "complex" mode (where the
// user can specify a color from anywhere in the spectrum, with an optional alpha
// element). The <code>defaultPickMode</code> attribute specifies which of these two modes is
// in force when the picker first loads.
// @see ColorPicker.allowComplexMode
// @setter setCurrentPickMode()
// @visibility external
//<
defaultPickMode: "simple",

//> @attr colorPicker.allowComplexMode (Boolean : true : IR)
// Should the "complex" mode be allowed for this ColorPicker?
// If false, no "More" button is shown on the simple picker
// @visibility external
//<     
allowComplexMode: true,

_updateColor: true 
});
    
isc.ColorPicker.addMethods({

// Override show() to position near the mouse
show : function () {
    // place the picker immediately adjacent to the mouse pointer, keeping it onscreen
    if (this.autoPosition) {
        this.autoCenter = false;
        var event = isc.EH.getLastEvent();
        this.placeNear(event.x, event.y);
    } else {
        // Looks like DnD unsets autoCenter - that's great for the general case, but we need 
        // the option to re-center every time after a hide/show.
        if (this.autoCenterOnShow) this.autoCenter = true;
    }

    this.Super("show", arguments);

    if (this.cancelButton) {
        this.cancelButton.focus();
    }
},

// Check that the ColorPicker remains onscreen when it is displayed in complex mode
redraw : function () {
    this.Super("redraw", arguments);
    // Assure that it is onscreen
    if (this.autoPosition) {
        this.autoCenter = false;
        this.placeNear(this.left, this.top);
    }
},

// the window title is in the language packs as "selectTitle", so set a default here in case 
// we don't load one
selectTitle: "Select a Color",
initWidget : function () {
    this.Super("initWidget", arguments);

    this.title = this.selectTitle;

    this._currentPickMode = this.defaultPickMode;
    if (!this.allowComplexMode) {
        this._currentPickMode = "simple";
    }

    this.addAutoChild("basicColorLayout");

    var numBasicColorRows = this.numBasicColorRows,
        numBasicColorColumns = this.numBasicColorColumns;
    
    var basicColorRowProperties = {
        height: this.colorButtonSize
    };
    for (var i = 0; i < numBasicColorRows; ++i) {
        var wk = this.createAutoChild("basicColorRowLayout", basicColorRowProperties);
        for (var j = 0; j < numBasicColorColumns; ++j) {
            var wk2 = this.createAutoChild("basicColorSwatch", {
                baseStyle: this.colorButtonBaseStyle,
                width: this.colorButtonSize,
                height: this.colorButtonSize,
                backgroundColor: this.colorArray[i * numBasicColorColumns + j]
            });
            wk.addMember(wk2);
        }
        this.basicColorLayout.addMember(wk);
    }

    this.leftLayout = this.createAutoChild("leftLayout");

    this.leftLayout.addMember(this.basicColorLayout);

    this.innerContentLayout = this.createAutoChild("innerContentLayout");
    this.innerContentLayout.addMembers([this.leftLayout]);

    this.contentLayout = this.createAutoChild("contentLayout");
    this.contentLayout.addMembers([ this.innerContentLayout ]);
    //this.addItem(this.contentLayout);

    this.bodyLayout = this.createAutoChild("bodyLayout");
    this.bodyLayout.addMember(this.contentLayout);
    //this.body.addMember(this.contentLayout);

    // Store the original value of showOkButton so we can set that value when in complex mode.
    this._showOkButtonInComplexMode = this.showOkButton;

    if (this._currentPickMode === "simple") {
        this.showOkButton = false;
    }

    if (!this.allowComplexMode) {
        this.showModeToggleButton = false;
    }

    this.addAutoChild("buttonLayout");
    this.addAutoChild("okButton", {title: this.okButtonTitle});
    this.addAutoChild("cancelButton", {title: this.cancelButtonTitle});
    this.addAutoChild("modeToggleButton", {
        title: (this._currentPickMode == "simple" && this.allowComplexMode ? this.moreButtonTitle : this.lessButtonTitle)
    });
    //this.contentLayout.addMember(this.buttonLayout);

    if (this._currentPickMode != "simple") {
        this.createComplexElements();
        this.addComplexElements();
    }

    this.bodyLayout.addMember(this.buttonLayout);
    
    //this.body.addMember(this.contentLayout);

    this.addItem(this.bodyLayout);

    this.setHtmlColor(this.defaultColor);
    this._setLumVals();
    this.setOpacity(this.defaultOpacity);

},

draw : function () {
    this.Super("draw", arguments);
    if (this.buttonLayout) this.buttonLayout.setWidth(this.body.getVisibleWidth());
},

createComplexElements : function () {

    if (this._currentPickMode != 'complex') {
        return;
    }        

    this.rgbForm = this.createAutoChild("rgbForm", { picker: this,
        fields: [ 
            {
                name: "pickerRedVal", title:this.redFieldTitle, type: "text", 
                width: 50, defaultValue: this._pickedRed,
                prompt: this.redFieldPrompt,
                picker: this,
                changed: function (form,item,value) { this.picker.setRed(value); } 
            },
            {
                name: "pickerGrnVal", title:this.greenFieldTitle, type: "text", 
                width: 50, defaultValue: this._pickedGrn,
                prompt: this.greenFieldPrompt,
                picker: this,
                changed: function (form,item,value) { this.picker.setGreen(value); } 
            },
            {
                name: "pickerBluVal", title:this.blueFieldTitle, type: "text", 
                width: 50, defaultValue: this._pickedBlu,
                prompt: this.blueFieldPrompt,
                picker: this,
                changed: function (form,item,value) { this.picker.setBlue(value); } 
            }
        ]
    });
    this.hslForm = this.createAutoChild("hslForm", { picker: this,
        fields: [ 
            {
                name: "pickerHueVal", title:this.hueFieldTitle, type: "text", 
                width: 49, defaultValue: this._pickedHue,
                prompt: this.hueFieldPrompt,
                picker: this,
                changed: function (form,item,value) { this.picker.setHue(value); } 
            },
            {
                name: "pickerSatVal", title:this.satFieldTitle, type: "text", 
                width: 49, defaultValue: this._pickedSat,
                prompt: this.satFieldPrompt,
                picker: this,
                changed: function (form,item,value) { this.picker.setSaturation(value); } 
            },
            {
                name: "pickerLumVal", title:this.lumFieldTitle, type: "text", 
                width: 49, defaultValue: this._pickedLum,
                prompt: this.lumFieldPrompt,
                picker: this,
                changed: function (form,item,value) { this.picker.setLuminosity(value); } 
            }
        ]
    });
    
    this.htmlForm = this.createAutoChild("htmlForm", { picker: this,
        fields: [ 
            {
                name: "pickerHtmlVal", title:this.htmlFieldTitle, type: "text", 
                width: 90, defaultValue: this._pickedHtml,
                prompt: this.htmlFieldPrompt,
                picker: this,
                changed: function (form,item,value) { this.picker.setHtmlColor(value); } 
            }
        ]
    });

    this.crossHair = this.createAutoChild("crossHair", { 
        picker: this, 
        src: this.crosshairImageURL 
    });

    this.colorBox = this.createAutoChild("colorBox", { 
        picker: this, 
        backgroundColor: this.getHtmlColor()
    });
 
    this.opacityBox = this.createAutoChild("opacityBox", { 
        picker: this, 
        contents: this.opacityText,
        children: [
            this.colorBox
        ]
    });
                            
    this.luminosityStack = this.createAutoChild("luminosityStack", { 
        picker: this, 
        height: this.swatchHeight+2,
        width: this.lumWidth,
        click: function () {
            // we need to subtract 2 to isc.EH.getY() to obtain a more accurate result to set it to the 
            // luminosity Slider (border x 2)
            var finalValue = this.picker.luminositySlider._getValueFromCoords(true, [isc.EH.getX(), isc.EH.getY()-2], true);
            this.picker.luminositySlider.setValue(finalValue);
        }
    });
    
    var count = Math.ceil(this.swatchHeight/this.lumStep)
    for (var i = 0; i < count; i++) {
        this.luminosityStack.addMember(isc.Canvas.create({
            autoDraw: false,
            width: this.lumWidth, height: this.lumStep, 
            margin: 0, padding: 0, overflow: "hidden"
        }));
    }
    
    this.luminositySlider = this.createAutoChild("luminositySlider", { length: this.swatchHeight, height: this.swatchHeight });
        
    if (this.supportsTransparency) {
    
        this.opacitySlider = this.createAutoChild("opacitySlider", { 
            picker: this
        });
        
        this._opacityLayout = isc.HLayout.create({
            membersMargin: 5,
            members: [
                isc.Label.create({
                    autoDraw: false,
                    contents: this.opacitySliderLabel, 
                    width: this.swatchWidth - 105, height: 10}),
                    
                this.opacitySlider
            ]
        });
    }

    this._rightHandLayout = isc.VLayout.create({
        autoDraw: false,
        //layoutLeftMargin: 5,
        membersMargin: 5,
        members: [
            isc.HLayout.create({
                autoDraw: false,
                height: this.swatchHeight,
                membersMargin: 5,
                members: [
                    isc.Img.create({
                        autoDraw: false,
                        // Note: width and height have 2 added to them here, to allow 
                        // for the 1px border around the image
                        //width: this.swatchWidth+12, height: this.swatchHeight+12, 
                        width: this.swatchWidth+2, height: this.swatchHeight+2, 
                        src: this.swatchImageURL,
                        overflow: "hidden",
                        styleName: "colorChooserCell",
                        picker: this,
                        click: function () {
                            this.picker._crosshairMoved(this.getOffsetX(), this.getOffsetY());
                        },
                        
                        children: [
                            this.crossHair
                        ]
                    })
                ]
            }), 
            isc.HLayout.create({
                autoDraw: false,
                membersMargin: 5,
                defaultLayoutAlign: "center",
                members: [
                    isc.Label.create({
                        autoDraw: false,
                        contents: this.selectedColorLabel, 
                        width: this.swatchWidth - 63, height: 15
                    }),
                    this.opacityBox
                 ]
            })
        ]
    });
    
    this._rightEdgeLayout = isc.HLayout.create({
        autoDraw: false,
        height: "100%",
        width: 1,
        overflow: "visible",
        members: [
            this.luminosityStack,
            this.luminositySlider
        ]
    });

    if (this.luminositySlider) this.observe(this.luminositySlider, "valueChanged", "observer.luminositySliderChanged()");
    if (this.opacitySlider) this.observe(this.opacitySlider, "valueChanged", "observer._opSliderChanged()");

},

initComplexElements : function () {
    if (!this.luminositySlider) this.luminositySlider = this.createAutoChild("luminositySlider", { length: this.swatchHeight });
    this.luminositySlider.setValue(this._pickedLum);
    this._setLumVals();
    this._positionCrossHair(this._pickedHue, this._pickedSat);
    // run through setHtmlColor to update the RGB and HTML forms
    if (this._pickedHtml) this.setHtmlColor(this._pickedHtml);
    
    this.colorBox.setBackgroundColor(
        isc.ColorUtils.hslToHtml( this._pickedHue,
                                  this._pickedSat,
                                  this._pickedLum ) );        
    if (this.supportsTransparency) {
        this.colorBox.setOpacity(this._pickedOpacity);
        this.opacitySlider.setValue(this._pickedOpacity);
    }
},

addComplexElements : function () {

    if (this._currentPickMode != 'complex') {
        return;
    }

    this.showOkButton = this._showOkButtonInComplexMode;
    this.setAutoChild("okButton", {title: this.okButtonTitle});
    this.buttonLayout.setMembers([this.okButton, this.cancelButton, this.modeToggleButton]);
    
    if (!this.basicLabel) {
        this.basicLabel = this.createAutoChild("basicLabel", { contents: this.basicColorLabel });
    }
    
    if (!this._formContainer) {
        this._formContainer = isc.HLayout.create({
            autoDraw: false,
            membersMargin: 4,
            members: [
                this.rgbForm,
                this.hslForm
            ]
        });
    }
    
    
    if (!this.formLayout) {
        this.formLayout = this.createAutoChild("formLayout");
        this.formLayout.addMembers([ this._formContainer, this.htmlForm ]);
    }
    
    //this.leftLayout.addMember(this.basicLabel, 0);
    this.contentLayout.addMember(this.basicLabel, 0);
    this.leftLayout.addMember(this.formLayout);
    
    if (this.supportsTransparency) {
        this._rightHandLayout.addMember(this._opacityLayout);
        //this._rightEdgeLayout.addMember(this._opacityLayout);
    }

    this.innerContentLayout.addMember(this._rightHandLayout);
    this.innerContentLayout.addMember(this._rightEdgeLayout);

    // Initialise the complex elements
    this.initComplexElements();

},
    

removeComplexElements : function () {

    if (this._currentPickMode == 'complex') {
        return;
    }

    this.showOkButton = false;
    this.setAutoChild("okButton");
 
    if (this.formLayout) {   
        this.contentLayout.removeMembers([this.basicLabel]);
        this.leftLayout.removeMembers([this.formLayout]);
        this.innerContentLayout.removeMembers([this._rightHandLayout, this._rightEdgeLayout]);
    }

},

//> @method colorPicker.setSupportsTransparency
// Set the +link{supportsTransparency} flag.
// @param transparencyFlag (boolean) Set to true to enable transparency/opacity
// @visibility external
//<
setSupportsTransparency : function (transparencyFlag) {
    this.supportsTransparency = transparencyFlag;
    if (this._currentPickMode == 'complex') {
        if (this.supportsTransparency) {
            this._rightHandLayout.addMember(this._opacityLayout);
        } else {
            this._rightHandLayout.removeMember(this._opacityLayout);            
        }
    }
},

//> @method colorPicker.getRed()
// Returns the Red element of the currently-selected color, as an integer from 0-255
// @see ColorPicker.setRed()
// @return (int) red color component
// @visibility external
//<
getRed : function () {
    return this._pickedRed;
},

//> @method colorPicker.getGreen()
// Returns the Green element of the currently-selected color, as an integer from 0-255
// @see ColorPicker.setGreen()
// @return (int) green color component
// @visibility external
//<
getGreen : function () {
    return this._pickedGrn;
},

//> @method colorPicker.getBlue()
// Returns the Blue element of the currently-selected color, as an integer from 0-255
// @see ColorPicker.setBlue()
// @return (int) blue color component
// @visibility external
//<
getBlue : function () {
    return this._pickedBlu;
},

//> @method colorPicker.getHue()
// Returns the Hue of the currently-selected color, as an integer from 0-239
// @see ColorPicker.setHue()
// @return (int) hue value
// @visibility external
//<
getHue : function () {
    return this._pickedHue;
},


//> @method colorPicker.getSaturation()
// Returns the Saturation of the currently-selected color, as an integer from 0-240
// @see ColorPicker.setSaturation()
// @return (int) saturation value
// @visibility external
//<
getSaturation : function () {
    return this._pickedSat;
},


//> @method colorPicker.getLuminosity()
// Returns the Luminosity (brightness) of the currently-selected color, as an 
// integer from 0-240
// @see ColorPicker.setLuminosity()
// @return (int) luminosity value
// @visibility external
//<
getLuminosity : function () {
    return this._pickedLum;
},


//> @method colorPicker.getHtmlColor()
// Returns the currently-selected color, in HTML color representation form, as a string.
// HTML color representation is a hash sign, followed by the red, green and blue elements
// of the color in 2-digit hex form - for example "#F17F1D"
// @see ColorPicker.setHtmlColor()
// @return (String) HTML color value
// @visibility external
//<
getHtmlColor : function () {
    return this._pickedHtml;
},


//> @method colorPicker.getOpacity()
// Returns the opacity of the currently-selected color, as an integer from 0-100. If 
// opacity is switched off, this is always 100.
// @return (int) opacity value
// @visibility external
//<
getOpacity : function () {
    return this._pickedOpacity;
},
    
//> @method colorPicker.setRed()
// Sets the Red element of the selected color
// @param newValue (Number) An integer between 0 and 255
// @see ColorPicker.getRed()
// @visibility external
//<
setRed : function (val) {
    if (val < 0) this._pickedRed = 0;
    else if (val > 255) this._pickedRed = 255;
    else this._pickedRed = val/1;
    
    if (this._currentPickMode == 'complex') {
        this.rgbForm.setValue("pickerRedVal", this._pickedRed);
    }
    if (this._updateColor === true)
        this._changeColor('rgb');
},

    
//> @method colorPicker.setGreen
// Sets the Green element of the selected color
// @param newValue (Number) An integer between 0 and 255
// @see ColorPicker.getGreen()
// @visibility external
//<
setGreen : function (val) {
    if (val < 0) this._pickedGrn = 0;
    else if (val > 255) this._pickedGrn = 255;
    else this._pickedGrn = val/1;
    
    if (this._currentPickMode == 'complex') {
        this.rgbForm.setValue("pickerGrnVal", this._pickedGrn);
    }
    if (this._updateColor === true)
        this._changeColor('rgb');
},
    
//> @method colorPicker.setBlue()
// Sets the Blue element of the selected color
// @param newValue (Number) An integer between 0 and 255
// @see ColorPicker.getBlue()
// @visibility external
//<
setBlue : function (val) {
    if (val < 0) this._pickedBlu = 0;
    else if (val > 255) this._pickedBlu = 255;
    else this._pickedBlu = val/1;
    
    if (this._currentPickMode == 'complex') {
        this.rgbForm.setValue("pickerBluVal", this._pickedBlu);
    }
    if (this._updateColor === true)
        this._changeColor('rgb');
},
            
//> @method colorPicker.setHue()
// Sets the Hue of the selected color
// @param newValue (Number) An integer between 0 and 239
// @see ColorPicker.getHue()
// @visibility external
//<
setHue : function (val) {
    if (val < 0) this._pickedHue = 0;
    else if (val > 239) this._pickedHue = 239;
    else this._pickedHue = val/1;
    
    if (this._currentPickMode == 'complex') {
        this.hslForm.setValue("pickerHueVal", this._pickedHue);
    }
    if (this._updateColor === true)
        this._changeColor('hsl');
},
    
//> @method colorPicker.setSaturation()
// Sets the Saturation of the selected color
// @param newValue (Number) An integer between 0 and 240
// @see ColorPicker.getSaturation()
// @visibility external
//<
setSaturation : function (val) {
    if (val < 0) this._pickedSat = 0;
    else if (val > 240) this._pickedSat = 240;
    else this._pickedSat = val/1;
    
    if (this._currentPickMode == 'complex') {
        this.hslForm.setValue("pickerSatVal", this._pickedSat);
    }
    if (this._updateColor === true) {
        this._changeColor('hsl');
    }
},
    
//> @method colorPicker.setLuminosity()
// Sets the Luminosity (brightness) of the selected color
// @param newValue (Number) An integer between 0 and 240
// @see ColorPicker.getLuminosity()
// @visibility external
//<
// additional dontPersist flag: If passed, we reset the luminosity to 50% when
// the user picks a new color via the swatch
// This is useful for the case where the user picks an HTML color value which
// includes luminosity implicitly.
// In this case if the user then picks from the swatch we don't want to retain this
// luminosity setting. This is most obvious if the user picks black (luminosity zero)
// - if we hung onto that setting it'd make subsequent choices in the swatch have no
// effect on the resultant color (still black!)
setLuminosity : function (val, dontPersist) {
    if (val < 0) this._pickedLum = 0;
    else if (val > 240) this._pickedLum = 240;
    else this._pickedLum = val/1;
    
    this._persistLum = !dontPersist;
    
    if (this._currentPickMode == 'complex') {
        this.hslForm.setValue("pickerLumVal", this._pickedLum);
    }
    if (this._updateColor === true)
        this._changeColor('hsl');
},
    
//> @method colorPicker.setHtmlColor()
// Changes the selected color to the one represented by the supplied HTML color 
// string. Note that the method only accepts the parameter if it represents a 
// valid color (otherwise it is simply ignored).
// @param newValue (Text) A string in HTML color representation format (#RRGGBB)
// @see ColorPicker.getHtmlColor()
// @visibility external
//<
setHtmlColor : function (val) {
    if (isc.ColorUtils.encodingIsValid(val) === true) {
        this._pickedHtml = val.toUpperCase();
        if (this._currentPickMode == 'complex') {
            this.htmlForm.setValue("pickerHtmlVal", this._pickedHtml);
        }
        if (this._updateColor === true)
            this._changeColor('html');
    }
},
    
    
//> @method colorPicker.setOpacity()
// Sets the Opacity of the selected color. Ignored if opacity is switched off.
// @param newValue (Number) An integer between 0 and 100
// @see ColorPicker.getOpacity()
// @visibility external
//<
setOpacity : function (val) {
    if (this._currentPickMode == 'complex' && this.supportsTransparency) {
        if (val < 0) this._pickedOpacity = 0;
        else if (val > 100) this._pickedOpacity = 100;
        else this._pickedOpacity = val/1;
        
        if (this._updateColor === true) {
            this._changeColor('opacity');
        }
    }
},

_changeColor : function (src) {
    
    if (src == 'rgb') {
        
        var hsl = isc.ColorUtils.rgbToHsl( this._pickedRed,
                                        this._pickedGrn,
                                        this._pickedBlu );
        this._updateColor = false;
        this.setHue(hsl.h);
        this.setSaturation(hsl.s);
        // pass in the param to forget the luminosity if the user changes positions in
        // the swatch
        this.setLuminosity(hsl.l, true);
        this.setHtmlColor(isc.ColorUtils.rgbToHtml(this._pickedRed,
                                                   this._pickedGrn,
                                                   this._pickedBlu));
        this._updateColor = true;
        // Move the crosshair 
        this._positionCrossHair( this._pickedHue,
                                 this._pickedSat);
    } else if (src == 'hsl') {
        if (!this._persistLum) this._pickedLum = 120;
        var rgb = isc.ColorUtils.hslToRgb( this._pickedHue,
                                           this._pickedSat,
                                           this._pickedLum );
        this._updateColor = false;
        this.setRed(rgb.r);
        this.setGreen(rgb.g);
        this.setBlue(rgb.b);
        this.setHtmlColor(isc.ColorUtils.rgbToHtml(this._pickedRed,
                                                   this._pickedGrn,
                                                   this._pickedBlu));
        this._updateColor = true;
        // Move the crosshair, if necessary (if only the Luminosity
        // has changed, the crosshair does not need to move. If we move 
        // it anyway, precision loss issues might cause it to choose
        // a pixel in the color swatch adjacent to the one we currently
        // have, rather than that exact pixel.  This is a problem if the
        // user is changing Lum with the slider - as they smoothly slide 
        // the value up and down, we get a very annoying "wobbly cursor"
        // effect...)
        if (this._pickedHue != this._savHue || this._pickedSat != this._savSat) {
            this._positionCrossHair( this._pickedHue,
                                      this._pickedSat);
        }
    } else if (src == 'html') {  
                                    
        var rgb = isc.ColorUtils.htmlToRgb( this._pickedHtml );

        this._updateColor = false;
        this.setRed(rgb.r);
        this.setGreen(rgb.g);
        this.setBlue(rgb.b);

        var hsl = isc.ColorUtils.rgbToHsl(  this._pickedRed,
                                        this._pickedGrn,
                                        this._pickedBlu );
        this.setHue(hsl.h);
        this.setSaturation(hsl.s);
        this.setLuminosity(hsl.l, true);
        this._updateColor = true;
        // Move the crosshair 
        this._positionCrossHair( this._pickedHue,
                                 this._pickedSat);
    }
    

    // and the slider value
    if (this._currentPickMode == 'complex') {
        if (!this.luminositySlider) this.luminositySlider = this.createAutoChild("luminositySlider", { length: this.swatchHeight });
        this.luminositySlider.setValue(this._pickedLum);
        this.hslForm.setValue("pickerLumVal", this._pickedLum);
    }

    // Now set the color box - use HSL, though we could use either as they
    // are now the same...
    if (this._currentPickMode == 'complex') {
        this.colorBox.setBackgroundColor(
                            isc.ColorUtils.hslToHtml( this._pickedHue,
                                                      this._pickedSat,
                                                      this._pickedLum ) );        
    }

    // Change the luminosity bar (for performance reasons, only do this
    // if the Hue or Sat have changed)
    if (this._pickedHue != this._savHue || this._pickedSat != this._savSat) {
        this._setLumVals();
    }
    
    // Set the opacity
    if (this._currentPickMode == 'complex' && this.supportsTransparency) {
        this.colorBox.setOpacity(this._pickedOpacity);
        if (this.opacitySlider != null) {
            var slider = this.opacitySlider,
                sliderVal = slider.getValue(),
                newSliderVal = this._pickedOpacity;
            if (newSliderVal === null) newSliderVal = 100;
            if (sliderVal != newSliderVal) this.opacitySlider.setValue(this._pickedOpacity);
        }
    }
    
    // Save the existing Hue and Saturation - we only want to reposition the 
    // crosshair if either actually changes, otherwise we get an annoying 
    // wobbling effect when we move the Luminosity slider
    this._savHue = this._pickedHue;
    this._savSat = this._pickedSat;
    
    if (this.colorChanged) this.colorChanged();
},

// Called when a color box is clicked in simple mode
_oneClickColorSelected : function (color) {
    // Only hide if either autoHide is unset or if it has been set to true.
    if (((this.autoHide === undefined || this.autoHide === null) && this._currentPickMode === "simple")
        || this.autoHide === true)
    {
        this.hide();
    }

    if (this.colorSelected) {
        this.colorSelected(color);
    }
},

_positionCrossHair : function (hue, sat) {

    if (hue == null || sat == null) return;
    
    if (this._currentPickMode != 'complex') {
        return;
    }
    
    if (this._dragging === true) {
        this._dragging = false;
        return;
    }
    
    var ph = hue / 239.0;
    var ps = sat / 240.0;
    
    ph *= this.swatchWidth;
    ps = this.swatchHeight - (ps * this.swatchHeight); 
    
    ph = parseInt(ph) - 8;
    ps = parseInt(ps) - 8;
            
    this.crossHair.setLeft(ph);
    this.crossHair.setTop(ps);
    
},

_crosshairMoved : function (h, s) {

    h -= 5;  // Account for margin and border. Note that I'm using 5 rather than
    s -= 5;  // 6 here because it gives a more accurate result - maybe SmartClient
             // doesn't include the border...?
    
    h /= this.swatchWidth;
    s = 1.0 - s/this.swatchHeight;
    
    this._updateColor = false;  // Just to stop it updating the screen twice
    this.setHue(Math.floor(h * 239.0 + 0.5));
    this._updateColor = true;
    this.setSaturation(Math.floor(s * 240.0 + 0.5));
},

_setLumVals : function () {
    if (this._currentPickMode != 'complex') {
        return;
    }
    
    for (var i = 0; i < this.swatchHeight/this.lumStep; i++) {
        this.luminosityStack.members[i].setBackgroundColor(
                        isc.ColorUtils.hslToHtml(
                               this._pickedHue,
                               this._pickedSat,
                               240-(i * 240/(this.swatchHeight/this.lumStep))
                            ));
    }
    
}, 

luminositySliderChanged : function () {
    var wk = this.luminositySlider.getValue();
    if (this._pickedLum != wk) {
        this.setLuminosity(wk);
    }
},

_opSliderChanged : function () {
    this.setOpacity(this.opacitySlider.getValue());
},

//> @method colorPicker.setCurrentPickMode()
// Changes the pick mode of this <code>ColorPicker</code> to <code>pickMode</code>.
// <p>
// Note: It is not allowed to set the pick mode to
// <smartclient>"complex"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.ColorPickerMode#COMPLEX}</smartgwt>
// if +link{ColorPicker.allowComplexMode,allowComplexMode} is <code>false</code>.
// @param pickMode (ColorPickerMode) the new pick mode.
// @visibility external
//<
setCurrentPickMode : function (pickMode) {
    if (this._currentPickMode == pickMode) return;

    if (pickMode == "simple" || !this.allowComplexMode) {
        this._currentPickMode = "simple";
        this.removeComplexElements();
        if (this.allowComplexMode) {
            this.modeToggleButton.setTitle(this.moreButtonTitle);
        }
    } else {
        this._currentPickMode = "complex";
        if (!this._rightHandLayout) {
            this.createComplexElements();
        }
        this.addComplexElements();
        this.modeToggleButton.setTitle(this.lessButtonTitle);
    }
    this.modeToggleButton.setState("");
    
    this.reflow();
    
    // Check that remains onscreen when redrawn
    this.markForRedraw();
},

_togglePickMode : function () {
    this.setCurrentPickMode(this._currentPickMode == "simple" ? "complex" : "simple");
}
}); 


isc.ColorPicker.registerStringMethods({
    
    //> @method colorPicker.colorChanged
    // Override this method to be kept informed when the ColorPicker changes in real-time 
    // (for example, if you need to update your own GUI accordingly). Then use the 
    // getXxxx() methods (for example, +link{getBlue,getBlue()} or 
    // +link{getLuminosity,getLuminosity()})to obtain current state as required. 
    // @see ColorPicker.colorSelected()
    // @visibility external
    //<
    colorChanged : "",
    
    //> @method colorPicker.colorSelected
    // Override this method to be notified when the user selects a color
    // either by clicking a basic color box in simple mode, or by clicking 
    // the OK button in complex mode. It is not intended that client code 
    // call this method. The <code>ColorPicker</code> may automatically hide
    // itself after calling this method depending on +link{autoHide} and
    // +link{defaultPickMode}.
    // @param color   (String)  The color selected, in HTML format.
    // @param opacity (Integer) The selected opacity, from 0 (transparent) to 100 (opaque),
    //                          or null if +link{supportsTransparency} is false or the picker
    //                          selected a color while in +link{ColorPickerMode,simple mode}.
    // @see ColorPicker.colorChanged()
    // @visibility external
    //<
    colorSelected : "color,opacity"
});    


/*-----------------------------------------------------------------------------------*/

// The ColorUtils class contains class methods that are generally useful when you
// are working with colors - for example, conversion routines to convert between
// HTML, RGB and HSL color formats.
//
// Not documenting these for now - probably don't have much general-purpose 
// usefulness

isc.ClassFactory.defineClass("ColorUtils", isc.Class).addClassMethods({

//*******************************************************
//  hexToDec
//  Returns the decimal equivalent of the passed-in hex string
//*******************************************************
hexToDec : function (hex) {
    return parseInt(hex, 16);        
},

//*******************************************************
//  decToHex
//  Returns the hexadecimal equivalent of the passed-in decimal number
//*******************************************************
decToHex : function (dec) {
    var d = dec/1;
    var h = d.toString(16);
    if (h.length == 1) {
        h = "0" + h;
    }
    return h;
},

//*******************************************************
//  brightness
//  Returns the brightness (luminosity) of the supplied RGB values
//*******************************************************
brightness : function (r, g, b) {
    var hsl = isc.ColorUtils.rgbToHsl(r, g, b);
    return (hsl.l / 240.0);
},

//*******************************************************
//  encodingIsValid
//  Returns true if the supplied string is a valid HTML color
//*******************************************************
encodingIsValid : function (html) {
    return (html.substring(0, 1) == '#' && isc.isA.color(html));
},


//*******************************************************
//  rgbToHtml
//  Converts an RGB triplicate to an HTML color string
//*******************************************************
rgbToHtml : function (r, g, b) {
    var htmlCol = '#' + isc.ColorUtils.decToHex(r) + 
                        isc.ColorUtils.decToHex(g) + 
                        isc.ColorUtils.decToHex(b);
    return htmlCol;
},

//*******************************************************
//  hslToHtml
//  Converts an HSL triplicate to an HTML color string
//*******************************************************
hslToHtml : function (h, s, l) {
    var rgb = isc.ColorUtils.hslToRgb(h, s, l);
    var htmlCol = '#' + isc.ColorUtils.decToHex(rgb.r) + 
                        isc.ColorUtils.decToHex(rgb.g) + 
                        isc.ColorUtils.decToHex(rgb.b);
    return htmlCol;
},

//*******************************************************
//  htmlToRgb
//  Converts an HTML color string to an RGB triplicate 
//*******************************************************
htmlToRgb : function (htmlString) {
    var r = htmlString.substring(1, 3);
    var g = htmlString.substring(3, 5);
    var b = htmlString.substring(5, 7);
    return {
        r: isc.ColorUtils.hexToDec(r),
        g: isc.ColorUtils.hexToDec(g),
        b: isc.ColorUtils.hexToDec(b)
    };
},

//*******************************************************
//  htmlToHsl
//  Converts an HTML color string to an HSL triplicate 
//*******************************************************
htmlToHsl : function (htmlString) {
    var r = htmlString.substring(1, 3);
    var g = htmlString.substring(3, 5);
    var b = htmlString.substring(5, 7);
    return isc.ColorUtils.rgbToHsl( isc.ColorUtils.hexToDec(r),
                                    isc.ColorUtils.hexToDec(g),
                                    isc.ColorUtils.hexToDec(b) );
},

//*******************************************************
//  rgbToHsl
//  Converts an RGB triplicate to an HSL triplicate
//*******************************************************
rgbToHsl : function (r, g, b) {
    var wr = r / 255.0;
    var wg = g / 255.0;
    var wb = b / 255.0;
    
    var min  = Math.min(Math.min(wr, wg), wb);
    var max  = Math.max(Math.max(wr, wg), wb);
    var delta = max - min;
    
    var h = 0, s = 0, l = 0;
    
    l = (max + min) / 2.0;
    
    if (max == min) {   // ie, a grey shade
        s = 0;
        h = 0;
    } else {
        if (l < 0.5) {
            s = (max - min) / (max + min);
        } else {
            s = (max - min) / (2.0 - max - min)
        }
        
        
        // Calculate hue
        if ( wr == max )
            h = ( wg - wb ) / delta;    // between yellow & magenta
        else if( wg == max )
            h = 2 + ( wb - wr ) / delta;    // between cyan & yellow
        else
            h = 4 + ( wr - wg ) / delta;    // between magenta & cyan                
    }

    // Scale the results        
    h = Math.floor(h * 40 + 0.5);
    if (h < 0) h += 240;
    s = Math.floor(s * 240 + 0.5);
    l = Math.floor(l * 240 + 0.5);
    
    return { h: h, s: s, l: l};
},
    
//*******************************************************
//  hslToRgb
//  Converts an HSL triplicate to an RGB triplicate
//  Note that, in keeping with Microsoft's color picking tool,
//  we expect the HSL values to be between 0 and 240 (239 for
//  Hue, because of the way the maths works out).
//*******************************************************
hslToRgb : function (h, s, l) {

    var wh = h / 239.0;
    var ws = s / 240.0;
    var wl = l / 240.0;
    var t1, t2, tr3, tg3, tb3;
    
    var r = 0, g = 0, b = 0;
    
    if (ws == 0) {   // ie, a completely neutral grey shade
        r = wl;
        g = wl;
        b = wl;
    } else {
        
        if (wl < 0.5) {
            t2 = wl * (1.0 + ws);
        } else {
            t2 = (wl + ws) - (wl * ws);
        }
        
        t1 = (2.0 * wl) - t2;
        
        tr3 = wh + 0.3333;
        tg3 = wh;
        tb3 = wh - 0.3333;
        
        if (tr3 < 0) tr3 += 1.0;
        if (tg3 < 0) tg3 += 1.0;
        if (tb3 < 0) tb3 += 1.0;

        if (tr3 > 1) tr3 -= 1.0;
        if (tg3 > 1) tg3 -= 1.0;
        if (tb3 > 1) tb3 -= 1.0;
        
        if (tr3 * 6.0 < 1) 
            r = t1 + (t2-t1) * 6.0 * tr3;
        else if (tr3 * 2.0 < 1)
            r = t2;
        else if (tr3 * 3.0  < 2)
            r = t1 + (t2-t1) * (0.6667 - tr3) * 6.0;
        else 
            r = t1;
        
        if (tg3 * 6.0 < 1) 
            g = t1 + (t2-t1) * 6.0 * tg3;
        else if (tg3 * 2.0 < 1)
            g = t2;
        else if (tg3 * 3.0  < 2)
            g = t1 + (t2-t1) * (0.6667 - tg3) * 6.0;
        else 
            g = t1;
        
        if (tb3 * 6.0 < 1) 
            b = t1 + (t2-t1) * 6.0 * tb3;
        else if (tb3 * 2.0 < 1)
            b = t2;
        else if (tb3 * 3.0  < 2)
            b = t1 + (t2-t1) * (0.6667 - tb3) * 6.0;
        else 
            b = t1;
    }        
    
    // And scale...
    r = Math.floor(r * 255.0 + 0.5);
    g = Math.floor(g * 255.0 + 0.5);
    b = Math.floor(b * 255.0 + 0.5);
    
    return { r: r, g: g, b: b};
}    
});

}
