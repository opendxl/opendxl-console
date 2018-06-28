isc.DataSource.create({
    ID:"employees",
    dataURL:"[ISOMORPHIC]/system/reference/inlineExamples/trees/dataBinding/employeesDataChildrenArrays.xml",
    recordXPath:"/Employees/employee",
    fields:[
        {name:"Name"},
        {name:"Job"},
        {name:"directReports", childrenProperty:true}
    ]
});


isc.TreeGrid.create({
    ID: "employeeTree",
    dataSource: "employees",
    autoFetchData: true,

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
