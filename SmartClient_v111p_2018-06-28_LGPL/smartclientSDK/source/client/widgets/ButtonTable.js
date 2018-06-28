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
// ButtonTable: a table of clickable items
isc.ClassFactory.defineClass("ButtonTable",isc.Canvas);
isc.ButtonTable.addProperties({
	//items:null,
	cellSpacing:0,
	cellPadding:2,
	cellBorder:0,
	tableStyle:"menuTable",
	baseButtonStyle:"button",
	backgroundColor:"CCCCCC",
    useEventParts: true                                 
});
isc.ButtonTable.addMethods({
    setItems : function (items) {
        this.items = isc.shallowClone(items);
        this.redraw();
    },
	getInnerHTML : function () {
		var output = isc.SB.create();
		output.append(
			"<TABLE",
					" CLASS=" , this.tableStyle,
					// take off space for scrollbar if necessary
					" WIDTH=" , this.getWidth() - (this.overflow == isc.Canvas.SCROLL || this.overflow == isc.Canvas.AUTO ? this.getScrollbarSize(): 0),
					" HEIGHT=" , this.getHeight(), 
					" CELLSPACING=", this.cellSpacing, 
					" CELLPADDING=", this.cellPadding, 
					" BORDER=" , this.cellBorder, 
				"><TR>");
		
		for (var r = 0; r < this.items.length; r++) {
			var row = this.items[r];
			output.append("<TR>");
			
			if (!isc.isAn.Array(row)) row = [row];
			for (var i = 0; i < row.length; i++) {
				var item = row[i];
				if (item.eventPart) {
					output.append(this.getCellButtonHTML(item.contents, 
                                                         item.style, item.disabled, item.selected,
                                                         item.align, item.extraTagStuff,
                                                         item.eventPart, item.eventId));						
				} else {
					output.append(this.getCellHTML(item.contents, item.style, item.align, item.extraTagStuff));
				}
			}
			output.append("</TR>");
		}
		
		output.append("</TABLE>");

		return output.release(false);
	},
	
    buttonTableClickMaskDefaults: {
        _constructor: "Canvas",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        click : function () {
            this.creator.hide();
        }
    },

    showModal : function () {
        if (!this.buttonTableClickMask) {
            // show a local clickMask canvas
            this.buttonTableClickMask = this.createAutoChild("buttonTableClickMask");
        }
        this.buttonTableClickMask.show();
        this.buttonTableClickMask.bringToFront();

        // show this menu, unmask it and move it above the local clickMask canvas
        this.show();
        this.unmask();
        this.moveAbove(this.buttonTableClickMask);
    },

	// override hide to hide the clickMask
	hide : function () {
        this.Super("hide", arguments);
        // hide the local clickMask canvas
        if (this.buttonTableClickMask) this.buttonTableClickMask.hide();
	},

    destroy : function () {
        if (this.buttonTableClickMask) {
            // destroy local the clickMask canvas
            this.buttonTableClickMask.destroy();
            this.buttonTableClickMask = null;
        }
        this.Super("destroy", arguments);
    },
    
    // base style and state.
    // The "base" style can be modified to be "Over", "Selected" or "Disabled"
    // Note that "Over" and "Disabled" are mutex - we apply the standard "over" state to
    // disabled buttons (though we do support the "SelectedOver" state)
    
    getButtonBaseStyle : function (element) {
        var baseStyle;        
        if (element) baseStyle = element.getAttribute("basestyle");
        if (!baseStyle) baseStyle = this.baseButtonStyle;
        return baseStyle;
    },
    
    getMouseOutStyle : function (element) {
        var baseStyle = this.getButtonBaseStyle(element);
        if (this.buttonIsSelected(element)) {
            baseStyle += "Selected"
        }
        if (this.buttonIsDisabled(element)) {
            baseStyle += "Disabled"
        }
        return baseStyle;
    },
    
    buttonIsSelected : function (element) {
        return element && element.getAttribute("buttonselected");
    },
    
    buttonIsDisabled : function (element) {
        return element && element.getAttribute("buttondisabled");
    },
    

	cellButtonOver : function (element) {
        var style = this.getButtonBaseStyle(element);
        if (this.buttonIsSelected(element))  style += "Selected";
		if (element) element.className = style + "Over";
        
	},

	cellButtonOut : function (element) {
        if (!element) return; 
        element.className = this.getMouseOutStyle(element);
	},
	
	cellButtonDown : function (element) {
		if (element) {
            var style = this.getButtonBaseStyle(element);
            if (this.buttonIsSelected(element))  style += "Selected";
            style += "Down"
            element.className = style;
        }
	},
	
	getCellHTML : function (contents, style, align, extraTagStuff) {
        // No need to write basestyle onto this element - we only show dynamic-styling for
        // buttons, not standard cells
		return isc.StringBuffer.concat(
			"<TD ALIGN=" , (align || isc.Canvas.CENTER), " CLASS=" , (style || this.baseButtonStyle + "Disabled") , 
				(extraTagStuff || extraTagStuff), ">",
				contents,
			"</TD>"
		);
	},

    handleMouseDown : function (event) {
        
        event.touchStartReturnValue = false;

        var element = event.nativeTarget;

        // call CellButtonDown on the table cell, not the contained HTML
        if (element.tagName != "TD") element = element.parentNode;

        // do not call CellButtonDown for clicks on HTML generated by getCellHTML
        if (!element.getAttribute || !element.getAttribute(this._$eventPart)) return;

        this.cellButtonDown(element);
        this.Super("handleMouseDown", arguments);
    },

    handleMouseUp : function (event) {
        var element = event.nativeTarget;

        // call CellButtonOut on the table cell, not the contained HTML
        if (element.tagName != "TD") element = element.parentNode;

        // do not call CellButtonOut for clicks on HTML generated by getCellHTML
        if (!element.getAttribute || !element.getAttribute(this._$eventPart)) return;

        this.cellButtonOut(element);
        this.Super("handleMouseUp", arguments);
    },

	getCellButtonHTML : function (contents, style, selected, disabled, align,
                                  extraTagStuff, eventPart, id) {

        if (style == null) style = this.baseButtonStyle;
        var modifiedStyle = style;
        
        if (selected) modifiedStyle += "Selected";
        if (disabled) modifiedStyle += "Disabled";

        // always install an eventpart property to distinguish from getCellHTML()
        var eventHTML = " " + this._$eventPart + "=" + (eventPart ? eventPart : "_noHandler");
        if (id != null) eventHTML += " id=" + this.getID() + "_" + eventPart + "_" + id;

		return isc.StringBuffer.concat(
			"<TD ALIGN=" , (align || isc.Canvas.CENTER), " CLASS=" , modifiedStyle, 
				" ONMOUSEOVER='" , this.getID() , ".cellButtonOver(this);return false;' ",
				" ONMOUSEOUT='" , this.getID() , ".cellButtonOut(this);return true;'",
                " basestyle='", style, "'",
                (selected ? " buttonselected='true'" : null),
                (disabled ? " buttondisabled='true'" : null),
				(extraTagStuff ? " " + extraTagStuff : null),
                eventHTML + ">",
                contents,
			"</TD>"
		);
	}
});

