isc.DynamicForm.create({
    ID:"header",
    width:500,
    fields: [
        { name:"markup", title:"Markup percent", wrapTitle:false, type:"float", format:"0.0#%", defaultValue: 0.10 }
    ]
});

isc.ListGrid.create({
    ID: "itemList",
    top: 50,
    width:600, height:525,
    alternateRecordStyles:true,
    autoFetchData:true,
    dataSource:itemLocalDS,
    canEdit:true, editEvent:"click",
    showAllRecords:true,

    fields: [
        {name: "orderID", includeInRecordSummary: false}, 
        {name: "itemDescription"}, 
        {name: "category"}, 
        {name: "shipDate"},
        {name: "quantity"}, 
        {name: "unitCost", type:"float", title: "Cost" },
        {name: "unitPrice", format:"\u00A4,0.00", editorFormula: { text: "unitCost+unitCost*header.values.markup"} }
    ]
});
