isc.Label.create({
    ID: "ordersLabel",
    contents: "Order",
    width: "90%",
    height: 25,
    autoDraw: true,
    baseStyle: "exampleSeparator"
});

isc.ListGrid.create({
    ID: "ordersList",
    top: 40,
    height: 170,
    width: 500,
    autoDraw: true,
    dataSource: "masterDetail_orderHB",
    fields: [
        { name: "orderID", width: "25%" },
        { name: "customerName" },
        { name: "orderDate", width: "25%" }
    ],
    autoFetchData: true,
    selectionChanged: function(record, state) {
        if (state) {
            orderForm.editRecord(record);
            orderItemsList.setData(record.items);
        }
    }
});

isc.Label.create({
    ID: "orderDetailsLabel",
    contents: "Order Details",
    width: "90%",
    top: 240,
    height: 25,
    autoDraw: true,
    baseStyle: "exampleSeparator"
});


isc.DynamicForm.create({
    ID: "orderForm",
    dataSource: "masterDetail_orderHB",
    autoDraw: false,
    fields: [
        { name: "orderID", title: "Order ID", disabled: true },
        { name: "customerName", title: "Customer Name", wrapTitle: false },
        { name: "orderDate", title: "Order Date", type: "date" },
        { name: "trackingNumber", title: "Tracking #", type: "integer" }
    ]
});

isc.ListGrid.create({
    ID: "orderItemsList",
    autoDraw: false,
    height: 130,
    dataSource: "masterDetail_orderItemHB",
    canEdit: true,
    saveLocally: true,
    saveByCell: true,
    fields: [
        { name: "itemDescription" },
        { name: "quantity", width:"25%" },
        { name: "unitPrice", width: "25%" }
    ]
});

isc.VLayout.create({
    top: 275,
    width: 500,
    autoDraw: true,
    membersMargin: 5,
    members: [ 
        orderForm, 
        orderItemsList,
        isc.IButton.create({
            title: "Save",
            click: function() {
                isc.RPCManager.startQueue();
                orderItemsList.saveAllEdits()
                orderForm.setValue("items", orderItemsList.data);
                orderForm.saveData();
                isc.RPCManager.sendQueue(function() {
                    orderForm.clearValues();
                    ordersList.deselectAllRecords();
                    orderItemsList.setData([]);
                });
            }
        })
    ]
});

