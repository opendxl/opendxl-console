isc.defineClass("PartsListGrid","ListGrid").addProperties({
    width:150, cellHeight:24, imageSize:16,
    showEdges:true, border:"0px", bodyStyleName:"normal",
    alternateRecordStyles:true, showHeader:false, leaveScrollbarGap:false,
    emptyMessage:"Drag &amp; drop parts here",
    fields:[
        {name:"partSrc", type:"image", width:24, imgDir:"pieces/16/"},
        {name:"partName"},
        {name:"partNum", width:20}
    ],
    trackerImage:{src:"pieces/24/cubes_all.png", width:24, height:24}
})


isc.HStack.create({membersMargin:10, height:160, members:[
    isc.PartsListGrid.create({
        ID:"myList1",
        data: exampleData,
        canDragRecordsOut: true,
        canReorderRecords: true,
        dragDataAction: "copy"
    }),
    isc.Img.create({src:"icons/32/arrow_right.png", width:32, height:32, layoutAlign:"center",
        click:"myList2.transferSelectedData(myList1)"
    }),
    isc.PartsListGrid.create({
        ID:"myList2",
        left:300,
        canAcceptDroppedRecords: true,
        canReorderRecords: true
    })
]})
