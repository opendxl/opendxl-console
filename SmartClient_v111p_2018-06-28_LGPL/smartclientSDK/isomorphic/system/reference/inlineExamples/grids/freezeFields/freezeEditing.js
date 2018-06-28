isc.ListGrid.create({
    ID: "supplyList",
    width:500, height:224,
    dataSource: supplyItem,
    canEdit:true,
    canFreezeFields:true,
    fields:[
        {name:"itemName", frozen:true, width:150},
        {name:"category", width:100},
        {name:"SKU", width:100},
        {name:"units", width:80},
        {name:"description", width:250}
    ]
})

supplyList.fetchData({}, "supplyList.startEditing(0,0)");
