isc.TreeGrid.create({
    ID: "employeeTree",
    width: 500,
    height: 400,
    canReorderRecords: true,
    canAcceptDroppedRecords: true,
    nodeIcon:"icons/16/person.png",
    folderIcon:"icons/16/person.png",
    showOpenIcons:false,
    dropIconSuffix:"into",
    closedIconSuffix:"",
    showSelectedIcons:true,
    data: isc.Tree.create({
        modelType: "parent",
        rootValue: "1",
        nameProperty: "Name",
        idField: "EmployeeId",
        parentIdField: "ReportsTo",
        openProperty: "isOpen",
        data: employeeData
    }),
    fields: [
        {name: "Name", formatCellValue: "record.Job+':&nbsp;'+value"}
    ]
});

