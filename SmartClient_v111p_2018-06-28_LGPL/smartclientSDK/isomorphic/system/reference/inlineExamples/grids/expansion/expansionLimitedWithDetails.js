isc.ListGrid.create({
    ID: "itemList",
    width:500, height:300, 
    alternateRecordStyles:true,
    expansionFieldImageShowSelected:true,

    // use the supplyItemWithOps dataSource and use it's "outputsLimitedFetch" operation.
    // this demonstrates using "outputs" on an operationBinding to forcibly limit the data 
    // retrieved for each row
    dataSource: supplyItemWithOps,
    fetchOperation: "outputsLimitedFetch",
    autoFetchData: true,

    fields: [
        {name: "itemName"},
        {name: "SKU"},
        {name: "category"}
    ],

    // allow multiple records to be expanded, but limit it to 3
    canExpandRecords: true,
    canExpandMultipleRecords: true,
    maxExpandedRecords: 3,

    // override the builtin getExpansionComponent() method so we can return a component of our
    // choosing - in this case, create a DetailViewer, populate it with the entire record from 
    // the server and return it for display
    getExpansionComponent : function (record, rowNum, colNum) {
        var component = isc.DetailViewer.create({
            dataSource: supplyItemWithOps
        });

        component.fetchData({itemID: record.itemID});

        return component;
    }
});

