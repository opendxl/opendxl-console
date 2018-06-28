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
//>	@class	RadioItem
// Form item representing a member of a radio group, subclassed from +link{NativeCheckboxItem}.
// RadioItems items are created and managed automatically by +link{RadioGroupItem} instances
// and should not be instantiated directly.
//
// @inheritsFrom NativeCheckboxItem
//  @treeLocation   Client Reference/Forms/Form Items/RadioGroupItem
// @visibility external
//<
isc.ClassFactory.defineClass("RadioItem", "NativeCheckboxItem");
isc.RadioItem.addProperties({
    //> @attr radioItem.prompt (HTMLString : null : IRW)
	// Mouse-over prompt for the label of this item
	//		@group	appearance
	//<
	//prompt:null

    //>	@attr	radioItem._elementType				(String : "RADIO" : IRW)
	//			type of item ("CHECKBOX" or "RADIO")
	//		@group	appearance
	//<
	_elementType:"RADIO", 
    
    //>	@attr	radioItem.value             (Any : true : IRW)
	//          "value" for this radio item, to be returned when the item is selected.
	//  @group formValues
    //  @visibility internal
	//<
    value : true,
    
    //>	@attr	radioItem.unselectedValue   (Any : null : IRW)
	//          Value to be returned from this radio item when it is unselected.
	//   @group formValues
    //   @visibility internal
	//<
    
    //>	@attr	radioItem.defaultValue      (Any : null : IRW)
	//          Override defaultValue to be null - note that the value returned from an unselected
    //          radioItem will always be null. Set to radioItem.value to have the radioItem be drawn
    //          in a selected state initially.
	//   @group formValues
	//<
    defaultValue:null
});
isc.RadioItem.addMethods({


	//>	@method	radioItem.setElementValue()
	//		@group	elements
	//			update the visible value displayed in the form element to the reflect value passed in
	//
	//		@param	newValue 	(Any)				value to set the element to
	//<
	setElementValue : function (newValue) {
		// get a pointer to the element for this item
		var element = this.getDataElement();
		
		// if no element was found, bail
		if (!element) return null;
        
        
        if (isc.isA.String(this.value)) newValue = (newValue + "");
        
		// set the value of the item
		return element.checked = (this.value == newValue);
	},
    
	//>	@method	radioItem.getElementValue()
	//		@group	elements
	//			return the value stored in the form element(s) for this item
	//
	//		@return	(Any)		value of this element
	//<
	getElementValue : function () {
		// get a pointer to the element for this item
		var element = this.getDataElement(),
            selectedValue = this.value,
            unselectedValue = this.unselectedValue;
		
		// if no element was found, bail
		if (!element) return unselectedValue;
		
		// get the value of the item
		return (element.checked ? selectedValue : unselectedValue);
	},
	
	//>	@method	radioItem.boxTitleClick()
	//		@group	event handling
	//			handle a click on the label of a checkbox or radio button
	//			this toggles the state of the item
	//
	//<
	boxTitleClick : function () {
		// get a pointer to the element
		var element = this.getDataElement();
		
		// toggle the checked property of the element
		if (element && !element.checked) {
			element.checked = true;
			// call the elementChanged method of the form
			this.form.elementChanged(this.getItemID())
		}
	},
	
	//>	@method	radioItem.mapValueToDisplay()	(A)
	//		@group	drawing
	//			Map from the internal value for this item to the display value.
	//		@param	internalValue		(String)	Internal value for this item.
	//		@return	(String)	Displayed value corresponding to internal value.
	//<
	mapValueToDisplay : function (internalValue) {
		return internalValue;
	},
	
	//>	@method	radioItem.mapDisplayToValue()	(A)
	//		@group	drawing
	//			Map from a the display value for this item to the internal value.
	//
	//		@param	displayValue	(String)	Value displayed to the user.
	//		@return	(String)	Internal value corresponding to that display value.
	//<
	mapDisplayToValue : function (displayValue) {
		return displayValue;
	},

    //> @method radioItem.setElementReadOnly()
    // Change the read-only state of the form element immediately.
    //<
    setElementReadOnly : function (readOnly) {
        // A radio button should be rendered as disabled to simulate read-only.
        this._setElementEnabled(!readOnly && !this.isDisabled());
    }

});


