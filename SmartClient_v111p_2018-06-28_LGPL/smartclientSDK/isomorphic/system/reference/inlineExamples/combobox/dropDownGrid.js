isc.DynamicForm.create({
    ID:"exampleForm",
    width:300,
    fields: [
        {
            name:"itemID",
            type:"select",
            width:240,
            title:"Item",
            optionDataSource:"supplyItem",
            valueField:"SKU",
            displayField:"itemName",
            pickListWidth:450,
            pickListFields: [
                { name: "itemName" },
                { name: "units" },
                { name: "unitCost" }
            ]
        }
    ]
});