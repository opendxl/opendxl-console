isc.TreeGrid.create({
    ID: "employeeTree",
    width: 500,
    height: 400,
    dataSource: "employees",

    canDragRecordsOut:true,
    canAcceptDroppedRecords:true,

    autoFetchData: true
});
