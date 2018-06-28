isc.DynamicForm.create({
    ID:"testForm",
    width: 550,
    numCols:4,
    fields : [
    {
        name: "filteredSelect", title: "Item (Select)", editorType: "SelectItem", 
        optionDataSource: "supplyItem", wrapTitle: false,
        displayField:"itemName", valueField:"SKU",
        pickListWidth:300,
        pickListProperties: {
            showFilterEditor:true
        },
        pickListFields:[
            {name:"SKU"},
            {name:"itemName"}
        ]
    },
    {
        name: "filteredCombo", title: "Item (ComboBox)", editorType: "ComboBoxItem", 
        addUnknownValues:false, wrapTitle: false,
        optionDataSource: "supplyItem", 
        displayField:"itemName", valueField:"SKU",
        filterFields:["SKU", "itemName"],
        pickListWidth:300,
        pickListFields:[
            {name:"SKU"},
            {name:"itemName"}
        ]
    }
    ]
});


