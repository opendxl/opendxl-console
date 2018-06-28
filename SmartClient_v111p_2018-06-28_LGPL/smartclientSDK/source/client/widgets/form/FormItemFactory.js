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
//>	@class	FormItemFactory
//
//	Singleton class to create FormItems for you from object literals
//
//	TODO: consider making this a static method on FormItem.
//
//<
isc.ClassFactory.defineClass("FormItemFactory");
isc.FormItemFactory.addClassMethods({

    // given a form item instantiation object, return the name of the formItem class to use
    getItemClassName : function (object, className, form, dontChangeObject) {
        if (className == null) className = object.editorType || object.formItemType || 
                                                    object.type;

        // Special case SelectOtherItems and SelectItems - 
        //  look back at the form's useNativeSelectItems property.
        if (isc.isA.String(className)) {
            var lccn = className.toLowerCase();
     
            if (lccn.contains(isc.DynamicForm._$select)) {       
                // make 'selectOther's into 'selects' with the isSelectOther property set to
                // true.

                if (lccn == "selectother" || lccn == "selectotheritem") {
                    lccn = "select";
                    if (!dontChangeObject) object.isSelectOther = true;
                }
                
                if (lccn == "select" || lccn == "selectitem") {
                    form = object.form || form;
                    var useNativeSelect = (!isc.ListGrid || 
                                  (object.multiple && object.multipleAppearance == "grid") || 
                                  (form ? form.useNativeSelectItems : false));
                    if (useNativeSelect) className = "NativeSelectItem"
                    else className = "SelectItem";
                }
            }
            if (lccn == isc.DynamicForm._$multifile) className = "MultiFileItem";
            else if (lccn == isc.DynamicForm._$multiupload) className = "MultiUploadItem";
            else if (lccn == isc.DynamicForm._$base64Binary.toLowerCase()) className = "SOAPUploadItem";
        }
        return className;
    },
    
    // get the form item class that className seems to indicate, or null if there's no match
    _$text : "text",
    _$Item : "Item",
    _$TextareaItem : "TextareaItem",
    _$TextAreaItem : "TextAreaItem",
    _$DatetimeItem : "DatetimeItem",
    _$DateTimeItem : "DateTimeItem",
    _classTable : {},
    getItemClass : function (className) {
    
		var classObject = isc.ClassFactory.getClass(className);

        // if the className was not the literal class name of a FormItem subclass
		if (!classObject || !isc.isA.FormItem(classObject)) {
            // Assume that an SGWTFactory is a FormItem subclass if supplied here.
            // We don't have an easy way to actually check at this point.
            if (isc.SGWTFactory && isc.isA.SGWTFactoryObject(classObject)) return classObject;

            // catch ToolSkin subclasses of form items, like TTextAreaItem here
            if (className != null && className.startsWith("T")) {
                var normalClassName = className.substring(1),
                    classObject = isc.ClassFactory.getClass(normalClassName);
                if (isc.isA.FormItem(classObject)) return classObject;
            }
            
			if (className == null) className = this._$text;
            var table = this._classTable,
                officialName = table[className];
            if (!officialName) {
                officialName = table[className] =
        			// assume the short name of the type was used (eg text -> TextItem)
		        	className.substring(0,1).toUpperCase() + 
                            className.substring(1) + this._$Item;
            }
            // synonym
			if (officialName == this._$TextareaItem) officialName = this._$TextAreaItem;
            if (officialName == this._$DatetimeItem) officialName = this._$DateTimeItem;
			classObject = isc.ClassFactory.getClass(officialName);
		}
        return classObject; // may still be null
    },

	//>	@method	FormItemFactory.makeItem()	(A)
	//		@group	creation
	//			given an object literal, convert it to an appropriate FormItem type
	//
	//		@param	object		(Object)	properties for the new object
	//	XXX we may want to pass other defaults here...
	//		@return	(FormItem)		an appropriate FormItem
	//<
	makeItem : function (object) {

		if (object == null) return null;
		
		if (isc.isA.FormItem(object)) {
			//>DEBUG
			//this.logDebug("Returning formItem " + object);
		   	//<DEBUG
			return object;
		}
		
		var className = this.getItemClassName(object),
            classObject = this.getItemClass(className);

		// if no class was found, use a generic TextItem
		if (!classObject) {
			//>DEBUG
			this.logWarn("makeItem(): type " + object.type + " not recognized, using TextItem");
			//<DEBUG
			classObject = isc.TextItem;
		}

		//>DEBUG
		//this.logDebug("Making item of class " + classObject.Class);
		//<DEBUG
		return isc.ClassFactory.newInstance(classObject, object);
	}
});
