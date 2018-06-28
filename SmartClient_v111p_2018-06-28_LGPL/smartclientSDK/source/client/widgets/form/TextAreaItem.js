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
//>	@class	TextAreaItem
//
//	Class for editable multi-line text areas (uses HTML <code>&lt;TEXTAREA&gt;</code> object)
// @inheritsFrom FormItem
// @visibility external
// @example textAreaItem
//<
isc.ClassFactory.defineClass("TextAreaItem", "FormItem");

isc.TextAreaItem.addClassProperties({
    

	//>	@type	TEXTAREA_WRAP
    //	@value	isc.TextAreaItem.OFF  don't allow wrapping at all
    //	@value	isc.TextAreaItem.SOFT   when the entered text reaches the edge of the text area,
    //                                  wrap visibly but don't include line breaks in the textarea
    //                                  value
    //	@value	isc.TextAreaItem.HARD   when the entered text reaches the edge of the text area, 
    //                                  insert a line break
    //
    // @visibility external
	//<

    //> @classAttr TextAreaItem.OFF (Constant : "OFF" : [R])
    // A declared value of the enum type  
    // +link{type:TEXTAREA_WRAP,TEXTAREA_WRAP}.
    // @visibility external
    // @constant
    //<
	OFF : "OFF",

    //> @classAttr TextAreaItem.SOFT (Constant : "SOFT" : [R])
    // A declared value of the enum type  
    // +link{type:TEXTAREA_WRAP,TEXTAREA_WRAP}.
    // @visibility external
    // @constant
    //<
	SOFT : "SOFT",
	VIRTUAL : "SOFT",

    //> @classAttr TextAreaItem.HARD (Constant : "HARD" : [R])
    // A declared value of the enum type  
    // +link{type:TEXTAREA_WRAP,TEXTAREA_WRAP}.
    // @visibility external
    // @constant
    //<
	ON : "HARD",
	HARD : "HARD",			
	PHYSICAL : "HARD"	

});

isc.TextAreaItem.addProperties({
    //>	@attr	textAreaItem.wrap		(TEXTAREA_WRAP : isc.TextAreaItem.VIRTUAL : IRW)
	// Text wrapping style.
	//		@group	appearance
    // @visibility external
	//<
	wrap:isc.TextAreaItem.VIRTUAL,
	
    //>	@attr	textAreaItem.width		(number : 150 : IRW)
	//			default width of this item
	//		@group	appearance
    // @visibility external
	//<
	width:150,

    //>	@attr	textAreaItem.height		(number : 100 : IRW)
    // Default height of this item
    // <p>
    // Note that when item is rendered as read-only with <code>readOnlyDisplay</code> as "static"
    // the property +link{formItem.staticHeight} is used instead.
    //
    // @group	appearance
    // @visibility external
    //<
    height:100,
    
    //> @attr textAreaItem.pickerIconHeight (Integer : 20 : IRW)
    // TextAreaItem has an explicit pickerIconHeight as we don't want the picker icon, if shown,
    // to size itself to match the height of the item.
    // @visibility external
    //<
    pickerIconHeight:20,
    
    //> @attr textAreaItem.staticHeight   (Integer : 1 : IR)
    // @include formItem.staticHeight
    //<
    staticHeight:1,

    //>	@attr	textAreaItem.textBoxStyle (FormItemBaseStyle : "textItem" : IRW)
	//  Base CSS class to apply to this item's input element.
    // NOTE: See the +link{group:CompoundFormItem_skinning} discussion for special skinning considerations.    
    // 
	// @group   appearance
    // @visibility external
	//<
	textBoxStyle:"textItem",		

    //> @attr textAreaItem.browserAutoCapitalize
    // @include FormItem.browserAutoCapitalize
    // @visibility external
    //<

    //> @attr textAreaItem.browserAutoCorrect
    // @include FormItem.browserAutoCorrect
    // @visibility external
    //<

    //>	@attr	textAreaItem.length		(number : null : IRW)
	// If set, maximum number of characters for this field. If +link{enforceLength} is
	// set to true, user input will be limited to this value, and values exceeding this
	// length passed to +link{formItem.setValue(),setValue()} will be trimmed. Otherwise values exceeding the
	// specified length will raise an error on validation.
	// <P>
	// See also +link{dataSourceField.length}.
	// @group	validation
    // @visibility external
	//<
	length:null,
	
	//> @attr textAreaItem.enforceLength (boolean : false : IRW)
	// If a +link{textAreaItem.length} is specified for this item, should user input be limited
	// to the specified length? If set to true, user input and values passed to 
	// +link{formItem.setValue(),setValue()} will be trimmed to the specified length. Otherwise values
	// exceeding the specified length will raise an error on validation.
	// <P>
	// Note that having this value set to true limits user interactivity in some ways.
	// For example users would be unable to paste a longer string into the field for
	// editing without seeing it be truncated. Given how text areas are typically
	// used to edit longer values than non-wrapping +link{textItem}s, this value is
	// false by default for textAreaItems.
	//
	// @visibility external
	//<
	enforceLength:false,
	
    // Override redrawOnShowFormIcon - we can handle dynamically updating the item's HTML to
    // show / hide textArea item icons
    redrawOnShowIcon:false,
    // setting clipValue to true ensures we resize the text box when showing/hiding icons
    clipValue:true,


    //> @attr   textAreaItem._hasDataElement    (boolean : true : IRW)
    //      Text areas have a data element.
    // @group formValues
    // @visibility   internal
    // @see     method:FormItem.hasDataElement
    // @see     method:FormItem.getDataElement
    //<
    _hasDataElement:true,
    
    // This flag means updateState will apply the result of this.getTextBoxStyle() to this item's
    // data element - appropriate for native text boxes, text areas and selects.
    _dataElementIsTextBox:true,

    //> @attr   textAreaItem.emptyStringValue   (Any : null : IRW)
    // @include textItem.emptyStringValue
    //<
    
    emptyStringValue:null,

    //> @attr   textAreaItem.lineBreakValue  (String : "\n" : IRW)
    //  What character string should be used to represent line breaks?<br>
    //  Multi-line values edited in TextAreaItems will use this string
    //  as a line separator.
    // @group formValues
    // @visibility   psft
    //<
    
    lineBreakValue:"\n",

    //> @attr   textAreaItem.iconVAlign  (VerticalAlignment : isc.Canvas.TOP : IR)
    //  Align icons with the top edge of text area icons by default.
    //  @group  formIcons
    // @visibility   external
    //<
    iconVAlign:isc.Canvas.TOP,
    
    // _nativeEventHandlers is a place to specify native event handlers to be applied to the
    // form item element once it has been written into the DOM (without having to override 
    // '_applyHandlersToElement()'
    _nativeEventHandlers : {
        
        onmousedown : (
            isc.Browser.isIE ? function () {
                var element = this,
                    itemInfo = isc.DynamicForm._getItemInfoFromElement(element),
                    item = itemInfo.item;
                if (item) item._setupFocusCheck();

            } : null
        )
    },

    //> @method textAreaItem.getEnteredValue()
    // @include textItem.getEnteredValue()
    // @visibility external
    //<
    getEnteredValue : function () {
        return this.getElementValue();
    },

    //>@attr TextAreaItem.browserSpellCheck (boolean : null : IRWA)
    // @include FormItem.browserSpellCheck
    // @visibility internal
    //<
    
    //>@attr TextAreaItem.selectOnFocus (boolean : null : IRW)
    // @include FormItem.selectOnFocus
    // @visibility external
    //<

    //>@attr TextAreaItem.selectOnClick (boolean : null : IRW)
    // @include FormItem.selectOnClick
    // @visibility external
    //<
    
    //>@attr TextAreaItem.changeOnKeypress (Boolean : true : IRW)
    // @include FormItem.changeOnKeypress
    // @visibility external
    //<

    //> @attr textAreaItem.supportsCutPasteEvents (boolean : true : IRW)
    // @include FormItem.supportsCutPasteEvents
    // @visibility external
    //<
    supportsCutPasteEvents:true,
    
    //>@method TextAreaItem.getSelectionRange()
    // @include FormItem.getSelectionRange()
    // @visibility external
    //<
    
    //>@method TextAreaItem.setSelectionRange()
    // @include FormItem.setSelectionRange()
    // @visibility external
    //<
    
    //>@method TextAreaItem.selectValue()
    // @include FormItem.selectValue()
    // @visibility external
    //<
    
    //>@method TextAreaItem.deselectValue()
    // @include FormItem.deselectValue()
    // @visibility external
    //<
    
    // supportsSelectionRange - does getSelectionRange() return null on this item? (IE only)
    // See FormItem._getIESelectionRange() for background on this
    // May cause poor performance determining selection range (for example on redraw) in 
    // items with a lot of content
    supportsSelectionRange:true,

    //> @attr TextAreaItem.showHintInField (Boolean : null : IRWA)
    // @include TextItem.showHintInField
    // @visibility external
    //<
    //showHintInField: null,

    //> @attr TextAreaItem.usePlaceholderForHint (boolean : true : IRA)
    // @include TextItem.usePlaceholderForHint
    // @visibility external
    //<
    
    usePlaceholderForHint: true,

    //>@attr TextAreaItem.printFullText (Boolean : true : IRW)
    // When generating a print-view of the component containing this TextArea, should
    // the form item expand to accommodate its value? If set to false the text box not expand
    // to fit its content in the print view, instead showing exactly as it does in the
    // live form, possibly with scrollbars.
    // @visibility external
    // @group printing
    //<
    printFullText:true,

    showClippedValueOnHover:false
});

isc.TextAreaItem.addMethods({

    _getShowHintInField : function () {
        return !!(this.showHint && this.getHint() && this.showHintInField);
    },
    _getUsePlaceholderForHint : function () {
        
        if (!this.usePlaceholderForHint) return false;
        return this._supportsPlaceholderAttribute();
    },
    _supportsPlaceholderAttribute : function () {
        return isc.Browser._supportsPlaceholderAttribute;
    },

    // Don't allow any valueIcon to appear on a different line from the text area
    getTextBoxCellCSS : function () {
        return this._$nowrapCSS;
    },

    
    _sizeTextBoxAsContentBox : function () {
        return isc.Browser.isStrict;
    },


    // NOTE: this is here for doc generation
    //>	@method textAreaItem.keyPress		(A)
    //		@group	event handling
    //			event handler for keys pressed in this item
    //<


    _needHideUsingDisplayNone : function () {
        return isc.Browser.isTouch;
    },


    // _willHandleInput()
    // Can we use the "input" event in this browser / form item?
    // True for Moz and Safari, but not IE. See comments near FormItem._handleInput()
    _willHandleInput : function () {
        return !isc.Browser.isIE;
    },

    //> @method textAreaItem.setElementReadOnly()
    // Change the read-only state of the form element immediately.
    //<
    setElementReadOnly : function (readOnly) {
        // TextArea HTML element has readonly property
        this._setElementReadOnly(readOnly);
    },
    

    //> @attr textAreaItem.escapeHTML (Boolean : true : IRW)
    // By default HTML characters will be escaped when +link{canEdit} is false and 
    // +link{readOnlyDisplay} is "static", so that the raw value of the field (for
    // example <code>"&lt;b&gt;AAA&lt;/b&gt;"</code>) is displayed to the user rather than
    // the interpreted HTML (for example <code>"<b>AAA</b>"</code>).  Setting
    // <code>escapeHTML</code> false will instead force HTML values in a textAreaItem to be
    // interpreted by the browser in that situation.
    // @group appearance
    // @visibility external
    //<
    escapeHTML: true,

    
    getCanEscapeHTML : function () {
        if ((this._isPrinting() && this.printFullText) || this.renderAsStatic()) {
            return true;
        }
        return this.canEscapeHTML;
    },
    
    _supportsInlineIcons : function () {
        
        if (this._inlineIconsMarkupApproach == null) return false;
        return true;
    },

    _iconVisibilityChanged : function () {
        var dataElement = this.getDataElement();
        if (dataElement != null && this._haveInlineIcons()) {

            if (this._inlineIconsMarkupApproach === "absolutePositioning") {
                var style = this.getTextBoxStyle(),
                    isRTL = this.isRTL(),
                    logicalLeftInlineIconsWidth = (isRTL ? this._rightInlineIconsWidth : this._leftInlineIconsWidth),
                    logicalRightInlineIconsWidth = (isRTL ? this._leftInlineIconsWidth : this._rightInlineIconsWidth),
                    logicalLeftPadding = isc.Element._getLeftPadding(style) + logicalLeftInlineIconsWidth,
                    logicalRightPadding = isc.Element._getRightPadding(style) + logicalRightInlineIconsWidth,
                    styleHandle = dataElement.style;
                styleHandle.paddingRight = logicalRightPadding + "px";
                styleHandle.paddingLeft = logicalLeftPadding + "px";
            } else {
                
                this.redraw("iconVisibilityChanged, 'divStyledAsDataElement' inline icons markup approach");
            }
        }
        this.Super("_iconVisibilityChanged", arguments);
    },

    
    _getClipValue : function () {       
        if (this._isPrinting() &&  this.printFullText) return false;
        return this.Super("_getClipValue", arguments);
    },

    //> @method textAreaItem.getElementHTML() (A)
    // Output the HTML for a text field element
    //
    // @param value (String)  Value of the element
    //                        [Unused because it is more reliably set by setValue].
    // @return (HTMLString)  HTML output for this element
    // @group drawing
    //<
    getElementHTML : function (value, dataValue) {
        // remember which element number we wrote this out as
        var form = this.form,
            formID = form.getID(),
            itemID = this.getItemID(),
            output = isc.StringBuffer.create(),
            valueIconHTML = this._getValueIconHTML(dataValue);
        if (valueIconHTML != null) output.append(valueIconHTML);
        if (!this.showValueIconOnly) {
            // If we're printing, only use the static path (which will expand) if printFullText is true,
            // In this case we'll also disallow clipping so the static text-box will expand to accomodate
            // content.
            var isPrinting = this._isPrinting(),
                useStaticPath = (isPrinting && this.printFullText) || this.renderAsStatic();
            
            if (useStaticPath) {
                var returnVal = this.Super("getElementHTML", [value.asHTML(), dataValue], arguments);
                return returnVal;
            } else {
                var autoCompleteValues = this._getAutoCompleteSetting(),
                    autoCompleteKeywordsPresent = this.autoCompleteKeywords != null && isc.isAn.Array(this.autoCompleteKeywords);
                output.append(
                    "<TEXTAREA NAME=" , this.getElementName(),
                    " ID=", this.getDataElementId(),

                    // hang a flag on the element marking it as the data element for the
                    // appropriate form item.
                    this._getItemElementAttributeHTML(),

                    this.getElementStyleHTML(dataValue),
                    (this.renderAsDisabled() ? " DISABLED " : ""),

                    // disable native autoComplete 
                    (autoCompleteKeywordsPresent ? " AUTOCOMPLETE=\"" + autoCompleteValues + "\" " :
                        autoCompleteValues != "native" ? " AUTOCOMPLETE=OFF " : ""),

                    (this._getShowHintInField() && this._getUsePlaceholderForHint()
                     ? " placeholder='" + String.asAttValue(String.htmlStringToString(this.getHint())) + "'"
                     : null),

                    // enable / disable native spellcheck in Moz
                    // Same setting in Safari - see comments in TextItem.js
                    
                    ((isc.Browser.isMoz || isc.Browser.isSafari || isc.Browser.isEdge ||
                      (isc.Browser.isIE && isc.Browser.version >= 10)) ? 
                        (this.getBrowserSpellCheck() ? " spellcheck=true" : " spellcheck=false") :
                        null),
                    (isc.Browser.isSafari && this.browserAutoCapitalize == false
                        ? " autocapitalize='off'"
                        : null),
                    (isc.Browser.isSafari && this.browserAutoCorrect != null
                        ? (this.browserAutoCorrect ? " autocorrect='on'" : " autocorrect='off'")
                        : null),

                    " WRAP=", this.wrap,

                    " TABINDEX=", this._getElementTabIndex(),
                    (this.showTitle == false && this.accessKey != null ? 
                        " ACCESSKEY=" + this.accessKey : ""),

                    // If this browser supports the "input" event write out a handler for it.
                    (this._willHandleInput() ? " ONINPUT='" + this.getID() + "._handleInput()'"
                                             : null),

                    // If the readonly property is set, set it on the handle too
                    (this.isReadOnly() || this.isInactiveHTML() ? 
                        (isc.Canvas.ariaEnabled() ? " aria-readonly='true' READONLY=TRUE" :
                            " READONLY=TRUE") : null),

                    

                    // Ensure we pass events through the ISC event handling system.
                    " handleNativeEvents=false>",
                    (this.isInactiveHTML() ? value : null),
                    "</TEXTAREA>"
                );
            }
        }
            
        //this.logWarn("textArea HTML:"+ output);
        return output.release(false);
    },
    
    //> @attr TextAreaItem.allowNativeResize (boolean : false : IRA)
    // Modern browsers allow drag-resizing of TextArea items. This flag may be set to enable
    // or suppress this behavior where supported.
    // @visibility internal
    //<
    
    allowNativeResize : false,
    handleMouseMove : function () {
        var returnVal = this.Super("handleMouseMove", arguments);
        if (returnVal == false || !this.allowNativeResize) return false;
        
        if (isc.EH.mouseIsDown() && this._resizeCheck == null) {
            this._resizeCheck = isc.Page.setEvent("idle", this.getID() + "._checkForElementResize()");
        }
    },
    _checkForElementResize : function () {
        var resized = false;
        var element = this.getDataElement();
        if (element) {
            var value = this.getValue();
            if (element.offsetWidth != this.getTextBoxWidth(value)) resized = true;
            if (element.offsetHeight != this.getTextBoxHeight(value)) resized = true;
        }
        if (resized) this._nativeElementResize();

        if (!isc.EH.mouseIsDown()) {
            isc.Page.clearEvent("idle", this._resizeCheck);
            this._resizeCheck = null;
        }
    },
    
    _nativeElementResize : function () {
        var widget = this.containerWidget;
        if (widget) widget._markForAdjustOverflow("Native textarea resize");
    },

    // When focus is received, the hint should be hidden if TextAreaItem.showHintInField is true.
    _nativeElementFocus : function (element, itemID) {
        var returnVal = this.Super("_nativeElementFocus", arguments);

        // Hide in-field hint if being shown
        this._hideInFieldHint();

        // There may be custom parser / formatter logic applied to any text item and this
        // may not be a 1:1 mapping [EG a forgiving date format parser allowing variants on
        // a display format].
        // As with TextItem, store element value at focus so we can compare at blur time and
        // if necessary re-run the formatter on the stored item value
        // - note that by comparing element values rather than checking for changed data value we
        // catch the case where the user modified the display value to something that ultimately
        // maps back to the same data value [in which case a simple dataVal changed check might fail]
        this._elementValueAtFocus = this.getEnteredValue();

        return returnVal;
    },

    // Override _nativeElementBlur to fire 'change' explicitly in response to blur rather than
    // relying on the native 'ONCHANGE' handler method
    // (as with textItem)
    _nativeElementBlur : function (element, itemID) {
        
        // Always fire elementChanged(). This will fall through to updateValue which will
        // no-op if the value is actually unchanged.
        
        this.form.elementChanged(this);
        
        var returnVal = this.Super("_nativeElementBlur", arguments);
          
        // As with TextItem, call mapValueToDisplay() so we format the stored value to 
        // the appropriate display value.
        // Required if a developer has custom formatters/parsers that are not 1:1
        // [EG: A forgiving data parser allowing variants on a display format].
        // Use the "_elementValueAtFocus" to avoid firing this unnecessarily.
        if (this._elementValueAtFocus == null ||
            this._elementValueAtFocus != this.getEnteredValue())
        {
            var value = this.getValue();
            if (this.mapValueToDisplay) {
                value = this.mapValueToDisplay(value);
            }
            this.setElementValue (value);
        }

        // If showing the hint within the data field, see if it should be shown now.
        if (this._getShowHintInField() && !this._getUsePlaceholderForHint()) {
            var value = this.getElementValue();
            if (value == null || isc.isAn.emptyString(value)) {
                this._showInFieldHint();
            }
        }

        return returnVal;
    },

	//>	@method	textAreaItem.getElementStyleHTML()	(I)
    //      	Get the HTML string used to set the visual characteristics for a textArea item.
    //          This includes the STYLE=... & CLASS=... properties to be written into this
    //          form item's element.
	//			This varies by platform, as we attempt to make Netscape think in pixels rather than 
    //          characters and rows
	//
	//		@group	appearance
	//		@return	(String)    String of HTML containing STYLE=... & CLASS=... properties for 
    //                          this items element.
	//
	//<
	getElementStyleHTML : function (value) {

        var width = this.getTextBoxWidth(value),
            height = this.getTextBoxHeight(value),
            style = this.getTextBoxStyle(),
            inlineIconStyle;

        if (this._haveInlineIcons()) {
            var isRTL = this.isRTL(),
                logicalLeftInlineIconsWidth = isRTL ? this._rightInlineIconsWidth : this._leftInlineIconsWidth;

            if (this._inlineIconsMarkupApproach === "absolutePositioning") {
                var logicalLeftPadding = isc.Element._getLeftPadding(style) + logicalLeftInlineIconsWidth,
                    logicalRightInlineIconsWidth = isRTL ? this._leftInlineIconsWidth : this._rightInlineIconsWidth,
                    logicalRightPadding = isc.Element._getRightPadding(style) + logicalRightInlineIconsWidth;
                inlineIconStyle = "padding-right:" + logicalRightPadding + "px;padding-left:" + logicalLeftPadding + "px";
            } else {
                

                if (isc.Browser.isIE && !isc.Browser.isStrict) {
                    inlineIconStyle = isc.Canvas._$noStyleDoublingCSS + "position:relative;left:" + logicalLeftInlineIconsWidth + "px";
                } else {
                    inlineIconStyle = isc.Canvas._$noStyleDoublingCSS + "position:relative;top:0px;bottom:0px;left:" + logicalLeftInlineIconsWidth + "px";
                }

                // For IE9/10 the element height needs to be specified to match outer div height
                if (isc.Browser.isIE && 9 <= isc.Browser.version && isc.Browser.version <= 10) {
                    inlineIconStyle += "; height: " + this.getTextBoxHeight() + "px;";
                }
            }
        }

        return isc.StringBuffer.concat(
            " CLASS='" + this.getTextBoxStyle(),
            
            (isc.Browser.isMoz && isc.isA.String(this.wrap) && this.wrap.toLowerCase() != "off" ? 
                      "' ROWS=10 COLS=10" : "'"),
            " STYLE='",
            this.getElementCSSText(width,height),
            inlineIconStyle,
            "' ");
    },

    //> @attr TextAreaItem.minHeight (int : 16 : IRW)
    // Minimum valid height for this TextAreaItem in px. If the specified +link{TextAreaItem.height}
    // is less than this value, the text area will still render at this height.
    // @visibility external
    //<
    minHeight:16,

    // helper to return the content of the "style" tag in the text box / data element
    getElementCSSText : function (width, height) {
        if (isc.isA.Number(width) && width <= 0) width = 1;
       // so that enlarges to minHeight 
        if (isc.isA.Number(height) && height < this.minHeight) height = this.minHeight;
        return isc.StringBuffer.concat(
            
            this.allowNativeResize ? null : "resize:none;",
            // Ensure there's no margin(helps with sizing and v-alignment with icons)
            
            (isc.TextItem._needNegativeMargins
             ? "margin-top:-1px;margin-bottom:-1px;margin-left:0px;margin-right:0px;"
             : "margin:0px;"),
            (isc.isA.Number(width) 	? "WIDTH:" + width + "px;" : ""),
            (isc.isA.Number(height)	? "HEIGHT:" + height + "px;" : ""),
            // text align property, known to be supported in IE6 and Moz/Firefox on
            // Windows, not supported on Safari 1.2
            (this.textAlign ? "text-align:" + this.textAlign + ";" : ""),

            
            (isc.Browser.isChrome ? "display:block;" : ""),
            
            
            (isc.Browser._supportsWebkitOverflowScrolling &&
             this._useNativeTouchScrollingCSS() ? "-webkit-overflow-scrolling:touch;" : null),

            // We write white-space:nowrap onto the containing cell in order to
            // have valueIcons appear on the same line as the textarea.
            // This is inherited by the textarea element by default, essentially breaking
            // wrapping display.
            // Handle this by explicitly specifying whitespace on the element:
            // white-space:pre-wrap: This allows normal wrapping to occur at the edge
            // of the text-area box. This is appropriate for both wrap "soft" and "hard"
            // white-space:pre: This suppresses normal wrapping but still allows carriage
            // returns to force new lines.
            this.wrap && this.wrap.toUpperCase() == isc.TextAreaItem.OFF ? 
                    "white-space:pre;" : "white-space:pre-wrap;",

           // In Mozilla we must use the 'moz-user-focus' css property to govern
             // whether this element can recieve focus or not.
             (isc.Browser.isMoz ? 
                    "-moz-user-focus:" + (this._getElementTabIndex() > 0 ? "normal;" 
                                                                        : "ignore;") :
                    "")
        );
    },

    _useNativeTouchScrollingCSS : function () {
        var container = this.containerWidget;
        
        return container._browserSupportsNativeTouchScrolling && 
            //!container._usingNativeTouchScrolling() &&
            container.useNativeTouchScrolling;
    },

    getStandaloneItemWrapCSS : function () {
        // in IE, don't set white-space:nowrap in the standlalone HTML because it breaks 
        // <textarea> wrapping
        if (isc.Browser.isIE) return null; 
        return this.Super("getStandaloneItemWrapCSS", arguments);
    },
    
    // Should we write 'nowrap' into the cell containing this item
    
    _cellNoWrap : function () {
        return true;
    },


	//>	@method	textAreaItem.mapValueToDisplay()	(A)
	//	Map from the internal value for this item to the display value.
	//		@group	drawing
	//		@param	internalValue		(String)	Internal value for this item.
	//		@return	(String)	Displayed value corresponding to internal value.
	//<
    
	mapValueToDisplay : function (internalValue, a,b,c,d) {
        var value = this.invokeSuper(isc.TextAreaItem, "mapValueToDisplay", internalValue, a,b,c,d);
        // always display the empty string for null values, rather than "null" or "undefined"
        if (value == null) value = isc.emptyString;
        return value;
        
	},
	
	//>	@method	textAreaItem.mapDisplayToValue()	(A)
	//	Map from a the display value for this item to the internal value.
	//		@group	drawing
	//
	//		@param	displayValue	(String)	Value displayed to the user.
	//		@return	(String)	Internal value corresponding to that display value.
	//<
	mapDisplayToValue : function (displayValue) {
        
        var value = this._parseDisplayValue(displayValue);
        value = this._unmapKey(value); 
        // if the value to be saved is an empty string, map it to 'null' if necessary
        if (isc.is.emptyString(value)) value = this.emptyStringValue;
        return value;
	},
	
	
    // Document the transformPastedValue API here (actually implemented at the FormItem level)
    //> @method TextAreaItem.transformPastedValue()
    // @include FormItem.transformPastedValue()
    // @visibility external
    //<
	
	// This is used by the transformPastedValue logic
    supportsMultilineEntry:true,

    
    //> @attr textAreaItem.formatOnBlur (Boolean : false : IRW)
    // With <code>formatOnBlur</code> enabled, this textAreaItem will format its value
    // according to the rules described in +link{formItem.mapValueToDisplay} as long as the 
    // item does not have focus.  Once the user puts focus into the item
    // the formatter will be removed. This provides a simple way for developers to
    // show a nicely formatted display value in a freeform text field, without the need
    // for an explicit +link{formItem.formatEditorValue()} 
    // and +link{formItem.parseEditorValue()} pair.
    // @visibility external
    //<
    // Implemented at the FormItem level.

    
    // Don't apply arbitrary formatters specified via SimpleType definitions to this item's
    // display value - we have no way to parse it back to a real data value
    applyStaticTypeFormat:false,
    
    // override 'setValue' to update the data value to store when the element value is set to 
    // the empty string.
    // See Text item setValue override for full description
    setValue : function (value) {

        // Make sure in-field hint is hidden
        this._hideInFieldHint();

        
        var undef;
        if (this.emptyStringValue === null || this.emptyStringValue === undef) {
            
            if (value == null || isc.is.emptyString(value)) {
                //this.logWarn("setting the emptyStringValue to :" + isc.Log.echo(value));
                this.emptyStringValue = value;
            }
        }

        // Also clear out the '_hasEditedValue' flag, used to handle line break conversions
        // (See comments by the 'lineBreakValue' property)
        delete this._hasEditedValue;

        // Let parent take care of saving the value
        value = this.Super("setValue", arguments);

        // See if the in-field hint needs to be shown
        if (!this.hasFocus && this._getShowHintInField() && !this._getUsePlaceholderForHint()) {
            if (value == null || isc.isAn.emptyString(value)) {
                this._showInFieldHint();
            }
        }

        return value;
    },

    // Override 'updateValue()' to set a flag on this item marking it as having been edited.
    // This is used by 'getValue()' to determine whether we should convert line breaks to
    // the lineBreakValue for this item.
    updateValue : function () {
        this._hasEditedValue = true;
        return this.Super("updateValue", arguments);
    },

    compareValues : function (value1, value2) {
        if (value1 == null && value2 == null) return true;
        else if (value1 == null || value2 == null) return false;

        // Because a TextAreaItem is whitespace-sensitive, we don't want an actual number to be
        // treated as equal to a string of the number prefixed or suffixed with whitespace. For
        // example, we want the value 0 to be considered distinct from "0\n".
        // Also, 0 needs to be distinct from "-0" and "+0", and numbers have to be distinct from
        // a the string of the number with a unary plus (e.g. 8 distinct from "+8"), or prefixed
        // with zeroes (e.g. 7 distinct from "007"), or with a ".0" suffix.
        //
        // We don't have to worry about this problem for booleans because `true == "true"' and
        // `false == "false"' are both false.
        if (isc.isA.String(value2)) {
            if (isc.isA.Number(value1) || isc.isA.SpecialNumber(value1)) {
                return String(value1) == value2;
            }
        } else if (isc.isA.String(value1)) {
            if (isc.isA.Number(value2) || isc.isA.SpecialNumber(value2)) {
                return value1 == String(value2);
            }
        }

        return this.Super("compareValues", arguments);
    },

    // Override getValue() to convert any line break characters to this.lineBreakValue.
    // See comments by this.lineBreakValue definition for why we do this.
    getValue : function () {
        var value = this.Super("getValue", arguments);
        if (this._hasEditedValue && isc.isA.String(value)) {
            // replace every line break with our line break char string
            if (!this._lineBreakValueRegex) 
                this._lineBreakValueRegex = new RegExp("(\\r\\n|[\\r\\n])", "g");
            value = "" + value;    
            value = value.replace(this._lineBreakValueRegex, this.lineBreakValue);
        }
        
        return value;
    },
    
    // Disallow bubbling of edit / navigation keys
    stopNavKeyPressBubbling:true,
    stopCharacterKeyPressBubbling:true,
    
    // Disallow bubbling of page up / page down keys (used for scrolling)
    // unless we're already at the top or bottom of the text-box
    _$Page_Up:"Page_Up",
    _$Page_Down:"Page_Down",
    _$Enter:"Enter",
    shouldStopKeyPressBubbling : function (keyName, characterValue) {
        if (keyName == this._$Enter) return true;
        if (keyName == this._$Page_Up) return this.getScrollTop() != 0;
        if (keyName == this._$Page_Down) {
            var element = this._getTextBoxElement();
            if (element) {
                return (element.scrollHeight - element.clientHeight) > this.getScrollTop();
            }
        }

        return this.Super("shouldStopKeyPressBubbling", arguments);                
    },



    // SCROLLING
    // Add support for programmatic scrolling of TextAreas
    
    
    
    getScrollHeight : function () {
        var element = this._getTextBoxElement();
        if (element == null) return this.getHeight();
        
        return element.scrollHeight;
    },
    
    getScrollWidth : function () {
        var element = this._getTextBoxElement();
        if (element == null) return this.getWidth();
        
        return element.scrollWidth;    
    },
    
    _hscrollOn : function () {
        var element = this._getTextBoxElement();
        return element && element.scrollWidth > element.clientWidth;
    },

    _vscrollOn : function () {
        var element = this._getTextBoxElement();
        return element && element.scrollHeight > element.clientHeight;
    },    
    
    getScrollTop : function () {
        var element = this._getTextBoxElement();
        if (element == null) return 0;
        return element.scrollTop;
    },
    
    getScrollLeft : function () {
        var element = this._getTextBoxElement();
        if (element == null) return 0;
        return element.scrollLeft;
    },
    
    scrollTo : function (left, top) {
        var element = this._getTextBoxElement();
        if (element == null) return;
        if (left != null) element.scrollLeft = left;
        if (top != null) element.scrollTop = top;        
    },
    
    scrollToTop : function () {
        this.scrollTo(null, 0);
    },

    scrollToBottom : function () {
        var maxScroll = this.getScrollBottom();
        if (maxScroll >= 0) {
            this.scrollTo(null, maxScroll);
        }
    },
    
    // get the maximum possible scroll position
    getScrollBottom : function () {
        var textBox = this._getTextBoxElement();
        if (textBox == null) return 0;
        
        return textBox.scrollHeight - textBox.clientHeight;
    },

    // Called by DF on mouse-wheel event. Return true if the user is
    // scrolling the actual text box.
    _stopBubblingMouseWheelEvent : function (event, eventInfo) {

        var overElement = this._isOverTextBox,
            shouldStop = false;

        if (overElement && this._vscrollOn()) {
            
            
            if (this._currentScrollTargetElement == null) {
                var scrollTop = this.getScrollTop(),
                    delta = isc.EH.getWheelDelta();
                // If we were passed a delta of zero it's not clear whether the user was
                // scrolling up or down. Always intercept this event but don't remember the
                // decision!
                
                if (delta == 0) {
                    return true;
                }
                var elementAtEnd = (delta < 0) ? (scrollTop == 0)
                                                    : (scrollTop >= this.getScrollBottom());

                // if we're already at the end, assume the user is attempting to scroll
                // the form.
                this._currentScrollTargetElement = elementAtEnd ? "parent" : "textbox";
            }

            shouldStop = (this._currentScrollTargetElement == "textbox");
            // reset the 'current scroll target' on pause
			isc.EH.fireOnPause("clearCurrentScrollTargetElement",
								{target:this, methodName:"clearCurrentScrollTargetElement"},
								200);
        }
        return shouldStop;
    },
    
    clearCurrentScrollTargetElement : function () {
        delete this._currentScrollTargetElement;
    }
});
