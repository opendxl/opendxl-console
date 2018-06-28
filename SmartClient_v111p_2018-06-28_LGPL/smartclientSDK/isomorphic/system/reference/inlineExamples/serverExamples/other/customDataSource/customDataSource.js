isc.ListGrid.create({
    ID: "userList",
    width: 600,
    height: 224,
    dataSource: customDataSource_user,
    canEdit: true,
    canRemoveRecords: true,
    leaveScrollbarGap: false,
    dataFetchMode: "local",
    autoFetchData: true,
    fields: [
        { name: "userName" },
        { name: "job" },
        { name: "email" },
        { name: "employeeType" },
        { name: "salary" }
    ]
    
});

isc.IButton.create({
    ID: "addButton",
    width: 110, top: 240,
    title: "Create User",
    click: "userList.startEditingNew();"
});
