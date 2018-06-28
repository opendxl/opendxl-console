
isc.ListGrid.create({
    ID:"moneyTransferList",
    dataSource:moneyTransfer,
    width:700,
    height:224,
    showFilterEditor:true,
    alternateRecordStyles:true,
    autoFetchData:true,
    dataPageSize: 50,
    canEdit:true,
    editEvent:"click",
    canRemoveRecords:true,
    fields: [
        { name: "name" },
        { name: "paymentAmount" },
        { name: "sourceCurrencySymbol" },
        { name: "paymentCurrencySymbol", width: 170 }
    ]
});

