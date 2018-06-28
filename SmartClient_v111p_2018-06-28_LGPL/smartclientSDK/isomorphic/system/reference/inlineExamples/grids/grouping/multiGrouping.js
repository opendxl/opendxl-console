
isc.ListGrid.create({
    ID: "companyList",
    width:600, height:525,
    alternateRecordStyles:true,
    autoFetchData:true,
    dataSource:orderItemLocalDS,
    canEdit:true, editEvent:"click",
    showAllRecords:true,

    groupByField: ["category", "shipDate"],
    groupStartOpen:"all",
    canMultiGroup: true,

    sortField: "shipDate",
    sortDirection: "ascending",

    fields: [
        {name: "orderID", includeInRecordSummary: false}, 
        {name: "itemDescription"}, 
        {name: "category"}, 
        {name: "shipDate"},
        {name: "quantity"}, 
        {name: "unitPrice"},
        {name: "Total", type:"summary", 
         recordSummaryFunction:"multiplier",
         align:"right",
         formatCellValue:function (value) {
             if (isc.isA.Number(value)) {
                return value.toCurrencyString("$");
             }
             return value;
         }
        }
    ]
});

isc.Button.create({
    top: 550, width: 150,
    title: "Configure Grouping",
    click: function() { companyList.configureGrouping(); }
});

