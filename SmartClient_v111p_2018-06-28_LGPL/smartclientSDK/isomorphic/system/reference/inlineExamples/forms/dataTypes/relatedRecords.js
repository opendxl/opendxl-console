isc.DynamicForm.create({
    ID: "form1",
    fields: [
        { type:"header", defaultValue:"Order Supply Items"},
        { name: "itemID", title:"Item", type:"select",
          optionDataSource:"supplyItem", defaultToFirstOption:true,
          displayField:"itemName", 
          change:"label1.setContents('Selected itemID:' + value)"},
        { name:"Quantity", editorType:"SpinnerItem", defaultValue:1, min:1}
    ]
});

isc.Label.create({
    align:"center",
    border:"1px solid blue",
    height:50, width:250, margin:10,
    ID:"label1",
    contents:"Select an item to order"
})

isc.VStack.create({
    ID:"vStack1",
    membersMargin: 5,
    members: [form1, label1]
});

// -------------------------------------------------------------------------------------------
// Variation with multi column picker:


isc.DynamicForm.create({
    ID:"form2",
    fields: [
        { type:"header", defaultValue:"Order Supply Items"},
        { name: "itemSKU", title:"Item", type:"select",
          optionDataSource:"supplyItem",
          valueField:"SKU", displayField:"itemName",
          change:"label2.setContents('Selected SKU:' + value)",
          pickListWidth:300,
          pickListFields: [
              { name:"itemName", width:125 },
              { name:"units" },
              { name:"unitCost" }
          ]
        },
        { name:"Quantity", editorType:"SpinnerItem", defaultValue:1, min:1}
    ]
});

isc.Label.create({
    align:"center",
    border:"1px solid blue",
    height:50, width:250, margin:10,
    ID:"label2",
    contents:"Select an item to order"
});

isc.VStack.create({
    ID:"vStack2",
    membersMargin: 5,
    members: [form2, label2]
});

isc.HStack.create({
    members: [vStack1, isc.LayoutSpacer.create({width:50}), vStack2]
});