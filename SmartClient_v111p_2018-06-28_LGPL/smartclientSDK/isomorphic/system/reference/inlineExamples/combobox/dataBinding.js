isc.DynamicForm.create({
    width: 500,
    numCols: 4,
    isGroup: true,
    groupTitle: "List - ComboBox",
    wrapItemTitles: false,
    fields : [{
        name: "bugStatus", title: "Bug Status", 
        editorType: "ComboBoxItem",
        valueMap : {
            "new" : "New",
            "active" : "Active",
            "revisit" : "Revisit",
            "fixed" : "Fixed",
            "delivered" : "Delivered",
            "resolved" : "Resolved",
            "reopened" : "Reopened"
        }
    },{
        name: "itemName", title: "Item Name", editorType: "ComboBoxItem", 
        optionDataSource: "supplyItem", pickListWidth: 250
    }]
});
