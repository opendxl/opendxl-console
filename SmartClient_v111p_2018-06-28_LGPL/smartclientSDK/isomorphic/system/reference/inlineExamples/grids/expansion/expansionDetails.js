isc.ListGrid.create({
    ID: "itemList",
    width:500, height:300, 
    alternateRecordStyles:true,
    expansionFieldImageShowSelected:true,
    dataSource: supplyItem,
    autoFetchData: true,
    fields: [
        { name: "itemName" },
        { name: "SKU" }
    ],
    canExpandRecords: true,
    expansionMode: "details"
});
