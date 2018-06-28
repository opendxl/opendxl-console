isc.defineClass("PartsTreeGrid","TreeGrid").addProperties({
    width:200, height:200,
    showEdges:true, border:"0px", bodyStyleName:"normal",
    alternateRecordStyles:true, showHeader:false, leaveScrollbarGap:false,
    emptyMessage:"Drag &amp; drop parts here",
    manyItemsImage:"cubes_all.png",
    appImgDir:"pieces/16/"
})


isc.HStack.create({membersMargin:10, height:160, members:[
    isc.PartsTreeGrid.create({
        ID:"myTree1",
        data: partsTree1,
        canReorderRecords: true,
        canAcceptDroppedRecords: true,
        canDragRecordsOut: true,
        dragDataAction: "move"
    }),
    isc.VStack.create({width:32, height:74, layoutAlign:"center", membersMargin:10, members:[
        isc.Img.create({src:"icons/32/arrow_right.png", width:32, height:32,
            click:"myTree2.transferSelectedData(myTree1)"
        }),
        isc.Img.create({src:"icons/32/arrow_left.png", width:32, height:32,
            click:"myTree1.transferSelectedData(myTree2)"
        })
    ]}),    
    isc.PartsTreeGrid.create({
        ID:"myTree2",
        left:250,
        data: partsTree2,
        canDragRecordsOut: true,
        canAcceptDroppedRecords: true,
        canReorderRecords: true
    })    
]})