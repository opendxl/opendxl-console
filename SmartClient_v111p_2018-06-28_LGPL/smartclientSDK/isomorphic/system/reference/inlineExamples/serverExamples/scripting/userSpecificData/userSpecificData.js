isc.ListGrid.create({
    ID: "supplyItemList",
    width:300, height:224, alternateRecordStyles:true, 
    dataSource: supplyItem,
    fields:[
        {name: "itemID"},
        {name: "itemName", width: "75%"}
    ],
    autoFetchData: true,
    showFilterEditor: true,
    canDragRecordsOut: true,
    dragDataAction: "copy"
});

isc.ListGrid.create({
    ID: "cartItemList",
    width:400, left: 320, height:224, alternateRecordStyles:true, 
    dataSource: scripting_cartItem,
    fields:[
        {name: "itemID", canEdit: false},
        {name: "itemName", width: "50%", canEdit: false},
        {name: "quantity", defaultValue: 1}
    ],
    autoFetchData: true,
    showFilterEditor: true,
    canAcceptDroppedRecords: true,
    canRemoveRecords: true,
    canEdit: true,
    dropValues: {quantity: 1}
});
