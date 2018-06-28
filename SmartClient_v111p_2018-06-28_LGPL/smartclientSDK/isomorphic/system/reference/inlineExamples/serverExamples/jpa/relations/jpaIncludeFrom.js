
isc.ListGrid.create({
    ID:"cityList",
    dataSource:cityIncludeFromJPA,
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
        { name: "country" },
        { name: "continentName" }
    ]
});


