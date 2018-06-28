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
// Class will not work without DynamicForm
if (isc.DynamicForm) {

//> @class PropertySheet
//
// Editor with a minimalist appearance, tuned for editing large numbers of properties in a
// constrained space.
//
// @inheritsFrom DynamicForm
// @treeLocation Client Reference/Forms
//
// @visibility external
//<
isc.defineClass("PropertySheet", "DynamicForm").addProperties({

    autoChildItems:true,
    
    // Don't show 'spelling errors' - this is used to edit the properties of form items, etc
    browserSpellCheck:false,

    // for all FormItems
    autoChildDefaults : {
	    cellStyle:"propSheetValue",
    	titleStyle:"propSheetTitle",
        showHint:false
    },

    // borders don't look particular good around GroupItems
    GroupItemDefaults : {
	    cellStyle:null
    },

    ExpressionItemDefaults : {
        width:"*",
    	height:18,
        showActionIcon:true
    },
    ActionMenuItemDefaults : {
        width:"*",
        height:18
    },
    

    SelectItemDefaults : {
    	height:20,
        width:"*"
    },

    DateItemDefaults : {
        width:"*"
    },

    TextItemDefaults : {
    	width:"*",
        height:20
    },

    StaticTextItemDefaults : {
    	width:"*",
        height:20,
    	textBoxStyle:"propSheetField"
    },

    
    ColorItemDefaults : {
    	width:"*",
	    height:16,
        pickerIconHeight:16, pickerIconWidth:16,
        pickerIconSrc:"[SKIN]/DynamicForm/PropSheet_ColorPicker_icon.png",
    	textBoxStyle:"propSheetField"
    },

    HeaderItemDefaults : {
	    cellStyle:"propSheetHeading"
    },

    TextAreaItemProperties : {width:"*"},

    // place labels on left
    CheckboxItemDefaults : {
        showTitle:true, 
        showLabel:false,
        getTitleHTML : function () { // NOTE: copy of FormItem.getTitle()
            if (this[this.form.titleField] != null) return this[this.form.titleField];
            return this[this.form.fieldIdProperty];
        }
    },
    
    // Apply a different cellStyle to sectionItems - we don't want the 1px border around them
    SectionItemDefaults : {
        cellStyle:"propSheetSectionHeaderCell"
    },

    titleAlign:"left",
	titleWidth:120,
	cellSpacing:0,
	cellPadding:0,
	backgroundColor:"white",
	requiredTitlePrefix:"<span style='color:green'>",
	requiredTitleSuffix:"</span>",
	titleSuffix:"",
    clipItemTitles:true

});

}
