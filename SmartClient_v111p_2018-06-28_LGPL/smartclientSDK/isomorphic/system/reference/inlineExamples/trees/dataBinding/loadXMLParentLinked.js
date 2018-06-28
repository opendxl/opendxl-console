isc.DataSource.create({
    ID:"employees",
    dataURL:"[ISOMORPHIC]/system/reference/inlineExamples/trees/dataBinding/employeesDataParentLinked.xml",
    recordXPath:"/Employees/employee",
    fields:[
        {name:"Name"},
        {name:"Job"},
        {name:"EmployeeId", primaryKey:true, type:"integer", title:"Employee ID"},
        {name:"ReportsTo", foreignKey:"employees.EmployeeId", type:"integer", title:"Manager"}
    ]
});


isc.TreeGrid.create({
    ID: "employeeTree",
    dataSource: "employees",
    autoFetchData: true,
    loadDataOnDemand: false,

    // customized appearance
    width: 500,
    height: 400,
    nodeIcon:"icons/16/person.png",
    folderIcon:"icons/16/person.png",
    showOpenIcons:false,
    showDropIcons:false,
    showSelectedIcons:true,
    closedIconSuffix:""
});
