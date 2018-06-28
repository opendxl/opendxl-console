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
//> @class NestedEditorItem
// Form item which renders a single complex sub-object in an embedded component.  By default,
// the embedded component is a +link{class:DynamicForm}
// @inheritsFrom CanvasItem
// @treeLocation Client Reference/Forms/Form Items
// @visibility internal
//<
isc.ClassFactory.defineClass("NestedEditorItem", "CanvasItem");
isc.NestedEditorItem.addProperties({

    shouldSaveValue: true,
    
    
    isCriteriaEditor:false,

  	//> @attr	nestedEditorItem.editor		(AutoChild DynamicForm : null : [IRW])
    //
    // The editor that will be rendered inside this item.  Unless overridden, the editor will be
    // an instance of +link{class:DynamicForm}. It will be created using the overrideable 
    // defaults standard to the +link{group:autoChildren,AutoChild} subsystem - editorConstructor 
    // and editorProperties.
    //
    //  @visibility internal
	//<
    editorConstructor: "DynamicForm",
    editorDefaults: {
        itemChanged : function (item, newValue) {
            var values = this.creator.isCriteriaEditor ? this.getValuesAsCriteria() 
                            : this.getValues();
            if (values != null) {
                values = isc.addProperties({}, values);
            }
        	this.creator.storeValue(values);
        }
    }
    
});

isc.NestedEditorItem.addMethods({
    init : function () {
        this._createEditor();
        this.Super("init", arguments);
    },
    
    isEditable : function () {
        return true;
    },

    _createEditor: function(){

        var ds;
        var dynProps = {};
        
        // Should be, otherwise how have we ended up with a complex field?
        if (this.form.dataSource) { 
            ds = isc.DataSource.getDataSource(this.form.dataSource);
            var field = ds.getField(this.name);
            if (field) {
                dynProps.dataSource = ds.getFieldDataSource(field);
            }
        }

        if (this.form && this.form.showComplexFieldsRecursively) {
            dynProps.showComplexFields = true;
            dynProps.showComplexFieldsRecursively = true;
        } else {
            dynProps.showComplexFields = false;
        }

        if (this.grid) {
            // if this item is being used as an editor in a grid, prevent the child editor form
            // from overflowing the item - fill the item width and then apply overflow: CLIP_H
            dynProps.width = this.getWidth();
            dynProps.overflow = isc.Canvas.CLIP_H;
        }

        dynProps.values = this.getValue();

        this.addAutoChild("editor", dynProps);
        this.canvas = this.editor;        
    },
    
    showValue : function (displayValue, value) {
        this.editor.setValues(value);
    },
        
    _shouldAllowExpressions : function () {
        return false;
    }

});

