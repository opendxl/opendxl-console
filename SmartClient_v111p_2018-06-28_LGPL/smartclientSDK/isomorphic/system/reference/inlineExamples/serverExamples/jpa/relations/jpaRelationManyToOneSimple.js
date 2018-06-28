
isc.ListGrid.create({
    ID:"cityList",
    dataSource:cityManyToOneSimpleJPA,
    width:700,
    height:224,
    showFilterEditor:true,
    alternateRecordStyles:true,
    autoFetchData:true,
    dataPageSize: 50,
    canEdit:true,
    editEvent:"click",
    canRemoveRecords:true,
    fields: [
        { name: "cityName"},
        { name: "country" }
    ]
});

isc.Button.create({
    ID: "newButton",
    top: 230,
    title: "Add New",
    click: "cityList.startEditingNew();"
});
