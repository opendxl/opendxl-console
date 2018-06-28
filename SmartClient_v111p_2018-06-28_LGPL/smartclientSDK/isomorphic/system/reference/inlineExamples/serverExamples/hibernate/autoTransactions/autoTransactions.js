isc.ListGrid.create({
    ID: "allSupplyItemsList",
    width: 300,
    height: 224,
    canDragRecordsOut: true,
    dragDataAction: "move",
    dataSource: supplyItemHB,
    autoFetchData: true,
    fields: [
        {name:"itemName"},
        {name:"SKU"}, 
        {name:"category"}
    ]
});

isc.ListGrid.create({
    ID: "sundriesSupplyItemsList",
    width: 300,
    height: 224,
    left: 320,
    canAcceptDroppedRecords: true,
    dataSource: supplyItemHB,
    fields: [
        {name:"itemName"},
        {name:"SKU"}, 
        {name:"category"}
    ]
});

sundriesSupplyItemsList.fetchData({category: "Office Machine Sundries"});
