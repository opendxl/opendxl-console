// Enable offline storage for the two DataSources
supplyCategory.addProperties({useOfflineStorage: true});
supplyItem.addProperties({useOfflineStorage: true});

isc.TreeGrid.create({
    ID: "categoryTree",
    width: 250, height: 224,
    dataSource: supplyCategory,
    loadOnDemand: true,
    autoFetchData: true,
    recordClick: "itemList.filterData({category: record.categoryName});"
});

isc.ListGrid.create({
    ID: "itemList",
    width: 350, height: 224,
    left: 270,
    dataSource: supplyItem,
    fields: [
        {name: "itemID"},
        {name: "itemName"},
        {name: "unitCost"},
        {name: "category"}
    ]
});

isc.Button.create({
    title: "Go offline",
    click: function () {
        if (this.title == "Go offline") {
            this.setTitle("Go online");
            isc.Offline.goOffline();
        } else {
            this.setTitle("Go offline");
            isc.Offline.goOnline();
        }
    },
    top: 240, width: 100
});
