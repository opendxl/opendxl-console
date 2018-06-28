isc.TreeGrid.create({
    ID: "employeeTree",
    width: 500,
    height: 400,
    dataSource: "employees",
    autoFetchData: true,
    nodeIcon:"icons/16/person.png",
    folderIcon:"icons/16/person.png",
    showOpenIcons:false,
    showDropIcons:false,
    closedIconSuffix:"",
    showSelectedIcons:true,
    fields: [
        {name: "Name"},
        {name: "Job"},
        {name: "Salary", formatCellValue: "isc.NumberUtil.format(value, '\u00A4,0.00')"}
    ]
});


