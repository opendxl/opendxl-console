isc.DynamicForm.create({
//    ID:"testForm",
    width: 500,
    wrapItemTitles: false,
    fields : [
    {
        name: "filteredSelect", title: "Choose an item (Select)", editorType: "SelectItem", 
        optionDataSource: "supplyItem", 
        displayField:"itemName", valueField:"itemID",
        pickListWidth:300,
        pickListProperties: {
            showFilterEditor:true
        },
        pickListFields:[
            {name:"SKU"},
            {name:"itemName"}
        ],
        specialValues: { "**emptyValue**": "None", "-1": "Not Applicable" },
        separateSpecialValues: true
    },
    {
        name: "filteredCombo", title: "Choose an item (ComboBox)", editorType: "ComboBoxItem", 
        addUnknownValues:false,
        optionDataSource: "supplyItem", 
        displayField:"itemName", valueField:"itemID",
        filterFields:["SKU", "itemName"],
        pickListWidth:300,
        pickListFields:[
            {name:"SKU"},
            {name:"itemName"}
        ],
        specialValues: { "**emptyValue**": "None", "-1": "Not Applicable" },
        separateSpecialValues: true
    },
    {
        name: "multipleSelect", title: "Select all items", editorType: "SelectItem", 
        optionDataSource: "supplyItem",
        optionCriteria: {units:"Ream"},
        displayField:"SKU", valueField:"itemID",
        pickListWidth:400,
        pickListFields:[
            {name:"SKU"},
            {name:"itemName"}
        ],
        multiple: true,
        specialValues: { "**emptyValue**": "Select None", "**selectAllValues**": "Select All" },
        separateSpecialValues: true
    }
    ]
});


