isc.ListGrid.create({
    ID: "boundGrid",
    dataSource: "supplyItemDMI",
    width: "100%",
    height: 300
});

boundGrid.filterData({itemName: "account"});