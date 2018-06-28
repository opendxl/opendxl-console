
isc.ListGrid.create({
    ID:"worldList",
    dataSource:supplyItemJPAAutoDerive,
    width:700,
    height:224,
    showFilterEditor:true,
    alternateRecordStyles:true,
    autoFetchData:true,
    dataPageSize: 50,
    canEdit:true,
    editEvent:"click",
    canRemoveRecords:true
});

isc.Button.create({
    ID: "newButton",
    top: 230,
    title: "Add New",
    click: "worldList.startEditingNew();"
});
