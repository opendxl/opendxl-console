isc.TreeGrid.create({
    ID: "employeeTree",
    width:550, height:224,
    dataSource: employees,
    autoFetchData:true,
    canEdit: true,
    canFreezeFields:true,
    canReparentNodes:true,
    fields:[
        {name:"Name", frozen:true, width:150},
        
        {name:"Job", width:150},
        {name:"EmployeeType", width:150},
        {name:"EmployeeStatus", width:150},
        {name:"Salary", width:80},
        {name:"Gender", width:80},
        {name:"MaritalStatus", width:100}
    ]
});
