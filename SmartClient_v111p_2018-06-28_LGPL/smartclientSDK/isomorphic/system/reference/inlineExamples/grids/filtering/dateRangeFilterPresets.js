// ---------------------------------------------------------------------------------------
// Date Range (Presets)


isc.DataSource.create({
    ID: "presetDateRangeDS",
    clientOnly: true,
    fields: [
        { name: "customerID" },
        { name: "customerName" },
        { name: "orderID", width:80 },
        { name: "orderDate", type: "date", width:100 },
        { name: "orderDescription" },
        { name: "orderQty" }
    ],
    testData: presetDateRangeData
});


presetDateRangeDS.addSearchOperator({
    ID: "recentDateRange",
    title: "in recent date range",
    valueType: "custom",
    editorType: "RecentDateRangeItem"
}, ["date"] );

isc.Label.create({
    ID: "recentDateLabel1",
    contents: "RecentDateRangeItem (ListGrid FilterEditor)",
    width: 750,
    height: 25,
    autoDraw: true,
    baseStyle: "exampleSeparator"
});

isc.ListGrid.create({
    ID: "grid1",
    width: 750,
    height: 150,
    dataSource: presetDateRangeDS,
    autoFetchData: true,
    useAllDataSourceFields: true,
    showFilterEditor: true,
    canGroupBy: true,
    fields: [
        { name: "orderDate", filterEditorType: "RecentDateRangeItem" }
    ]
});


// ---------------------------------------------------------------------------------------
// FilterBuilder Example 

isc.Label.create({
    ID: "recentDateLabel2",
    contents: "RecentDateRangeItem (FilterBuilder)",
    width: 750,
    height: 25,
    autoDraw: true,
    baseStyle: "exampleSeparator"
});

isc.FilterBuilder.create({
    ID: "filterBuilder",
    width: 750,
    dataSource: presetDateRangeDS,
    criteria: { _constructor: "AdvancedCriteria", operator: "and",
        criteria: [
            { fieldName: "orderDate" }
        ]
    }
});

isc.Button.create({
    ID: "searchButton",
    title: "Filter",
    autoFit: true,
    click: function () {
        var criteria = filterBuilder.getCriteria();
        grid2.fetchData(criteria);
    }
});

isc.ListGrid.create({
    ID: "grid2",
    width: 750,
    height: 150,
    dataSource: presetDateRangeDS,
    autoFetchData: true,
    showFilterEditor: false,
    useAllDataSourceFields: true
});

isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 10,
    members: [
        recentDateLabel1, grid1, recentDateLabel2, filterBuilder, searchButton, grid2
    ]
})
