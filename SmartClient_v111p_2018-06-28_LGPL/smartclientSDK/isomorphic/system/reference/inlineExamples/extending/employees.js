
// simple client-only dataSource
isc.DataSource.create({
    ID:"employees",
    clientOnly:true,
    fields:[
        {name:"employeeID", type:"sequence", hidden:true, primaryKey:true},
        {name:"name", title:"Name"},
        {name:"hireDate", title:"Hiring Date", type:"date"}
    ],
    testData:[
        {employeeID:452, name:"Gene Porter", hireDate:new Date(2005,1,4)},
        {employeeID:782, name:"Cheryl Pearson", hireDate:new Date(2007,11,6)},
        {employeeID:751, name:"Rogine Leger", hireDate:new Date(2007,10,22)},
    ]
})
