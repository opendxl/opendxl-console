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
//>	@class	StaticTextItem
//	A FormItem that displays an uneditable value.
// @inheritsFrom FormItem
// @visibility external
//<
isc.ClassFactory.defineClass("StaticTextItem", "FormItem");
isc.StaticTextItem.addProperties({
    //>	@attr	staticTextItem.height		(number : null : IRW)
	//			don't specify a height so the table cell will expand
	//			to show the entire contents.  Note that this can 
	//			mess up dynamic height calculations in forms.
	//		@group	appearance
	//<
	height:null,

	//> @attr staticTextItem.applyHeightToTextBox (Boolean : false : IRA)
    // If +link{formItem.height} is specified, should it be applied to the
    // item's text box element?
    // <P>
    // Overridden to be <code>false</code> for StaticTextItems by default.
    // <P>
    // See +link{FormItem.shouldApplyHeightToTextBox,shouldApplyHeightToTextBox()} for more information.
    // @visibility external
    //<
	applyHeightToTextBox:false,

    //> @attr staticTextItem.applyAlignToText (boolean : true : IRA)
    // If the +link{FormItem.textAlign,textAlign} is unset, should the +link{FormItem.align,align}
    // setting, if set, be used for this <code>StaticTextItem</code>'s <code>textAlign</code>?
    // @include FormItem.applyAlignToText
    //<
    applyAlignToText:true,

    //>	@attr	staticTextItem.wrap		(Boolean : true : IRW)
	// @include FormItem.wrap
	//		@group	appearance
    // @visibility external
	//<
	wrap:true,

    //>@attr    staticTextItem.clipValue (Boolean : false : IRW)
    // @include FormItem.clipValue
    // @group appearance
    // @visibility external
    //<
    clipValue:false,

    //>	@attr	staticTextItem.textBoxStyle    (FormItemBaseStyle : "staticTextItem" : IRW)
	//  Base CSS class for this item
	// @group   appearance
    // @visibility external
	//<
	textBoxStyle:"staticTextItem",
	
	//> @attr staticTextItem.canSelectText (boolean : true : IRW)
	// Should the user be able to select the text in this item?
	// @visibility external
	//<
	canSelectText:true,
	
	// when dynamically showing/hiding icons we should be able to resize our textBox without
	// redraw.
	redrawOnShowIcon:false,

    //>	@attr	staticTextItem.outputAsHTML (boolean : null : IRW)
	// By default HTML values in a staticTextItem will be interpreted by the browser.
    // Setting this flag to true will causes HTML characters to be escaped, meaning the
    // raw value of the field (for example <code>"&lt;b&gt;AAA&lt;/b&gt;"</code>) is displayed
    // to the user rather than the interpreted HTML (for example <code>"<b>AAA</b>"</code>)
    // @group appearance
    // @visibility external
    // @deprecated in favor of +link{staticTextItem.escapeHTML}
	//<
//	outputAsHTML:false,

    // set useShortDateFormat to false.
    // This will use "toNormalDate()" rather than toShortDate for date values 
    // Other than those in logical "date" type fields (where we don't want to show time).
    // Document this behaviour by explicitly calling it out in the dateFormatter docs for
    // StaticTextItems.
    //>	@attr staticTextItem.dateFormatter (DateDisplayFormat : null : [IRWA])
    // Display format to use for date type values within this formItem.
    // <P>
    // Note that Fields of type <code>"date"</code>, <code>"datetime"</code> or <code>"time"</code> will
    // be edited using a +link{DateItem} or +link{TimeItem} by default, but 
    // this can be overridden - for <code>canEdit:false</code> fields, a
    // +link{StaticTextItem} is used by default, and the developer can always specify 
    // a custom +link{formItem.editorType} as well as +link{formItem.type,data type}.
    // <P>
    // The +link{formItem.timeFormatter} may also be used to format underlying Date values as
    // times (ommitting the date part entirely). If both <code>dateFormatter</code> and
    // <code>timeFormatter</code> are specified on an item, for
    // fields specified as +link{formItem.type,type "time"} the
    // <code>timeFormatter</code> will be used, otherwise the <code>dateFormatter</code>
    // <P>
    // If <code>item.dateFormatter</code> and <code>item.timeFormatter</code> is unspecified,
    // date display format may be defined at the component level via
    // +link{DynamicForm.dateFormatter}, or for fields of type <code>"datetime"</code>
    // +link{DynamicForm.datetimeFormatter}. Otherwise for fields of type "date",
    // default is to use the system-wide default short date format, configured via
    // +link{DateUtil.setShortDisplayFormat()}. For fields of type "datetime" or for Date values
    // in fields whose type does not inherit from the logical "date" type, default is to use
    // the system-wide normal date format configured via +link{DateUtil.setNormalDisplayFormat()} 
    // (using "toNormalDate()" on logical <code>"date"</code> type fields is not desirable as this
    // would display the time component of the date object to the user).<br>
    // Specify any valid +link{type:DateDisplayFormat} to 
    // change the format used by this item.
    // 
    // @see formItem.timeFormatter
    //
	// @group appearance
    // @visibility external
	//<
	//dateFormatter:null,
    useShortDateFormat:false,

    //> @attr staticTextItem.escapeHTML (Boolean : false : IRW)
	// By default HTML values in a staticTextItem will be interpreted by the browser.
    // Setting this flag to true causes HTML characters to be escaped, meaning the
    // raw value of the field (for example <code>"&lt;b&gt;AAA&lt;/b&gt;"</code>) is displayed
    // to the user rather than the interpreted HTML (for example <code>"<b>AAA</b>"</code>)
    // @group appearance
    // @visibility external
	//<
	// implemented at the formItem level - enable via the canEscapeHTML flag
	canEscapeHTML:true,
	escapeHTML:null,
    
     // override 'emptyDisplayValue' to write out "&nbsp;" instead of "" for styling
    emptyDisplayValue:"&nbsp;"
                                       
});
isc.StaticTextItem.addMethods({

    // Static text items are used for display only - non editable
    isEditable : function () {
        return false;
    },

    // A StaticTextItem's value is clipped if either clipValue or clipStaticValue is set.
    _getClipValue : function () {
        return !!this.clipValue || this._getClipStaticValue();
    },

    _canFocus : function () {
        if (this.canFocus != null) return this.canFocus;
        // needs to be focusable in screen reader mode because the value will only be read if the item
        // can be tabbed to
        return isc.screenReader;
    },

    // in canEdit: false mode, fields of type="float" become StaticTextItems, but we still want
    // to apply the decimalPad/precision flags on these displayed values.  Note that this code
    // also appears in FloatItem
    mapValueToDisplay : function (value) {
        if (isc.SimpleType.inheritsFrom(this.type, "float")) {
            var floatValue = null;
            if (isc.isA.String(value) && (this.type == null || !this.type.startsWith("locale"))) {
                var parsedValue = window.parseFloat(value);
                if (!window.isNaN(parsedValue) && parsedValue == value) {
                    floatValue = parsedValue;
                }
            } else if (isc.isA.Number(value)) {
                floatValue = value;
            }
            if (floatValue != null) {
                if (this.format) {
                    return isc.NumberUtil.format(floatValue, this.format);
                
                } else if (this._simpleType != null && this._simpleType.editFormatter != null) {
            
                    var form = this.form,
                        record = this.form ? this.form.values : {};
                    return this._simpleType.editFormatter(value, this, form, record);

                } else if (this.decimalPrecision != null || this.decimalPad != null) {
                    return isc.Canvas.getFloatValueAsString(floatValue,
                        this.decimalPrecision, this.decimalPad);
                } else if (this.precision != null) {
                    return isc.Canvas.getNumberValueAsString(floatValue, 
                        this.precision, "float");
                }
            }
        }
        return this.Super("mapValueToDisplay", arguments);
    }    
});

