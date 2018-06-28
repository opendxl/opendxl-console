isc.TreeGrid.create({
    autoDraw: false,
    ID: "categoryTree",
    dataSource: "supplyCategory",
    canAcceptDroppedRecords:true,
    canReparentNodes: false,
    autoFetchData: true,
    folderClick: function (viewer, folder, recordNum) {
        labelCategory.setContents("Items in Category: " + folder.categoryName);
        itemList.fetchData({category:folder.categoryName});
    }
});
isc.ListGrid.create({
    autoDraw: false,
    ID: "itemList",
    dataSource: "supplyItem",
    canDragRecordsOut: true,
    autoFetchData: true,
    initialCriteria:{fieldName: "category", operator: "equals", value: "Washroom"},
    fields: [
        {name: "itemName", width: 300},
        {name: "SKU"},
        {name: "units"}
    ]
});
isc.Label.create({
    autoDraw: false, height: 20,
    ID: "labelCategory",
    contents: "Items in Category: Washroom"
});
isc.VLayout.create({
    ID: "vLayoutItems",
    width: "65%",
    members: [
        labelCategory, itemList
    ]
});
isc.VLayout.create({
    ID: "vLayoutCategory",
    width: "35%",
    members: [
        isc.LayoutSpacer.create({height:20}), categoryTree
    ]
});
isc.HLayout.create({
    height: 300,
    width: 800,
    membersMargin: 10,
    members: [
        vLayoutCategory, vLayoutItems
    ]
});
