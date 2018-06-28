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
//> @class ValidatorEditor
// A user-interface component for creation and editing of a +link{Validator}.
// @treeLocation Client Reference/Data Binding
// @visibility devTools
//<
isc.defineClass("ValidatorEditor", "VLayout");


isc.ValidatorEditor.addProperties({

    // ----
    // Basics / Attributes
    // ----
    
    // Default height to explicit size. This will give it "implicit height" and stop it
    // expanding in Layouts to fill available space.
    height:100,
    
    //> @attr validatorEditor.validator (Validator : null : IRW)
    // Validator to be edited by this validatorEditor. Use +link{setValidator} and +link{getValidator}
    // to update or retrieve this object at runtime.
    // @getter getValidator
    // @setter setValidator
    // @visibility devTools
    //<
    
    //> @attr validatorEditor.fieldName (FieldName : null : IRW)
    // Name of the field to which the validator applies.  The fieldName should refer
    // to a field within the +link{validatorEditor.dataSource,dataSource}.
    // @visibility devTools
    //<

    //> @attr validatorEditor.dataSource (DataSource : null : IR)
    // DataSource where this validator will be applied. The +link{validatorEditor.fieldName}
    // should refer to a field within this dataSource.
    // @visibility devTools
    //<
    
    //> @attr validatorEditor.validatorType (ValidatorType : null : IRW)
    // Type of validator being edited. If +link{showTypePicker} is true, this may be chosen
    // by the user.
    // @setter setValidatorType
    // @visibility devTools
    //<

    //> @attr validatorEditor.availableTypes (Array of ValidatorType : [...] : IR)
    // List of available validator types.  Defaults to all validator types
    // that do not require input of a custom expression (eg "requiredIf"), excluding validators 
    // that just verify the field type and are usually implicit (isBoolean, isString, etc).
    // <P>
    // The special value "range" may be specified to indicate that the appropriate "range"
    // validator for the field type (integerRange, dateRange, etc) should
    // be used.
    // @visibility devTools
    //<
    
    availableTypes:[
        "matchesField",
        "isOneOf",
        "lengthRange",
        "contains",
        "doesntContain",
        "substringCount",
        "regexp",
        "mask",
        "floatPrecision",
        "isUnique",
        "hasRelatedRecord",
        "range"
    ],
    
    //> @attr validatorEditor.applyWhen (AdvancedCriteria : null : IRW)
    // Criteria indicating under what circumstances the validator should be applied.
    // @visibility devTools
    //<
    
    //> @attr validatorEditor.applyWhenTitle (String : "Apply When": IR)
    // Title of the applyWhen field.
    // @group i18nMessages
    // @visibility devTools
    //<
    applyWhenTitle:"Apply When",

    //> @attr validatorEditor.applyWhenPlaceholder (String : "[always applied]": IR)
    // Placeholder text displayed to right of +link{applyWhenTitle, If} when unchecked.
    // @group i18nMessages
    // @visibility devTools
    //<
    applyWhenPlaceholder:"[always applied]",

    //> @attr validatorEditor.applyWhenPlaceholderHintStyle (CSSStyleName : "staticTextItemDisabled" : IRW)
    // CSS class for the "applyWhenPlaceholder" text.
    // @visibility devTools
    //<
    applyWhenPlaceholderHintStyle:"staticTextItemDisabled",

    //> @attr validatorEditor.validatorTitle (String : "Validator Type": IR)
    // Title of the validator details field.
    // @group i18nMessages
    // @visibility devTools
    //<
    validatorTitle:"Validator Type",

    //> @attr validatorEditor.errorMessageTitle (String : "Error Message": IR)
    // Title of the errorMessage field.
    // @group i18nMessages
    // @visibility devTools
    //<
    errorMessageTitle:"Error Message",

    //> @attr validatorEditor.errorMessageHint (String : "[leave blank to use default error message]": IR)
    // Hint to show in errorMessage errorMessage field.
    // @group i18nMessages
    // @visibility devTools
    //<
    
    errorMessageHint:"[leave blank to use default error message]",
    
    //> @attr validatorEditor.defaultEditorTitle (String : "Value": IR)
    // Title to show for the validator-specific fields when <code>validatorDefinition.editorTitle</code>
    // is not defined.
    // @group i18nMessages
    // @visibility devTools
    //<
    defaultEditorTitle:"Value",

    // -------
    
    
    // default width to 400 - that's enough to accommodate the mainForm
    width:400,
    
    
    initWidget : function () {
        var initialValidator = this.validator;
        if (initialValidator != null) {
            this.setValidator(initialValidator, true);
        }

        // call addAutoChildren to build the UI. This will pick up dynamicDefaults from
        // the special 'getDynamicDefaults' method, and will handle custom UI being injected
        // into the layout.
        this.addAutoChildren(this.components);

        // set initial field values based on initial validator passed in.        
        if (this.applyWhenForm) {
            // conditionalForm - configures the "applyWhen" block of the validator
            if (this.applyWhen != null) {
                this.applyWhenForm.setValue("applyWhen", true);
                this.updateConditionalForm(true);
            }
        }
        if (this.validatorForm) {
            this.typePicker = this.validatorForm.getItem("type");
            if (this.validatorType != null) this.typePicker.setValue(this.validatorType);
            
            
            if (this.validatorType != null) {
                this.updateValidatorType(this.validatorType, true);
            }
        }

        // Initialize 'errorMessage' value
        if (this.messageForm) {
            if (initialValidator && initialValidator.errorMessage) {
                this.messageForm.setValue("errorMessage", initialValidator.errorMessage);
            }
        }

        // update the clause to show the initial 'value' field attributes etc if there
        // are any.
        if (initialValidator != null) {
            this.setClauseAttributes(initialValidator);
        }
        
        return this.Super("initWidget", arguments);
    },
    
    // ----
    // UI
    // ----
    
    
    //> @attr validatorEditor.components (Array of Object : [...] : IRA)
    // Member components of this validator editor. Default value is an array of auto-children
    // names (strings), but for custom UI, additional components may be explicitly added.
    // @visibility devTools
    //<
    components:[
        "validatorForm", "messageForm", "applyWhenForm"
    ],
    
    getDynamicDefaults : function (childName) {
        switch (childName) {
            case "applyWhenForm" : 
                var titleProperties = (this.applyWhenTitle ? {title:this.applyWhenTitle} : null),
                    applyWhenItem = isc.addProperties({name:"applyWhen"}, 
                            this.applyWhenItemDefaults, this.applyWhenItemDefaults, titleProperties),
                    placeholderItem = {type:"StaticTextItem", name:"placeholder", showTitle:false, value:this.applyWhenPlaceholder, textBoxStyle:this.applyWhenPlaceholderHintStyle},
                    conditionalItem = {type:"CanvasItem", showTitle:false, name:"conditionalItem", visible:false,
                            createCanvas:function () {
                                return this.form.creator.createConditionalForm()
                            }
                    };

                return {
                    items:[applyWhenItem,placeholderItem,conditionalItem]
                };
                
            // - validatorForm 
            //  o typeItem - for selecting the validator type
            //  o valuesForm (embedded in a CanvasItem) for configuring the validator.
            //    this is a filterClause
            case "validatorForm" :
                var titleProperties = (this.validatorTitle ? {title:this.validatorTitle} : null);
                var typeItem = isc.addProperties(
                        {creator:this, editorType:this.typePickerConstructor},
                         this.typePickerDefaults,
                         this.typePickerProperties,
                         titleProperties
                    );
                    
                var valuesItem = {
                    name:"valuesItem",
                    editorType:"CanvasItem",
                    showTitle:true, title:null,
                    visible:false,
                    canvas:this.getValuesForm(this.validatorType)
                }    
                
                return {
                    disabled:(this.fieldName == null),
                    items:[typeItem, valuesItem]
                };
                
            case "messageForm" :
                var titleProperties = (this.errorMessageTitle ? {title:this.errorMessageTitle} : null),
                    hintProperties = {showHintInField:true, hint:this.errorMessageHint},
                    messageItem = isc.addProperties({name:"errorMessage"}, 
                                this.errorMessageItemDefaults, this.errorMessageItemDefaults, titleProperties, hintProperties);
            
                return {items:[messageItem]};
        }
    },

    getField : function(fieldName) {
        if (this.field) return this.field;
        return this.dataSource.getField(fieldName);
    },

    updateFieldName : function (fieldName) {

        this.fieldName = fieldName;
        var hasFields = fieldName != null,
            supportedTypeRecords = hasFields ? this.getSupportedTypeRecords() : [],
            currentValidatorIsValid;
        
        if (this.validatorType != null && supportedTypeRecords.length > 0) {
            currentValidatorIsValid = (supportedTypeRecords.find("type", this.validatorType) != null);
        }
            
        if (this.validatorForm) {
            if (!currentValidatorIsValid) {
                this.validatorForm.setValue("type", null);
                this.validatorType = null;
            }
            if (supportedTypeRecords.length == 0) {
                this.validatorForm.setDisabled(true);
            } else {
                this.typePicker.optionDataSource.setCacheData(supportedTypeRecords);
                this.validatorForm.setDisabled(false);
            }
        }
        // (Re)Build the filter clause form items.
        // - required if we change validator type [may be entirely different set of value items]
        // - required if we change field [value items may be type-specific or show value map 
        //   of all other fields, etc]
        
        if (hasFields && this.validatorType != null) {
            var oldFieldName = this._lastFieldName,
                needsRebuild = (oldFieldName == null || fieldName != oldFieldName)
            ;
            this._lastFieldName = (fieldName == null ? null : fieldName); 

            if (this.valuesForm.clause.getValue("operator") != this.validatorType) {
                needsRebuild = true;
            }
            
            this.valuesForm.fieldName = fieldName;
            
            this.valuesForm.clause.setValue("fieldName", fieldName);
            this.valuesForm.clause.setValue("operator", this.validatorType);

            if (needsRebuild) {
    
                // We can't just call 'fieldNameChanged()' - that'll attempt to compare the
                // operatorType with an operator object using 'DataSource.getSearchOperator()' which
                // doesn't apply outside of Criteria editing. Insted call updateValueItems directly.
                var validatorDefinition = this.getValidatorDefinition(this.validatorType);

                this.valuesForm.updateValueItems(
                        this.valuesForm.getField(fieldName), validatorDefinition, fieldName);
            }
        } 
        this.updateValuesFormVisibility();
    },
    
    updateValuesFormVisibility : function () {
        if (this.valuesForm) {
            if (this.validatorType == null) {
                this.validatorForm.getItem("valuesItem").hide();
                this.valuesForm.hide();
            } else {
                // Don't show values form if there is nothing to enter.
                // This is a bit complicated because the form has items even
                // if nothing is to be entered. Except for a "fieldName" field
                // which initially shows as visible until actually drawing the
                // other fields are hidden.
                var form = this.validatorForm.getItem("valuesItem").canvas.clause,
                    items = form.items,
                    hasVisibleItems = false
                ;
                items.map(function(item) {
                    hasVisibleItems = hasVisibleItems || (item.name != "fieldName" && item.isVisible());
                });

                if (hasVisibleItems) this.validatorForm.getItem("valuesItem").show();
                else this.validatorForm.getItem("valuesItem").hide();
            }
        }
    },

    // ---
    // Conditional / applyWhen UI
    // ---

    // 'applyWhenForm' contains just the checkbox to show /hide the conditional criteria form
    applyWhenFormConstructor:"DynamicForm",
    applyWhenFormDefaults:{
        numCols:2,
        fixedColWidths:true,
        
        height:20
    },

    applyWhenItemDefaults:{
        showLabel:true, editorType:"CheckboxItem",
        width:20, showTitle:false, align:"right", vAlign:"top",
        changed:"this.form.creator.updateConditionalForm(value)",
        init:function() {
            // Simulate display as title with corresponding prefix/suffix handling
            if (this.form) {
                var form = this.form,
                    orient = form.getTitleOrientation(),
                    titlePrefix = (orient == "right" ? form.rightTitlePrefix : form.titlePrefix),
                    titleSuffix = (orient == "right" ? form.rightTitleSuffix : form.titleSuffix)
                ;
                this.title = titlePrefix + this.title + titleSuffix;
            }
            this.Super("init", arguments);
        }
    },

    //> @attr validatorEditor.filterTopOperatorAppearance (String : "radio" : IR)
    // Set the initial "If" section +link{FilterBuilder.topOperatorAppearance}. Note that
    // when an existing validator that has nested clauses in the <code>applyWhen</code> attribute
    // is edited by calling +link{setValidator} the "If" section will be automatically switched
    // to the "bracket" setting. 
    // @visibility devTools
    //<
    filterTopOperatorAppearance:"radio",

    //> @attr validatorEditor.conditionalForm (AutoChild FilterBuilder : null : IR)
    // Automatically generated filter-builder used to edit the +link{validator.applyWhen} attribute
    // when editing a validator.
    // @visibility devTools
    //<
    conditionalFormConstructor:"FilterBuilder",
    conditionalFormDefaults:{
        showFieldTitles:false,
        fieldPickerProperties: {
        },
        showModeSwitcher:true
    },
    
    createConditionalForm : function () {
        var topOperatorAppearance = this.filterTopOperatorAppearance || "radio";
        this.conditionalForm = this.createAutoChild("conditionalForm", 
            {dataSource:this.dataSource, topOperatorAppearance:topOperatorAppearance}
        );
        this.conditionalForm.fieldPickerProperties.pickListWidth = this.conditionalForm.getWidth();
        return this.conditionalForm;
    },
    
    updateConditionalForm : function (show) {
        var placeholder = this.applyWhenForm.getItem("placeholder"),
            item = this.applyWhenForm.getItem("conditionalItem");
        if (!show) {
            placeholder.show();
            item.hide();
        } else {
            var criteria = this.applyWhen || {};
            this.conditionalForm.setCriteria(criteria);
            placeholder.hide();
            item.show();
        }
        // When setting/clearing a validator set the filter to the simplest
        // for applicable for the criteria.
        this.conditionalForm.setTopOperatorAppearance(isc.DataSource.isFlatCriteria(criteria) ? "radio" : "bracket");
    },
    
    // ---
    // Validator Config UI: type picker and valuesForm
    // ---
    
    // validatorForm - contains the 'typePicker' and the valuesForm CanvasItem  
    validatorFormConstructor:"DynamicForm",
    validatorFormDefaults:{
        numCols:2,
        fixedColWidths:true,
        height:20
    },

    //> @attr validatorEditor.typePicker (AutoChild FormItem : null : IR)
    // Field for picking +link{validatorType}.
    // @visibility devTools
    //<

    //> @attr validatorEditor.showTypePicker (boolean : null : IR)
    // Whether the +link{typePicker} is shown. If not explicitly specified, the typePicker will
    // be shown if +link{validatorType} is not specified at initialization time.
    // @visibility devTools
    //<

    typePickerConstructor:"SelectItem",
    
    typePickerDefaults:{
        name:"type",
        width:"*",
        hoverWidth: 200,
        pickListProperties: {
            sortField: 0,
            canHover: true,
            showHover: true,
            hoverWidth: 200,
            cellHoverHTML : function (record) {
                return record.description ? record.description : null;
            }
        },
        init : function () {
            this._testDS = isc.DS.create({
                clientOnly: true,
                fields: [
                    { name: "type" },
                    { name: "shortName" },
                    { name: "description" }
                ],
                cacheData: this.creator.getSupportedTypeRecords()
            });
            this.optionDataSource = this._testDS;
            this.valueField = "type";
            this.displayField = "shortName";
            this.Super("init", arguments);
        },
        destroy : function () {
            if (this._typeDS) this._typeDS.destroy();
            this.Super("destroy", arguments);
        },
        showIf:function () {
            var validatorEditor = this.form.creator;
            return validatorEditor.showTypePicker == false ? false : true;
        },
        changed:function(form,item,value) {
            this.creator.updateValidatorType(value);
        },
        itemHoverHTML : function () {
            var record = this.getSelectedRecord();
            if (!record) return "";
            return record.description;
        }
    },
    
    // Records for the validator type form item.
    // The available validator types will vary depending on what the selected field is.
    getSupportedTypeRecords : function () {
        var fieldName = this.fieldName,
            types = this.availableTypes,
            supportedTypesRecords = [];
            
        // if we have no selected field/validators we won't show any options.        
        if (types.length == 0 || fieldName == null) {
            return [];
        }
        
        
        var rangeType = null,
            validRangeTypes = {date:true, "float":true, integer:true, time:true};
            
        for (var i = 0; i < types.length; i++) {
            var validator = this.getValidatorDefinition(types[i]) || {},
                showOption = true;
            
            if (validator.isRule) continue;
            
            // For fields, validators are valid depending on data type.
            var field = this.getField(fieldName);
            if (field == null) {
                this.logWarn("unable to retrieve field for:" + fieldName);
            } else {
                var fieldDataType = isc.SimpleType.getBaseType(field.type || "text");
                // Special-case range which maps to different validators depending on type
                if (types[i] == "range") {
                    if (!validRangeTypes[fieldDataType] ||
                            (rangeType != null && rangeType != fieldDataType)) 
                    {
                        showOption = false;
                    } else {
                        // rangeType allows us to support only field type being chosen
                        // for ranges since more than one would imply we're generating
                        // multiple validators of different types.
                        rangeType = fieldDataType;
                    }
                } else {
                    // dataType:"none" implies the validator doesn't care about the
                    // data-type of the target
                    if (validator.dataType != null && validator.dataType != "none" &&
                            validator.dataType != fieldDataType)
                    {
                        showOption = false;
                    }
                }
            }
            
            if (showOption) {
                var validatorDefinition = this.getValidatorDefinition(types[i]);
                var shortName = validatorDefinition.shortName || isc.Validator.getShortName(validatorDefinition.type);
                supportedTypesRecords.add({ type: types[i], shortName: shortName, description: validatorDefinition.description });
            }
        }
        return supportedTypesRecords;
    },

    // This method fired when the validator type changes.
    // Refreshes the valuesForm
    updateValidatorType : function (type, forceRebuild) {
        if (this.validatorType == type && !forceRebuild) return;
        this.validatorType = type;
        if (type != null) {
            var currentValuesForm = this.valuesForm,
                newValuesForm = this.getValuesForm(type);
            // Note that 'getValuesForm()' will actually update the valuesForm's valueItems
            
            if (currentValuesForm != newValuesForm) {
                this.valuesForm = newValuesForm;
                this.validatorForm.getItem("valuesItem").setCanvas(this.valuesForm);
                // (Don't destroy old validator form - we may want to reuse it
            }

            // Set title on value form based on validator type
            var validatorDefinition = this.getValidatorDefinition(type);
            var title = validatorDefinition.editorTitle || this.defaultEditorTitle;
            this.validatorForm.getItem("valuesItem").title = title;
            this.validatorForm.getItem("valuesItem").redraw();
        }
        // This'll actually hide the form if there's no selected validatorType
        this.updateValuesFormVisibility();
    },
    
    //> @attr validatorEditor.messageForm (AutoChild DynamicForm : null : IR)
    // Automatically generated form used to edit the +link{validator.errorMessage} attribute
    // when editing a validator.
    // @visibility devTools
    //<

    messageFormConstructor:"DynamicForm",
    messageFormDefaults:{
        numCols:2,
        width:"100%",
        height:20
    },
   
    //> @attr validatorEditor.errorMessageItem (TextItem AutoChild : {...} :IR)
    // Item for editing the +link{validator.errorMessage,errorMessage} of the validator being edited. Displayed
    // in the +link{validatorEditor.messageForm}. Implemented as an autoChild, so may be customized
    // via <code>errorMessageItemProperties</code>.
    // @visibility devTools
    //<
    errorMessageItemDefaults:{
        editorType:"TextItem",
        width:"*"
    },

    //> @attr validatorEditor.valuesForm (AutoChild FilterClause : null : IR)
    // Form used for editing the attributes of a validator.
    // @visibility devTools
    //<
    // This is a customized filterClause -- we use the class so it will derive the appropriate
    // form items to show based on available dataSource fields, field.type and validator.valueType 
    // but we make the following fundamental changes:
    // - suppress the "remove" icon
    // - suppress the "fieldPicker" field (shown directly in the ValidatorEditor instead)
    // - suppress the "operator" picker. The clause will be passed validator definition objects
    //   instead of criterion operator objects. We show an operator picker directly in the ValidatorEditor
    // - never call the standard 'getCriterion' method - we're building validators, not criteria.
    //   Instead we duplicate the relevant bits of this to extract the values from the value field(s)
    //   and for custom editors, call the special validator.getAttributesFromEditor() API
    valuesFormConstructor:"FilterClause",
    
    valuesFormDefaults:{
        clauseProperties: { cellPadding: 0, cellSpacing: 0 },

        // validatorAttribute / rangeStart/end attributes and getAttributesFromEditor may be
        // defined on the validator definitions.
        customGetValuesFunction:"getAttributesFromEditor",
        customSetValuesFunction:"setEditorAttributes",
        operatorAttribute:"type",
    
        // Don't show the field-picker item
        fieldPickerProperties:{
            showIf:"return false"
        },
        
        getEditorType : function (field, validatorType) {
            var validatorDefinition = this.creator.getValidatorDefinition(validatorType);
            if (validatorDefinition && validatorDefinition.valueType == "custom" && 
                validatorDefinition.editorType) 
            {
                return validatorDefinition.editorType;            
            }
            if (field && isc.SimpleType.inheritsFrom(field.type, "date")) return "RelativeDateItem";
            if (validatorType == "readOnly") {
                return "ReadOnlyRuleEditor";
            }
            // Return null - this'll back off to default behavior
            return null;
        }
        
    },
    
    // Helper to convert the "validatorType" understood by this widget
    // to the validatorType supported at the validator level.
    // This basically resolves "range" to "dateRange" / "integerRange" etc based
    // on field type.
    resolveValidatorType : function (type) {
    
        if (type == null) type = this.validatorType;
        if (type == null) return null;
        
        // special-case "range" - get the range for the field type
        if (type == "range") {
            var fieldName = this.fieldName,
                fieldType;
            if (fieldName != null) {
                var typeMismatch = false,
                    field = this.getField(fieldName),
                    
                    currentFieldType = field.type || "integer"
                ;

                // Resolve to base type (so a custom subtype of "integer" still uses
                // an integerRange, say)
                fieldType = isc.SimpleType.getBaseType(currentFieldType);
                    
                this.logDebug("'range' validator for field:"
                        + this.echo(this.fieldName) +
                        ". Assuming " + fieldType + " type data", "ValidatorEditor");
                
            // no field at all? Default to integer
            
            } else {
                this.logInfo("Attempting to get 'range' validator with no field type - defaulting to integer",
                    "ValidatorEditor");
                fieldType = "integer";
            }
                // IF we don't have a field, this is sorta invalid, but default to integerRange
             
            // All ranges:
            // integerRange
            // dateRange
            // timeRange
            // floatRange
            // - default to integerRange if its none of these!
            // ('lengthRange' is the only range that makes sense for strings, but it'd be
            // an odd behavior if the user picks just "range" on a string field).
            if (fieldType == "date" || fieldType == "datetime") {
                type = "dateRange";
            } else if (fieldType == "time") {
                type = "timeRange";
            } else if (fieldType == "float") {
                type = "floatRange"
            } else {
                type = "integerRange"
            }
        }
        return type;
    },
    
    // Helper to get a 'validatorDefinition' from a validatorType name
    getValidatorDefinition : function (type) {
        type = this.resolveValidatorType(type);
        return isc.Validator._validatorDefinitions[type];
    },
    
    
    getValuesForm : function (validatorType) {

        if (validatorType != null) {
            var validatorDefinition = this.getValidatorDefinition(validatorType),
                valueType = validatorDefinition.valueType;
            validatorDefinition.ID = validatorType;
        }
        
        var fieldName = this.fieldName;        
        
        if (this.valuesForm) {
            var field = fieldName ? this.valuesForm.getField(fieldName) : null;
            this.valuesForm.updateValueItems(field, validatorDefinition, fieldName);
            
            this.valuesForm.clause.setValue("operator", validatorType);
            
            return this.valuesForm;
        } else {
            
            var form = this.valuesForm = this.createAutoChild("valuesForm", {
                visibility:(this.fieldName ? "inherit" : "hidden"),
                showRemoveButton:false,
                // support multiple or singular dataSource
                dataSources:this.dataSources,
                dataSource:this.dataSource,
                fieldName:fieldName,
                operatorType:validatorType
            });
            
            // hide the operatorPicker in the clause - we have a separate item for this.
            
            var clauseForm = form.clause;
            clauseForm.getItem("operator").hide();
            // allow unknown values so we can set to 'validatorTypes' that aren't present in the
            // standard 'operators' valueMap
            
            clauseForm.getItem("operator").addUnknownValues = true;
            return form;
        }
    },
    
    // -----
    // End of UI
    // -----
    
    //> @method validatorEditor.setValidatorType()
    // Update the +link{validatorEditor.validatorType}
    // @param type (ValidatorType) validatorType
    // @visibility devTools
    //<
    setValidatorType : function (type) {
        this.validatorForm.setValue("type", type);
        this.updateValidatorType(type);
    },
        
    //> @method validatorEditor.setFieldName()
    // Sets the fieldName applied to the validator.
    // @param fieldName (String) the name of the field target in dataSource for validator 
    // @visibility devTools
    //<
    // For normal forms the validators are defined as an attribute on the field.
    // We need to know the fieldName in order to show the correct UI - assume the calling code
    // will set this at init time or runtime.
    setFieldName : function (fieldName) {
        if (this.fieldPicker) {
            this.fieldPicker.setValue(fieldName);
        }
        this.updateFieldName(fieldName);
    },

    //> @method validatorEditor.setApplyWhen()
    // Sets the +link{applyWhen} attribute for this validatorEditor.
    // @param applyWhen (AdvancedCriteria) criteria indicating when the validator should be applied.
    // @visibility devTools
    //<
    setApplyWhen : function (criteria) {
        this.applyWhen = criteria;
        this.applyWhenForm.setValue("applyWhen", (this.applyWhen != null));
        this.updateConditionalForm(criteria != null);
    },
    
    getApplyWhen : function () {
        if (this.applyWhenForm.getValue("applyWhen")) {
            this.applyWhen = this.conditionalForm.getCriteria();
        } else {
            this.applyWhen = null;
        }
        return this.applyWhen;
    },

    // attributes from the 'valuesForm'.
    // Typically this is just the single value/fieldName, but may include other fields
    // depending on the valueType / editorType etc of the validator.
    
    getAttributesFromClause : function () {
        var baseDef = this.getValidatorDefinition(),
            validatorAttributes = this.valuesForm.getClauseValues(null, baseDef)
        ;
        return validatorAttributes;
    },
    
    setClauseAttributes : function (attributes) {
        if (this.valuesForm == null) return;
        // update the "value" field[s] of the clause form
        // That's typically "value" or "start"/"end" but might call custom setter for some
        // validator types.
        // Note that this sill not update validatorType/fieldName -- that should already have
        // been handled via setValidator() if necessary.
        var baseDef = this.getValidatorDefinition();

        this.valuesForm.setClauseValues(this.fieldName, baseDef, attributes);
    },
    
    //> @method validatorEditor.getValidator()
    // Get the validator. Will return null if +link{validatorType} is not set.
    // @return (Validator) edited validator object
    // @visibility devTools
    //<
    getValidator : function () {
        if (this.validatorType == null) return null;
        var validator = {};
        // resolveValidatorType will convert "range" to "dateRange" (etc) based on field type.
        validator.type = this.resolveValidatorType(this.validatorType);
        
        // attributes from the filterClause form
        if (this.valuesForm != null) {
            var validatorAttributes = this.getAttributesFromClause();
            for (var attr in validatorAttributes) {
                // Don't clobber the "type" - we already resolved that to a meaningful 
                // validatorType
                if (attr == "type") continue;
                
                validator[attr] = validatorAttributes[attr];
            }
        }
        
        var errorMessage = this.messageForm.getValue("errorMessage");
        if (errorMessage) validator.errorMessage = errorMessage;

        // applyWhen criteria for the validator        
        var applyWhen = this.getApplyWhen();
        if (applyWhen != null) validator.applyWhen = applyWhen;

        return validator;
    },
    
    //> @method validatorEditor.validate()
    // Validate the current set of values for the validator.
    // @return (boolean) true if validation passed for all component forms, false otherwise.
    // @visibility devTools
    //<
    
    validate : function () {
        var failed = false;
        if (this.applyWhenForm && this.applyWhenForm.getValue("applyWhen")) {
            failed = (this.conditionalForm.validate() == false) || failed;
        }
        if (this.validatorForm) {
            failed = (this.validatorForm.validate() == false) || failed;
            if (this.valuesForm) failed = (this.valuesForm.validate() == false) || failed;
        }
        if (this.messageForm) failed = (this.messageForm.validate() == false) || failed;
        return !failed;
    },
    
    //> @method validatorEditor.setValidator()
    // Show the specified validator in this validatorEditor
    // @param validator (Validator) Validator to edit.
    // @visibility devTools
    //<
    // initTime param used internally
    setValidator : function (validator, initTime) {
        
        this.validator = validator;

        if (initTime) {
            this.validatorType = validator.type;
            this.applyWhen = validator.applyWhen;
            // errorMessage is applied lazily to the messageForm when its initialized.
        } else {
            this.setValidatorType(validator.type);
            this.setApplyWhen(validator.applyWhen);
            this.messageForm.setValue("errorMessage", validator.errorMessage);

            this.setClauseAttributes(validator);
        }
    },
    
    //> @method validatorEditor.clearValidator()
    // Clear the validatorEditor's values (dropping the current validator entirely).
    // @visibility devTools
    //<
    clearValidator : function () {
        this.validator = null;
        this.setValidatorType(null);
        this.setApplyWhen(null);
        if (this.messageForm) this.messageForm.clearValue("errorMessage");
    }
    
});


//> @class ValidatorsEditor
// A user-interface component for creation and editing a list of +link{Validator,Validators}.
// @treeLocation Client Reference/Data Binding
// @visibility devTools
//<
isc.defineClass("ValidatorsEditor", "VLayout").addProperties({

    //> @attr validatorsEditor.fieldName (FieldName : null : IR)
    // Specifies the name of the DataSource field whose validators are being edited.
    //
    // @visibility devTools
    //<

    //> @attr validatorsEditor.dataSource (DataSource : null : IR)
    // Specifies the dataSource containing the +link{validatorsEditor.fieldName} target.
    //
    // @visibility devTools
    //<

    //> @attr validatorsEditor.validators (Array of Validator : null : IR)
    // Specifies the list of existing validators for the field.
    //
    // @visibility devTools
    //<

    mainLayoutDefaults: {
        _constructor: isc.SectionStack,
        height: "100%",
        visibilityMode: "multiple",
        overflow: "auto",
        // Validator order matters - so allow user to adjust them
        canReorderSections: true,
        membersChanged : function () {
            // Keep add button showing on the last validator after reordering
            this.creator.updateSectionControls();
        }
    },

    addButtonDefaults: {
        _constructor: isc.ImgButton,
        src:"[SKIN]actions/add.png", size:16,
        showFocused:false, showRollOver:false, showDown:false,
        click : "this.creator.addValidator();return false;"
    },

    removeButtonDefaults: {
        _constructor: isc.ImgButton,
        src:"[SKIN]actions/remove.png", size:16,
        showFocused:false, showRollOver:false, showDown:false,
        click : "this.creator.removeValidator(this.validatorDetail);return false;"
    },

    validatorDetailDefaults: {
        _constructor: isc.ValidatorEditor,
        height: 50, // Minimum height

        saveOperationType: "add",
        getSaveOperationType : function () {
            return this.saveOperationType;
        },
        
        setSaveOperationType : function (operationType) {
            this.saveOperationType = operationType;
        },
        
        clearValidator : function () {
            this.setSaveOperationType("add");
            this.Super("clearValidator", arguments);
        },
        
        setValidator : function (validator) {
            this.setSaveOperationType("update");
            this.Super("setValidator", arguments);
        }
    },

    initWidget : function () {
        this.Super("initWidget", arguments);

        if (this.fieldName.contains(".")) {
            var parts = this.fieldName.split(".");
            this.fieldName = parts[parts.length-1];
        }

        this.addAutoChild("mainLayout");

        if (this.validators) this.setValidators(this.validators.duplicate());
        // Add empty validator
        this.addValidator();
    },

    moveSection : function (sections, position) {
        this.Super("moveSection", arguments);
        this.updateSectionControls();
    },

    updateSectionControls : function () {
        // A single field will not have many validators so
        // checking each section on change is not a big deal
        var sections = this.mainLayout.getSections();
        for (var i = 0; i < sections.length; i++) {
            var sectionHeader = this.mainLayout.getSectionHeader(sections[i]),
                buttonLayout = sectionHeader.controls[0],
                addButton = buttonLayout.getMember(0)
            ;
            if (i == sections.length-1) {
                // Last section
                addButton.show();
            } else {
                // Not last section 
                addButton.hide();
            }
        }
    },

    addValidator : function (validator) {
        var title = "[New Validator]";
        if (validator) title = validator.shortName || isc.Validator.getShortName(validator.type);

        var validatorDetailProperties = {
            fieldName: this.fieldName,
            dataSource: this.dataSource,
            validator: validator
        }
        var detail = this.createAutoChild("validatorDetail", validatorDetailProperties);
        var addButton = this.createAutoChild("addButton");
        var removeButton = this.createAutoChild("removeButton", { validatorDetail: detail });
        
        var buttonLayout = isc.HLayout.create({
            height: 16,
            width: 16,
            align: "right",
            members: [ addButton, removeButton ]
        });

        // Generated, type validators are not to be shown but must be returned
        // as-is in the edited validator list. To do this a hidden section is
        // used to maintain the correct placement. The raw validator is also
        // attached to the section so it can be pulled instead of the edited
        // version which will not include the hidden properties.
        var isGeneratedTypeValidator = (validator && validator._generated && validator._typeValidator);

        this.mainLayout.addSection({
            title: title,
            items: [ detail ],
            expanded: !validator,
            hidden: isGeneratedTypeValidator,
            validator: validator,
            controls: [ buttonLayout ]
        });

        this.updateSectionControls();
    },

    removeValidator : function (validatorDetail) {
        var section = this.mainLayout.sectionForItem(validatorDetail),
            sectionHeader = this.mainLayout.getSectionHeader(section),
            hadAddButton = (sectionHeader.controls[0].getMembers().length > 1)
        ;
        this.removeValidatorInSection(section.name);

        // Always keep at least one validator in stack 
        var sections = this.mainLayout.getSections();
        if (sections.length == 0) {
            this.addValidator();
        }
        this.updateSectionControls();
    },

    removeValidatorInSection : function (section) {
        
        var mainLayout = this.mainLayout;
        this.mainLayout.collapseSection(section, function () {
            mainLayout.removeSection(section);
        });
    },

    //> @method validatorsEditor.validate()
    // Validate the current set of validators. Entries without a validator type selected
    // are ignored.
    // @return (boolean) true if validation passed for all validator forms, false otherwise.
    // @visibility devTools
    //<
    validate : function () {
        var failed = false,
            sections = this.mainLayout.getSections()
        ;
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i],
                header = this.mainLayout.getSectionHeader(section),
                validatorDetail = header.items[0]
            ;
            failed = (validatorDetail.validate() == false) || failed;
        }
        return !failed;
    },

    //> @method validatorsEditor.getValidators()
    // Get the list of entered validators. Entries without a selected
    // type will be skipped.
    // @return (Array of Validator) list of edited validator objects
    // @visibility devTools
    //<
    getValidators : function () {
        var sections = this.mainLayout.getSections(),
            validators = []
        ;
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i],
                header = this.mainLayout.getSectionHeader(section),
                validatorDetail = header.items[0],
                validator = validatorDetail.getValidator()
            ;
            // Pull hidden, raw validator if not edited
            if (header.hidden) validator = header.validator;

            if (validator) validators.add(validator);
        }
        return validators;
    },

    //> @method validatorsEditor.setValidators()
    // Show the specified validators in this validatorsEditor.
    // @param validators (Array of Validator) list of validators to edit.
    // @visibility devTools
    //<
    setValidators : function (validators) {
        this.validators = validators;

        var editor = this;
        var createSections = function (validators) {
            for (var i = 0; i < validators.length; i++) {
                editor.addValidator(validators[i]);
            }
        };

        var sections = this.mainLayout.getSections();
        if (sections && sections.length > 0) {
            this.mainLayout.collapseSection(sections, function () {
                this.mainLayout.removeSection(sections);
                createSections(validators);
            });
        } else {
            createSections(validators);
        }
    }

});



if (isc.DynamicForm) {


// Custom form item types for editing built-in validator definition objects
// These are referred to via the "validator.editorType" attribute 


isc.defineClass("SubstringCountEditor", "CanvasItem").addProperties({

    // i18n properties
    countFieldHint:"Times",
    operatorFieldTitle:"Operator",

    canvasConstructor:"DynamicForm",
    canvasDefaults:{
        numCols:3
    },
    
    substringFieldDefaults:{
        name:"substring",
        showTitle:false, type:"text", colSpan:"*", width:"*", required:true
    },
    countFieldDefaults:{
        name:"count", showTitle:false, showHintInField:true, 
        width:50, type:"integer", required:true
    },
    operatorFieldDefaults:{
        name:"operator", editorType:"SelectItem",
        width:50,
        defaultValue:"==", allowEmptyValue:false,
        valueMap:["==", "!=", "<", "<=", ">", ">=" ]
    },
    createCanvas : function (form,item) {
        
        var substringField = isc.addProperties({}, 
                this.substringFieldDefaults, this.substringFieldProperties),
            countField = isc.addProperties({},
                this.countFieldDefaults, this.countFieldProperties, { hint:this.countFieldHint }),
            operatorField = isc.addProperties({},
                this.operatorFieldDefaults, this.operatorFieldProperties, { title:this.operatorFieldTitle });
        
        return this.canvas = this.createAutoChild(
            "canvas", 
            { items:[
                    substringField,
                    operatorField,
                    countField
                ]
            }
        );
    }
});

isc.defineClass("FloatRangeEditor", "CanvasItem").addProperties({
    
    // i18n properties
    minFieldHint:"Min",
    maxFieldHint:"Max",
    exclusiveFieldTitle:"Exclusive",
    exclusiveFieldPrompt:"Range is exclusive (does not include min/max values)",

    canvasConstructor:"DynamicForm",
    canvasDefaults:{
        numCols:2
    },
    minFieldDefaults:{
        name:"min",
        showTitle:false, type:"float",
        showHintInField:true
    },
    maxFieldDefaults:{
        name:"max", 
        showTitle:false, type:"float",
        showHintInField:true
    },
    exclusiveFieldDefaults:{
        name:"exclusive", 
        colSpan:"*",
        type:"boolean",
        editorType:"CheckboxItem", defaultValue:false
    },
    createCanvas : function (form,item) {
        
        var minField = isc.addProperties({}, 
                 this.minFieldDefaults, this.minFieldProperties, { hint:this.minFieldHint }),
            maxField = isc.addProperties({},
                this.maxFieldDefaults, this.maxFieldProperties, { hint:this.maxFieldHint }),
            exclusiveField = isc.addProperties({},
                this.exclusiveFieldDefaults, this.exclusiveFieldProperties, {
                    title:this.exclusiveFieldTitle,
                    prompt:this.exclusiveFieldPrompt
                }
            );
        
        return this.canvas = this.createAutoChild(
            "canvas", 
            { items:[
                    minField,
                    maxField,
                    exclusiveField
                ]
            }
        );
    }
});

isc.defineClass("FloatPrecisionEditor", "CanvasItem").addProperties({
    
    // i18n properties
    precisionFieldHint:"Precision",
    roundFieldTitle:"Round to precision",

    canvasConstructor:"DynamicForm",
    canvasDefaults:{
        numCols:1
    },
    
    precisionFieldDefaults:{
        name:"precision",
        showTitle:false, type:"float",
        showHintInField:true,
        required:true
    },
    roundFieldDefaults:{
        showTitle:false,
        name:"roundToPrecision", 
        type:"boolean",
        editorType:"CheckboxItem", defaultValue:false
    },
    createCanvas : function (form,item) {
        
        var precisionField = isc.addProperties({}, 
                this.precisionFieldDefaults, this.precisionFieldProperties, { hint:this.precisionFieldHint }),
            roundField = isc.addProperties({},
                this.roundFieldDefaults, this.roundFieldProperties, { title:this.roundFieldTitle });
        
        return this.canvas = this.createAutoChild(
            "canvas", 
            { items:[
                    precisionField, roundField
                ]
            }
        );
    }
});

isc.defineClass("MaskRuleEditor", "CanvasItem").addProperties({
    
    // i18n properties
    maskFieldHint:"mask",
    transformFieldHint:"transformTo",

    // Needs 2 strings - mask (a regex), and transformTo
    canvasConstructor:"DynamicForm",
    canvasDefaults:{
        numCols:1
    },
    
    maskFieldDefaults:{
        name:"mask", editorType:"TextItem",
        showTitle:false,
        showHintInField:true
    },
    transformFieldDefaults:{
        name:"transformTo", editorType:"TextItem",
        showTitle:false,
        showHintInField:true
    },
    createCanvas : function (form,item) {
        
        var maskField = isc.addProperties({}, 
                this.maskFieldDefaults, this.maskFieldProperties, { hint:this.maskFieldHint }),
            transformField = isc.addProperties({},
                this.transformFieldDefaults, this.transformFieldProperties, { hint:this.transformFieldHint });
        
        return this.canvas = this.createAutoChild(
            "canvas", 
            { items:[
                    maskField, transformField
                ]
            }
        );
    }    
});

}   // End of check for DynamicForm being defined
