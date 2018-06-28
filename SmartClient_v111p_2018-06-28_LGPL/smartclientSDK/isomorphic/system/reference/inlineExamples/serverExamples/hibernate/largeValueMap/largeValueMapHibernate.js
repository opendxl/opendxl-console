isc.ListGrid.create({
    ID: "orderItemList",
    width:700, height:224, alternateRecordStyles:true, 
    dataSource: largeValueMap_orderItemHB,
    fields:[
        {name: "orderID"},
        {name: "item", title: "Item Name", displayField: "itemName", width: "50%"},
        {name: "quantity"},
        {name: "unitPrice"}
    ],
    autoFetchData: true
});
