isc.TreeGrid.create({
    ID: "categoryTree",
    width: "30%",
    showResizeBar: true,
    dataSource: "supplyCategory",
    nodeClick: "itemList.fetchData({category: node.categoryName})",
    canAcceptDroppedRecords: true,
    selectionType: "single",
    autoFetchData: true,
    folderDrop : function (dragRecords, dropFolder, index, sourceWidget) {
        // prevent self drop
        if (this === sourceWidget) return;
        var record = itemList.getSelectedRecord();
        var newCategory = dropFolder.categoryName;
        record.category = newCategory;
        supplyItem.updateData(record);
    }
});

isc.ListGrid.create({
    ID: "itemList",
    dataSource: "supplyItem",
    fields : [
        { name:"itemName" },
        { name:"SKU" },
        { name:"unitCost", width:50 },
        { name:"units", width:40 }
    ],
    canDragRecordsOut: true,
    selectionType: "single"
});


isc.HLayout.create({
    width: "100%",
    height: "100%",
    members: [categoryTree, itemList]
});
