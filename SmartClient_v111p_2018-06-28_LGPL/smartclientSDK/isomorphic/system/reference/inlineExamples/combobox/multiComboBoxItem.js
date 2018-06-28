var initialLayoutStyle = "flow",
    initialAddUnknownValues = false;

var configureForm = isc.DynamicForm.create({
    isGroup: true,
    groupTitle: "Configure Multi ComboBox",
    width: "100%",
    padding: 3,
    titleOrientation: "top",
    items: [{
        title: "Change layout style",
        type: "select",
        colSpan: 2,
        defaultValue: initialLayoutStyle,
        valueMap: ["flow", "flowReverse", "horizontal", "horizontalReverse", "vertical", "verticalReverse"],
        changed : function (form, item, value) {
            suppliesForm.getField("supplies").setLayoutStyle(value);
        }
    }, {
        title: "Allow New Values",
        type: "boolean",
        value: initialAddUnknownValues,
        changed : function (form, item, value) {
            suppliesForm.getField("supplies").setAddUnknownValues(value);
        }
    }]
});

var suppliesForm = isc.DynamicForm.create({
    ID: "selectedSupplyItems",
    width: "100%",
    numCols: 1,
    titleOrientation: "top",
    items: [{
        name: "supplies",
        title: "Items",
        editorType: "MultiComboBoxItem",
        comboBoxProperties: {
            pickListWidth: 290
        },
        optionDataSource: "supplyItem",
        displayField: "itemName",
        valueField: "SKU",
        value: ["58074604", "90600", "1089400", "6024900"],
        autoFetchData: true,
        layoutStyle: initialLayoutStyle,
        addUnknownValues: initialAddUnknownValues
    }]
});

isc.VLayout.create({
    width: "100%",
    members: [configureForm, selectedSupplyItems]
})
