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
//> @class SpinnerItem
//
// Item for picking a number. Includes arrow buttons to increase / decrease the value
//
// @inheritsFrom TextItem
// @treeLocation Client Reference/Forms/Form Items
// @visibility external
// @example spinnerItem
//<
isc.ClassFactory.defineClass("SpinnerItem", "TextItem");

isc.SpinnerItem.addClassProperties({

    
    INCREASE_ICON: {},
    DECREASE_ICON: {}

    //> @attr   spinnerItem.mask  (String : null : IRWA)
    // Not applicable to a SpinnerItem.
    // @visibility  external
    //<    
    //> @attr   spinnerItem.maskSaveLiterals   (boolean : null : IRWA)
    // Not applicable to a SpinnerItem.
    // @visibility  external
    //<    
    //> @attr   spinnerItem.maskPadChar   (String : " " : IRWA)
    // Not applicable to a SpinnerItem.
    // @visibility  external
    //<    
    //> @attr   spinnerItem.maskPromptChar   (String : "_" : IRWA)
    // Not applicable to a SpinnerItem.
    // @visibility  external
    //<    
    //> @attr   spinnerItem.maskOverwriteMode   (boolean : null : IRWA)
    // Not applicable to a SpinnerItem.
    // @visibility  external
    //<    

});

isc.SpinnerItem.addProperties({

    defaultType: "float",

    // Don't fire the change handler on every keypress, as we need the user to be able
    // to enter partial numbers (like the string "-") without us trying to validate it as a 
    // number
    changeOnKeypress:false,

    // Don't allow tabbing to the spinner icons - you already have keyboard support via up and
    // down arrows, and we don't support rolling the vals up and down via keypresses on the
    // icons...
    canTabToIcons:false,

    // Default to matching the height of the 2 spinners exactly.
    height:18,

    //> @attr spinnerItem.unstackedTextBoxStyle (FormItemBaseStyle : "textItem" : IR)
    // In +link{SpinnerItem.writeStackedIcons,unstacked mode}, the base CSS class name for the
    // <code>SpinnerItem</code>'s text box element.
    // <P>
    // NOTE: See the +link{group:CompoundFormItem_skinning} discussion for special
    // skinning considerations.
    // @group appearance
    // @visibility external
    //<
    unstackedTextBoxStyle: "textItem",

    //> @attr spinnerItem.unstackedPrintTextBoxStyle (FormItemBaseStyle : null : IR)
    // In +link{SpinnerItem.writeStackedIcons,unstacked mode}, the base CSS class name for the
    // <code>SpinnerItem</code>'s text box element when printed. If unset, then +link{SpinnerItem.unstackedTextBoxStyle}
    // is used.
    // @group appearance
    // @visibility external
    //<
    //unstackedPrintTextBoxStyle: null,

    //> @attr spinnerItem.unstackedReadOnlyTextBoxStyle (FormItemBaseStyle : null : IR)
    // @group appearance
    // @visibility external
    //<
    //unstackedReadOnlyTextBoxStyle: null,

    //> @attr   SpinnerItem.step    (double : 1 : IRW)
    // How much should the value be incremented / decremented when the user hits the icons
    // to increase / decrease the value?
    // <p>
    // <smartclient>
    // When overriding +link{SpinnerItem.getNextValue()} and/or +link{SpinnerItem.getPreviousValue()},
    // the sign of the step value determines whether these methods
    // </smartclient><smartgwt>
    // When providing a {@link com.smartgwt.client.widgets.form.fields.SpinnerItem#setNextValueHandler(NextValueHandler)
    // nextValueHandler} and/or {@link com.smartgwt.client.widgets.form.fields.SpinnerItem#setPreviousValueHandler(PreviousValueHandler)
    // previousValueHandler}, the sign of the step value determines whether these handlers
    // </smartgwt>
    // are expected to induce monotonically increasing or decreasing functions.
    // @visibility external
    // @example spinnerItem
    //<
    step:1,

    //>@attr    SpinnerItem.max (Double : null : IRW)
    // Maximum valid value for this item. If this and +link{SpinnerItem.min,min} are both
    // null or unspecified, then
    // <smartclient>
    // +link{SpinnerItem.getNextValue()} and +link{SpinnerItem.getPreviousValue()}
    // are used to increase or decrease the value and these methods
    // </smartclient><smartgwt>
    // the {@link com.smartgwt.client.widgets.form.fields.SpinnerItem#setNextValueHandler(NextValueHandler)
    // nextValueHandler} and {@link com.smartgwt.client.widgets.form.fields.SpinnerItem#setPreviousValueHandler(PreviousValueHandler)
    // previousValueHandler}
    // are used to increase or decrease the value and these handlers
    // </smartgwt>
    // are also used to determine the maximum value.
    // @visibility external
    // @example spinnerItem
    //<

    //>@attr    SpinnerItem.min (Double : null : IRW)
    // Minimum valid value for this item. If this and +link{SpinnerItem.max,max} are both
    // null or unspecified, then
    // <smartclient>
    // +link{SpinnerItem.getNextValue()} and +link{SpinnerItem.getPreviousValue()}
    // are used to increase or decrease the value and these methods
    // </smartclient><smartgwt>
    // the {@link com.smartgwt.client.widgets.form.fields.SpinnerItem#setNextValueHandler(NextValueHandler)
    // nextValueHandler} and {@link com.smartgwt.client.widgets.form.fields.SpinnerItem#setPreviousValueHandler(PreviousValueHandler)
    // previousValueHandler}
    // are used to increase or decrease the value and these handlers
    // </smartgwt>
    // are also used to determine the minimum value.
    // @visibility external
    // @example spinnerItem
    //<
    
    //> @attr spinnerItem.increaseIcon (FormItemIcon AutoChild : null : R)
    // In +link{SpinnerItem.writeStackedIcons,stacked mode}, the icon to increase the spinner's
    // value (an up arrow by default). This icon is generated automatically using
    // the +link{AutoChild} pattern. For skinning purposes, <code>increaseIconDefaults</code>
    // may be modified using +link{class.changeDefaults,changeDefaults()}. 
    // <P>
    // If sizes for the increase and decrease icons are not explicitly specified in their
    // autoChild configuration, they will be derived from the specified 
    // +link{spinnerItem.stackedIconsHeight} and +link{spinnerItem.stackedIconsWidth} 
    // properties.
    // <P>
    // See the
    // +link{group:skinning,skinning overview} for details on how to provide a sprited
    // image for these icons.
    // 
    // @visibility external
    //<
    increaseIconDefaults: {
        src:"[SKIN]/DynamicForm/Spinner_increase_icon.png",
        name:"increase",
        showOver:false,
        redrawOnShowIcon: true,
        showFocusedWithItem:false,
        // We don't need to support native focus, and we'll use mouseStillDown
        // rather than standard icon click to handle activation
        imgOnly:true,
        hspace:0
    },

    //> @attr spinnerItem.increaseIconProperties (FormItemIcon Properties : null : IR)
    // FormItemIcon properties applied to the +link{increaseIcon,increaseIcon} AutoChild of this
    // SpinnerItem.
    // @visibility external
    //<

    //> @attr spinnerItem.decreaseIcon (FormItemIcon AutoChild : null : R)
    // In +link{SpinnerItem.writeStackedIcons,stacked mode}, the icon to decrease the spinner's
    // value (a down arrow by default). This icon is generated automatically using
    // the +link{AutoChild} pattern. For skinning purposes, <code>decreaseIconDefaults</code>
    // may be modified using +link{class.changeDefaults,changeDefaults()}. 
    // <P>
    // If sizes for the increase and decrease icons are not explicitly specified in their
    // autoChild configuration, they will be derived from the specified 
    // +link{spinnerItem.stackedIconsHeight} and +link{spinnerItem.stackedIconsWidth} 
    // properties.
    // <P>
    // See the
    // +link{group:skinning,skinning overview} for details on how to provide a sprited
    // image for these icons.
    // 
    // @visibility external
    //<
    decreaseIconDefaults: {
        src:"[SKIN]/DynamicForm/Spinner_decrease_icon.png",
        name:"decrease",
        showOver:false,
        redrawOnShowIcon: true,
        showFocusedWithItem:false,
        imgOnly:true,
        hspace:0
    },

    //> @attr spinnerItem.decreaseIconProperties (FormItemIcon Properties : null : IR)
    // FormItemIcon properties applied to the +link{decreaseIcon,decreaseIcon} AutoChild of this
    // SpinnerItem.
    // @visibility external
    //<

    //> @attr spinnerItem.writeStackedIcons (Boolean : null : IR)
    // When set to <code>true</code>, the increase and decrease icons are stacked on top of
    // each other, also called stacked mode. When <code>false</code>, the increase and decrease
    // icons are placed on the same line as the <code>SpinnerItem</code>'s text box, also called
    // unstacked mode. When <code>null</code>, a default setting depending on +link{Browser.isTouch}
    // is used (for touch browsers, the default is <code>false</code>/unstacked mode).
    // <p>
    // In stacked mode, +link{SpinnerItem.increaseIcon} and +link{SpinnerItem.decreaseIcon}
    // control the appearance of the stacked icons.
    // <p>
    // In unstacked mode, +link{SpinnerItem.unstackedIncreaseIcon} and +link{SpinnerItem.unstackedDecreaseIcon}
    // control the appearance of the unstacked icons.
    // @group appearance
    // @visibility external
    //<
    //writeStackedIcons: null,

    //> @attr spinnerItem.stackedIconsWidth (Integer : 16 : IR)
    // In +link{SpinnerItem.writeStackedIcons, stacked icons mode} this property can be 
    // used to specify the width of both the increase and decrease icon. 
    // If a width property is explicitly
    // set for the icon via +link{spinnerItem.increaseIconProperties},
    // +link{spinnerItem.decreaseIconProperties}, or related <code>Defaults</code> property
    // blocks, that will take precedence over any specified stackedIconsWidth.
    // <P>
    // See also +link{spinnerItem.stackedIconsHeight}.
    // @visibility external
    //<
    stackedIconsWidth:16,
    //> @attr spinnerItem.stackedIconsHeight (Integer : 18 : IR)
    // In +link{SpinnerItem.writeStackedIcons,stacked icons mode} this property can be
    // used to specify the height of both the increase and decrease icon. Since the
    // icons are stacked vertically, each icon will be sized to half this specified value.
    // If a height property is explicitly
    // set for the icon via +link{spinnerItem.increaseIconProperties},
    // +link{spinnerItem.decreaseIconProperties}, or related <code>Defaults</code> property
    // blocks, that will take precedence over any specified stackedIconsHeight.
    // <P>
    // See also +link{spinnerItem.stackedIconsWidth}.
    // @visibility external
    //<
    stackedIconsHeight:18,

    //> @attr spinnerItem.unstackedIncreaseIcon (FormItemIcon AutoChild : null : R)
    // In +link{SpinnerItem.writeStackedIcons,unstacked mode}, the icon to increase the
    // <code>SpinnerItem</code>'s value.
    // <p>
    // By default, <code>"[SKIN]/DynamicForm/Spinner_increase_icon.png"</code> is stretched to
    // an 18x18 icon.
    // <P>
    // When +link{group:skinning,spriting} is enabled, this property will not 
    // be used to locate an image, instead, the image is drawn via CSS based on the 
    // +link{FormItemIcon.baseStyle} property.
    // @visibility external
    //<
    unstackedIncreaseIconDefaults: {
        src: "[SKIN]/DynamicForm/Spinner_increase_icon.png",
        width: 18,
        height: 18,
        name: "increase",
        showOver: false,
        showFocusedWithItem: false,
        imgOnly: true,
        hspace: 0
    },

    //> @attr spinnerItem.unstackedDecreaseIcon (FormItemIcon AutoChild : null : R)
    // In +link{SpinnerItem.writeStackedIcons,unstacked mode}, the icon to decrease the
    // <code>SpinnerItem</code>'s value.
    // <p>
    // By default, <code>"[SKIN]/DynamicForm/Spinner_decrease_icon.png"</code> is stretched to
    // an 18x18 icon.
    // <P>
    // When +link{group:skinning,spriting} is enabled, this property will not 
    // be used to locate an image, instead, the image is drawn via CSS based on the 
    // +link{FormItemIcon.baseStyle} property.
    // @visibility external
    //<
    unstackedDecreaseIconDefaults: {
        src: "[SKIN]/DynamicForm/Spinner_decrease_icon.png",
        width: 18,
        height: 18,
        name: "decrease",
        showOver: false,
        showFocusedWithItem: false,
        imgOnly: true,
        hspace: 0
    }
});

isc.SpinnerItem.addMethods({

    // Override init to ensure 'step' is a valid numeric value
    init : function () {
        this.Super("init",arguments);
        var step = this.step;
        if (step != null && !isc.isA.Number(step)) {
            step = parseFloat(step);
            if (!isc.isA.Number(step)) step = 1;
            this.step = step;
        }
    },

    usingStackedMode : function () {
        if (this.writeStackedIcons != null) return this.writeStackedIcons;
        return !isc.Browser.isTouch;
    },

    // Override 'setUpIcons' to add the Increase / Decrease icons
    _setUpIcons : function () {
        // Add the pickbutton to the set of icons
        if (this.icons == null) this.icons = [];

        var inc,
            dec;

        if (this.usingStackedMode()) {
            inc = this.increaseIcon = isc.addProperties({}, this.increaseIconDefaults, isc.SpinnerItem.INCREASE_ICON, this.increaseIconProperties),
            dec = this.decreaseIcon = isc.addProperties({}, this.decreaseIconDefaults, isc.SpinnerItem.DECREASE_ICON, this.decreaseIconProperties);

            inc.inline = false;
            dec.inline = false;
            
            // Support having the stacked icons be sized by total width/height properties
            // This makes scaling simpler
            if (inc.width == null) inc.width = this.stackedIconsWidth;
            if (dec.width == null) dec.width = this.stackedIconsWidth;
            if (inc.height == null) inc.height = Math.round(this.stackedIconsHeight/2);
            if (dec.height == null) dec.height = Math.round(this.stackedIconsHeight/2);

            this.icons.addListAt([inc, dec], 0);
        } else {
            dec = this.unstackedDecreaseIcon = isc.addProperties({}, this.unstackedDecreaseIconDefaults, this.unstackedDecreaseIconProperties);
            inc = this.unstackedIncreaseIcon = isc.addProperties({}, this.unstackedIncreaseIconDefaults, this.unstackedIncreaseIconProperties);

            inc.inline = false;
            dec.inline = false;

            this.icons.addListAt([dec, inc], 0);
        }

        this.Super("_setUpIcons", arguments);
    },

    // Override _supportsInlineIcons() - SpinnerItem supports inline icons.
    _supportsInlineIcons : function () {
        
        if (this._inlineIconsMarkupApproach == null) return false;
        return true;
    },
    
    // Should we write the spinner icons into the control table?
    // Doing this allows us to style the control table with a border and have the spinners
    // appear to be "inside" the text box
        
    writeSpinnersIntoControlTable:true,
    _writeSpinnersIntoControlTable : function () {
        return this.writeSpinnersIntoControlTable && this.showIcons && this.usingStackedMode();
    },
    _writeControlTable : function () {
        if (this.Super("_writeControlTable")) return true;
        if (this._writeSpinnersIntoControlTable()) return true;
        return false;
    },
    _writeIconIntoItem : function (icon) {
        if (this._writeSpinnersIntoControlTable() &&
            ((icon == this.increaseIcon) || (icon == this.decreaseIcon)))
        {
            return true;
        }
        return this.Super("_writeIconIntoItem", arguments);
    },
	_getPickerIconCellValue : function () {
	    var value = this.Super("_getPickerIconCellValue", arguments);
	    if (this._writeSpinnersIntoControlTable()) {
	        var template = this._getSpinnerTableTemplate();
	        template[7] = this.getIconHTML(this.icons[0]);
	        template[12] = this.getIconHTML(this.icons[1]);
    	    var spinnerTable = template.join("");
    	    if (value == null) {
    	        value = spinnerTable;
    	    // showPickerIcon true, plus spinners. Pretty unlikely but
    	    // ensure they show up on one line
    	    } else {
    	        value = "<table cellPadding=0 cellSpacing=0><tr><td>" + value +
    	                "</td><td>"  + spinnerTable + "</td></table>";
    	    }
	    }    
	    return value;
	},
    getTextBoxWidth : function (value) {
        var width = this.Super("getTextBoxWidth", arguments);
        // If we're writing spinners into the control table we want to reduce the
        // text box width to accomodate them while keeping the control table width looking
        // right.
        if (this._writeSpinnersIntoControlTable()) {
            // assumption: icons are stacked and increaseIcon / decreaseIcon should 
            // have the same width, hspace, padding on styling, etc
            var icon = this.increaseIcon;
            width -= (icon.width || this.iconWidth);
            
            if (icon.hspace) width -= icon.hspace;
            if (icon.baseStyle) width -= isc.Element._getHBorderPad(icon.baseStyle);

        }
        return width;

    },	
	
    // Override getIconsHTML to write the increase / decrease icons out, one above the other
    // if we're not writing the icons into the control table.
    _$iconsHTMLCellStart: "<td tabIndex='-1'" + (isc.Browser.isIE ? " style='font-size:0px'" : ""),
    _$rowspanEquals2GT: " rowspan='2'>",
    _$iconsHTMLCellEnd: "</td>",
    getIconsHTML : function () {
        if (this._writeSpinnersIntoControlTable()) {
            return this.Super("getIconsHTML", arguments);
        }
        if (!this.showIcons) return isc.emptyString;

        
        var hasFocus = this._hasRedrawFocus(true);
        if (!this.usingStackedMode() || !this.icons[0].visible) {
            return this.Super("getIconsHTML", arguments);
        }

        

        var template = this._getSpinnerTableTemplate();
        
        // How many extra icons do we have? (The first two are the increase and decrease spinner icons.)
        var nExtraNeedRoomFor = this.icons.length - 2;

        // If we need space for fewer icons, shrink the template by 4 times the difference between
        // the number of extra icons that the template can currently accommodate and the number
        // of extra icons that we have.
        if (nExtraNeedRoomFor < this._nRoomForExtraIcons) {
            template.splice(9 + 4 * nExtraNeedRoomFor, 4 * (this._nRoomForExtraIcons - nExtraNeedRoomFor));
            this._nRoomForExtraIcons = nExtraNeedRoomFor;

        // If we don't have enough space for extra icons, then insert 4 times the number of extra
        // template entries that we need.
        } else {
            var d = nExtraNeedRoomFor - this._nRoomForExtraIcons;
            if (d > 0) {
                var spliceArgs = [9, 0];
                spliceArgs[2 + 4 * d - 1] = null;
                template.splice.apply(template, spliceArgs);
                this._nRoomForExtraIcons = nExtraNeedRoomFor;
            }
        }

        if (this.renderAsStatic()) {
            template[7] = null;
            template[12 + 4 * this._nRoomForExtraIcons] = null;
        } else {
            template[7] = this.getIconHTML(this.icons[0]);
            template[12 + 4 * this._nRoomForExtraIcons] = this.getIconHTML(this.icons[1]);
        }
        
        var i = 9;
        for (var d = 2; d < this.icons.length; ++d, i += 4) {
            var icon = this.icons[d];

            // don't write out the icon if it specified a showIf, which returns false
            if (!icon.visible || this._writeIconIntoItem(icon)) {
                template[i] = null;
                template[i + 1] = null;
                template[i + 2] = null;
                template[i + 3] = null;
            } else {
                template[i] = this._$iconsHTMLCellStart;
                template[i + 1] = this._$rowspanEquals2GT;
                template[i + 2] = this.getIconHTML(icon);
                template[i + 3] = this._$iconsHTMLCellEnd;
                delete icon._showIf;
            }
        }

        return template.join(isc.emptyString);
    },
    
    _getSpinnerTableTemplate : function () {
        var template = this._spinnerTableTemplate;
        if (template == null) {
            
            
            var cellStart = this._$iconsHTMLCellStart,
                
                sampleIcon = {},
                vAlign = this._getIconVAlign(sampleIcon),
                vMargin = this._getIconVMargin(sampleIcon);

            template = this._spinnerTableTemplate = [
                "<table role='presentation' style='margin-top:",      // [0]
                vMargin,                                              // [1]
                ";margin-bottom:",                                    // [2]
                vMargin,                                              // [3]
                "' border=0 cellpadding=0 cellspacing=0><tbody><tr>", // [4]
                cellStart,                                            // [5]
                ">",                                                  // [6]
                null,                                                 // [7] this.getIconHTML(this.icons[0])
                "</td>",                                              // [8]
                                                                      // <- extra iconHTML inserted here
                                                                      // For each extra icon, there are 4 template entries
                                                                         // this._$iconsHTMLCellStart, // [0]
                                                                         // " rowspan='2'>",           // [1]
                                                                         // iconHTML,                  // [2]
                                                                         // "</td>"                    // [3]
                "</tr><tr>",                                          // [9 + 4 * nRoomForExtraIcons]
                cellStart,                                            // [10 + 4 * nRoomForExtraIcons]
                ">",                                                  // [11 + 4 * nRoomForExtraIcons]
                null,                                                 // [12 + 4 * nRoomForExtraIcons] this.getIconHTML(this.icons[1])
                "</td></tr></tbody></table>"                          // [13 + 4 * nRoomForExtraIcons]
            ];
            this._nRoomForExtraIcons = 0;
        }
        return template;
    },
    
    getIconHTML : function (icon) {
        if (this._isPrinting() || (this.getCanEdit() == false && this.renderAsStatic())) {
            return null;
        }
        return this.Super("getIconHTML", arguments);
    },

    getControlStyle : function () {
        // use the readOnlyTextBoxStyle with canEdit: false and readOnlyDisplay: "static"
        var tbStyle = (this.getCanEdit() == false && this.renderAsStatic() ?
                this.getReadOnlyTextBoxStyle() : this.controlStyle),
            styleName = this._getCellStyle(tbStyle, this._$control)
        ;

        return styleName;
    },

    getTextBoxStyle : function () {
        if (this.usingStackedMode()) {
            if (this._isPrinting()) return isc.TextItem.getInstanceProperty("textBoxStyle");
            else return this.Super("getTextBoxStyle", arguments);
        }

        if (this._isPrinting() && this.unstackedPrintTextBoxStyle) {
            return this._getCellStyle(this.unstackedPrintTextBoxStyle, this._$textBox);
        }

        // use the readOnlyTextBoxStyle with canEdit: false and readOnlyDisplay: "static"
        var tbStyle = (this.getCanEdit() == false && this.renderAsStatic() ?
                this.getReadOnlyTextBoxStyle() : this.unstackedTextBoxStyle),
            styleName = this._getCellStyle(tbStyle, this._$textBox)
        ;

        return styleName;
    },

    getReadOnlyTextBoxStyle : function () {
        if (this.usingStackedMode()) return this.Super("getReadOnlyTextBoxStyle", arguments);
        return this.unstackedReadOnlyTextBoxStyle ||
                    (this.form ? this.form.readOnlyTextBoxStyle : "staticTextItem");
    },

    // Override getIconVMargin to return zero for the spinners.
    _getIconVMargin : function(icon) {
        if (icon == this.icons[0] || icon == this.icons[1]) return 0;
        return this.Super("_getIconVMargin", arguments);
    },

    // we're writing our 2 spinner icons one above the other
    // Only account for the width of one of them, not both
    
    getTotalIconsWidth : function () {
        var width = this.Super("getTotalIconsWidth", arguments);
        // A width of zero implies we're not showing any icons
        if (!this._writeSpinnersIntoControlTable() && width > 0 && this.usingStackedMode()) {
            var spinWidthExcess = Math.max(this.icons[0].width, this.icons[1].width);
            width -= spinWidthExcess;
        }
        return width;
    },

    // Use 'mouseStillDown' to handle the user holding the mouse over the increase/decrease 
    // icons
    _$increase: "increase",
    _$decrease: "decrease",
    mouseStillDown : function (form, item, event) {
        if (this.isDisabled() || this.isReadOnly()) return;

        // increment counter for simple value ramp
        this._mouseStillDownCounter++;

        if (this._valueIsDirty) this.updateValue();

        var nativeTarget = event.nativeTarget;

        var lastTargetIcon = this._lastTargetIcon,
            targetIcon = null;
            
        var incIconImg = this._getIconImgElement(this.icons[0]),
            decIconImg = this._getIconImgElement(this.icons[1]);
        if (incIconImg &&
             (nativeTarget == incIconImg || incIconImg.contains(nativeTarget)))
        {
            targetIcon = this.icons[0];
        } else if (decIconImg && 
            (nativeTarget == decIconImg || decIconImg.contains(nativeTarget)))
        {
            targetIcon = this.icons[1];
        }
        if (lastTargetIcon != targetIcon) {
            this._mouseStillDownCounter = 1;

            if (lastTargetIcon != null) {
                var img = this._getIconImgElement(lastTargetIcon);
                if (img) {
                    this._iconBlur(lastTargetIcon.name, img);
                }
            }

            this._lastTargetIcon = targetIcon;
            if (targetIcon != null) {
            	// If focus is currently in the text-box, explicitly yank it out.
            	
            	if (!isc.Browser.isTouch &&
            		this._getCurrentFocusElement() != null &&
            		this._getCurrentFocusElement() == this._getTextBoxElement())
            	{
            		this.blurItem();
            	}

                var img = this._getIconImgElement(targetIcon);
                if (img) {
                    this._iconFocus(targetIcon.name, img);
                }
            }
        }
        if (targetIcon != null) {
            if (targetIcon.name === this._$increase) {
                this.increaseValue();
            } else if (targetIcon.name === this._$decrease) {
                this.decreaseValue();
            }
        }
    },

    // reset counter for simple value ramp
    mouseDown : function (form, item, event) {
        if (this.isDisabled() || this.isReadOnly()) return;
        this._mouseStillDownCounter = 0;
        isc.Page.setEvent(isc.EH.MOUSE_UP, this, isc.Page.FIRE_ONCE, "_clearLastTargetIcon");
    },
    
    _clearLastTargetIcon : function () {
        var lastTargetIcon = this._lastTargetIcon;
        if (lastTargetIcon != null) {
            var img = this._getIconImgElement(lastTargetIcon);
            if (img) {
                this._iconBlur(lastTargetIcon.name, img);
            }
        }
        this._lastTargetIcon = null;
        // force focus into the item text-box except if this is a touch device
        if (!isc.Browser.isTouch) this.focusInItem();
    },

    // Override handleKeyPress to increase / decrease on up / down arrow keys
    handleKeyPress : function (event, eventInfo) {

        var superReturn = this.Super("handleKeyPress", arguments);
        if (superReturn == false) {
            return false;
        }
        var keyName = event.keyName,
            readOnly = this.isReadOnly()
        ;
        if (!readOnly && keyName == "Arrow_Up") {
            this.increaseValue();
            return false;
        }
        if (!readOnly && keyName == "Arrow_Down") {
            this.decreaseValue();
            return false;
        }
        return superReturn;
    },

    //> @method spinnerItem.getNextValue() [A]
    // When +link{SpinnerItem.min,min} and +link{SpinnerItem.max,max} are both null or unspecified,
    // this method is called to get the next higher value from the currentValue. The default
    // implementation returns (currentValue&nbsp;+&nbsp;step).
    // <p>
    // To indicate that the given currentValue is the maximum value, return currentValue again.
    // <p>
    // Implementations should expect to be passed any value for currentValue. Also, if
    // +link{SpinnerItem.step} is non-negative, getNextValue() must induce a
    // +externalLink{http://en.wikipedia.org/wiki/Monotonic_function,monotonically increasing (non-decreasing) function};
    // otherwise, getNextValue() must induce a monotonically decreasing function.
    // @param currentValue (number) the current value of this SpinnerItem
    // @param step (number) a suggested step value based on +link{SpinnerItem.step,this.step} and how
    // long the user has been continuously increasing the value.
    // @return (number) the next higher value
    // @visibility external
    // @see getPreviousValue()
    //<
    getNextValue : function (currentValue, step) {
        return this._defaultGetNextValue(currentValue, step);
    },

    //> @method spinnerItem.getPreviousValue() [A]
    // When +link{SpinnerItem.min,min} and +link{SpinnerItem.max,max} are both null or unspecified,
    // this method is called to get the previous lower value from the currentValue. The default
    // implementation returns (currentValue&nbsp;<b>+</b>&nbsp;step) because the step parameter
    // is based on <em>the opposite</em> of +link{SpinnerItem.step,this.step}.
    // <p>
    // To indicate that the given currentValue is the minimum value, return currentValue again.
    // <p>
    // Implementations should expect to be passed any value for currentValue. Also, if
    // +link{SpinnerItem.step} is non-negative, getPreviousValue() must induce a
    // +externalLink{http://en.wikipedia.org/wiki/Monotonic_function,monotonically decreasing (non-increasing) function};
    // otherwise, getPreviousValue() must induce a monotonically increasing function.
    // @param currentValue (number) the current value of this SpinnerItem
    // @param step (number) a suggested step value based on the opposite of +link{SpinnerItem.step,this.step}
    // and how long the user has been continuously decreasing the value.
    // @return (number) the next higher value
    // @visibility external
    // @see getNextValue()
    //<
    getPreviousValue : function (currentValue, step) {
        return this._defaultGetNextValue(currentValue, step);
    },

    _defaultGetNextValue : function (value, step) {
        var minVal = this.min,
            maxVal = this.max;

        
        var stepDP,
            valueDP;

        if (Math.round(step) == step) {
            stepDP = 0
        } else {
            
            var stepString = step + "";
            stepDP = stepString.length - (stepString.indexOf(".") +1);
        }
        if (Math.round(value) == value) {
            valueDP = 0;
        } else {
            var valueString = value + "";
            valueDP = valueString.length - (valueString.indexOf(".") +1);
        }
        value += step;

        var decimalPlaces = Math.max(stepDP, valueDP);
        if (decimalPlaces > 0) {
            
            value = parseFloat(value.toFixed(decimalPlaces));
        }

        // Don't go beyond max / min
        if (step > 0 && maxVal != null && value > maxVal) value = maxVal;
        else if (step < 0 && minVal != null && value < minVal) value = minVal;

        return value;
    },

    increaseValue : function () {
        this.updateValue();
        var value = this.getValue();
        if (value != null && this.max == value) return;
        var mouseStillDownCounter = this._mouseStillDownCounter;
        
        var stillDownDelay = this.form.mouseStillDownDelay;
        // If we get called directly when the mouse is not down, don't crash, just increment by
        // a single step.
        // Otherwise apply a simple value ramp - double the step size every 2 seconds
        var step = this.step * (mouseStillDownCounter != null ? 
                            Math.pow(2, 
                                Math.floor(
                                    this._mouseStillDownCounter/(2000/stillDownDelay)
                                )
                            ) :
                                1);
        return this._modifyValue(value, step, true);
    },

    decreaseValue : function () {
        this.updateValue();
        var value = this.getValue();
        if (value != null && this.min == value) return;
        var mouseStillDownCounter = this._mouseStillDownCounter;
        var stillDownDelay = this.form.mouseStillDownDelay;

        var step = (0-this.step) * (mouseStillDownCounter != null ? 
                            Math.pow(2, 
                                Math.floor(
                                    this._mouseStillDownCounter/(2000/stillDownDelay)
                                )
                            ) :
                                1);
        return this._modifyValue(value, step, false);
    },

    // Actually modify the value
    
    _modifyValue : function (value, step, isIncreasing) {

        var minVal = this.min,
            maxVal = this.max;

        // If it's not a value to start with, default to zero.
        // If zero is outside our range, default to minVal (or maxVal if min is not defined)
        // instead
        if (!isc.isA.Number(value)) {
            value = 0;
            if ((minVal != null && value < minVal) || (maxVal != null && value > maxVal)) {
                
                value = (minVal != null ? minVal : maxVal);
            }
        }

        if (minVal == null && maxVal == null) {
            value = isIncreasing
                    ? this.getNextValue(value, step)
                    : this.getPreviousValue(value, step);
        } else {
            value = this._defaultGetNextValue(value, step);
        }

        var form = this.form,
            record = this.form ? this.form.getValues() : null,
            formattedVal = (this.formatEditorValue != null) 
                            ? this.formatEditorValue(value,record,form,this)
                            : value;

        this.setElementValue(formattedVal);
        this.updateValue();

    },

    // Override mapDisplayToValue to return a numeric value rather than a string.
    mapDisplayToValue : function (value) {
        value = this.Super("mapDisplayToValue", arguments);
        
        if (isc.isA.String(value)) {
            var floatVal = parseFloat(value);
            if (floatVal == value) value = floatVal;
        }
        return value;
    },

    isInRange : function (value) {
        if (this.max != null) {
            if (this.max < value) return false;
        } else if (this.min == null) {
            // We're using getNextValue()/getPreviousValue().
            if (0 <= this.step) {
                if ((value < this.getPreviousValue(value, -this.step)) ||
                    (this.getNextValue(value, this.step) < value))
                {
                    return false;
                }
            } else {
                if ((value > this.getPreviousValue(value, -this.step)) ||
                    (this.getNextValue(value, this.step) > value))
                {
                    return false;
                }
            }
        }
        if (this.min != null) {
            if (value < this.min) return false;
        }
        return true;
    },

    // Override updateValue (called when a user modifies the value) to validate the value as 
    // numeric.
    updateValue : function () {

        var value = this.getElementValue();

        // unmap the value if necessary 
        value = this.mapDisplayToValue(value);

        if (value == this._value) return;

        // If the user entered an invalid number just refuse to accept it.
        if (value != null && (!isc.isA.Number(value) || !this.isInRange(value))) {
            var oldValue = this.mapValueToDisplay(this._value);
            this.setElementValue(oldValue);
            return;
        }

        // Allow the superclass implementation to actually update the value
        this.Super("updateValue", arguments); 
    },

    // Override setValue to disallow setting to a non numeric value programatically
    setValue : function (value, allowNullValue, a,b,c,d) {
        if (value != null && !isc.isA.Number(value)) {
            var numVal = parseFloat(value);
            if (numVal == value) value = numVal;
            else {
                this.logWarn("setValue(): passed '" + value + 
                                "'. This is not a valid number - rejecting this value");
                value = null;
            }
        }
        if (value != null) {
            if (this.max != null && value > this.max) {
                this.logWarn("setValue passed "+ value + 
                                " - exceeds specified maximum. Clamping to this.max.");
                value = this.max;
            }
            if (this.min != null && value < this.min) {
                this.logWarn("setValue passed "+ value + 
                                " - less than specified minimum. Clamping to this.min.");
                value = this.min;
            }
            // We're using getNextValue()/getPreviousValue().
            if (this.max == null && this.min == null) {
                var nextValue = this.getNextValue(value, this.step),
                    previousValue = this.getPreviousValue(value, -this.step);
                if (0 <= this.step) {
                    if (value < previousValue) {
                        this.logWarn("setValue passed " + value +
                                     " - less than the previous value " + previousValue +
                                     ". Setting to the previous value.");
                        value = previousValue;
                    }
                    if (nextValue < value) {
                        this.logWarn("setValue passed " + value +
                                     " - greater than the next value " + nextValue +
                                     ". Setting to the next value.");
                        value = nextValue;
                    }
                } else {
                    if (value > previousValue) {
                        this.logWarn("setValue passed " + value +
                                     " - greater than the previous value " + previousValue +
                                     ". Setting to the previous value.");
                        value = previousValue;
                    }
                    if (nextValue > value) {
                        this.logWarn("setValue passed " + value +
                                     " - less than the next value " + nextValue +
                                     ". Setting to the next value.");
                        value = nextValue;
                    }
                }
            }
        }

        return this.invokeSuper(isc.SpinnerItem, "setValue", value, allowNullValue, a,b,c,d);
    }

});
