isc.DataSource.create({
    ID: "orderDS",
    fields:[
	    {name:"customerID", title:"Customer", hidden:true},
		{name:"customerName", title:"Name"},
        {name:"orderID", title:"Order Number"},
        {name:"orderDate", title:"Date"},
		{name:"orderDescription", title:"Description"},
		{name:"orderQty", title:"Quantity"}
    ],
    clientOnly:true,
    testData: customerOrders
})