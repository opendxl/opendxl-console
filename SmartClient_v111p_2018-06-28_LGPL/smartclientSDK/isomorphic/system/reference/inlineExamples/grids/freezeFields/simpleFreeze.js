isc.ListGrid.create({
    ID: "supplyList",
    width:550, height:224,
    dataSource: supplyItem,
    autoFetchData: true,
    fields:[
        {name:"itemName", frozen:true, width:150},
        {name:"category", width:100},
        {name:"SKU", width:100},
        {name:"units", width:80},
        {name:"description", width:250}
    ]
})
