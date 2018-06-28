isc.DataSource.create({
    ID: "orderDetailDS",
    fields:[
        {name:"orderID", title:"Order Number", hidden:true, primaryKey:true, foreignKey: "orderDS.orderID"},
        {name:"loggedBy", title:"Logged By", width: "70"}, 
		{name:"loggedDate", title:"Message Date", width:"80"},
		{name:"orderMessage", title:"Message"}
    ],
    clientOnly: true,
    testData: customerOrderDetail
})	