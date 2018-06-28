isc.DynamicForm.create({
    ID:"testForm",
    width: 500,
    fields : [
    {
        name: "filteredCombo", title: "Select Item", editorType: "ComboBoxItem", 
        addUnknownValues:false,
        optionDataSource: "supplyItem", 
        displayField:"itemName", valueField:"SKU",
        filterFields:["SKU", "itemName"],
        pickListPlacement: "fillScreen",
        pickListWidth:300,
        pickListFields:[
            {name:"SKU"},
            {name:"itemName"}
        ]
    }
    ]
});


