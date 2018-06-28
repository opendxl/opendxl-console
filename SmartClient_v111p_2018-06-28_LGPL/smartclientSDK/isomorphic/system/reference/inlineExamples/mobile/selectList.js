isc.DynamicForm.create({
    ID:"testForm",
    width: 500,
    fields : [
    {
        name: "filteredSelect", title: "Select Item", editorType: "SelectItem", 
        optionDataSource: "supplyItem", 
        displayField:"itemName", valueField:"SKU",
        pickListPlacement: "fillScreen",
        pickListWidth:300,
        pickListProperties: {
            showFilterEditor:true
        },
        pickListFields:[
            {name:"SKU"},
            {name:"itemName"}
        ]
    }
    ]
});
