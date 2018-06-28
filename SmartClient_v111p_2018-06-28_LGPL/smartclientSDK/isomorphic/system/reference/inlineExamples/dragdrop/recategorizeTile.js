isc.DynamicForm.create({
    ID: "form1",
    autoDraw: false,
    fields: [
    {name:"status", title:"<b>Status</b>", type:"select", defaultValue:"Endangered",
            valueMap:["Threatened", "Endangered", "Not Endangered", "Not currently listed",
                "May become threatened", "Protected"]}
    ],
    itemChanged: "boundList1.fetchData(this.getValuesAsCriteria());"        
});
isc.TileGrid.create({
    autoDraw:false,
    ID:"boundList1",
    width: 400, height:400,
    tileWidth:150,
    tileHeight:185,
    height:400,
    showAllRecords:true,
    dataSource:"animals",
    autoFetchData:true,
    initialCriteria: {status:"Endangered"},
    autoFetchTextMatchStyle:"exact",
    animateTileChange:true,
    canAcceptDroppedRecords: true,
    canDragTilesOut: true,
    tileDragAppearance: "target",
    fields: [
        {name:"picture"},
        {name:"commonName"},
        {name:"status"}
    ]            
});
isc.DynamicForm.create({
    ID: "form2",
    autoDraw: false,
    fields: [
    {name:"status", title:"<b>Status</b>", type:"select", defaultValue:"Threatened",
            valueMap:["Threatened", "Endangered", "Not Endangered", "Not currently listed",
                "May become threatened", "Protected"]}
    ],
    itemChanged: "boundList2.fetchData(this.getValuesAsCriteria());"        
});
isc.TileGrid.create({
    autoDraw:false,
    ID:"boundList2",
    width: 400, height:400,
    tileWidth:150,
    tileHeight:185,
    height:400,
    showAllRecords:true,
    dataSource:"animals",
    autoFetchData:true,
    initialCriteria: {status: "Threatened"},
    autoFetchTextMatchStyle:"exact",
    animateTileChange:true,
    canAcceptDroppedRecords: true,
    canDragTilesOut: true,
    tileDragAppearance: "target",
    fields: [
        {name:"picture"},
        {name:"commonName"},
        {name:"status"}
    ]            
});

isc.HLayout.create({
    membersMargin: 10,
    members: [
        isc.VLayout.create({
            members: [
                form1,
                boundList1
            ]
        }),
        isc.VLayout.create({
            members: [
                form2,
                boundList2 
            ]
        })           
    ]
});

