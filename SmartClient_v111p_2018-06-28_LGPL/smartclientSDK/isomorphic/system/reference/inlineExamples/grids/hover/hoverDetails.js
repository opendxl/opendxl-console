isc.ListGrid.create({
    ID: "itemList",
    width:500, height:300, 
    alternateRecordStyles:true,

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

    // allow Hovers
    canHover: true,
    showHover: true,

    // allow hoverComponents
    showHoverComponents: true,

    // override the builtin getCellHoverComponent() method so we can return a component of our
    // choosing - in this case, create a DetailViewer, populate it with the entire record from 
    // the server and return it for display
    getCellHoverComponent : function (record, rowNum, colNum) {
        this.rowHoverComponent = isc.DetailViewer.create({
            dataSource: supplyItemWithOps,
            width: 250
        });

        this.rowHoverComponent.fetchData({itemID: record.itemID}, null, { showPrompt: false} );

        return this.rowHoverComponent;
    }
});

