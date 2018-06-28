isc.TreeGrid.create({
    ID: "employeeTree",
    width: 500,
    height: 250,
    dataSource: "employees",
    autoFetchData: true,
    canEdit: true,
    canReorderRecords: true,
    canAcceptDroppedRecords: true,
    nodeIcon: "icons/16/person.png",
    folderIcon: "icons/16/person.png",
    showOpenIcons: false,
    showDropIcons: false,
    showSelectedIcons:true,
    closedIconSuffix: "",
    fields: [
        {name: "Name"},
        {name: "Job"},
        {name: "Salary", formatCellValue: "isc.NumberUtil.format(value, '\u00A4,0.00')"}
    ]
});

isc.SearchForm.create({
    ID: "employeeSearchForm",
    width: 200,
    height: 30,
    fields:[
        {editorType: "pickTree", showTitle: false, canSelectParentItems: true,
         dataSource: "employees", displayField: "Name", valueField: "EmployeeId",
         change: "employeeGrid.fetchData({ReportsTo: value})"}
    ]
});

isc.ListGrid.create({
    ID: "employeeGrid",
    width: 500,
    height: 250,
    dataSource: "employees",
    canEdit: true,
    fields: [
        {name: "Name"},
        {name: "Job"},
        {name: "Salary", formatCellValue: "isc.NumberUtil.format(value, '\u00A4,0.00')"}
    ]
});

isc.VStack.create({
    membersMargin: 5,
    members: [employeeTree, isc.LayoutSpacer.create({height:10}), employeeSearchForm, employeeGrid]
});