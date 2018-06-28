isc.defineClass("PartsListGrid","ListGrid").addProperties({
    width:150, height:160, cellHeight:24, imageSize:16,
    showEdges:true, border:"0px", bodyStyleName:"normal",
    alternateRecordStyles:true, showHeader:false, leaveScrollbarGap:false,
    emptyMessage:"Nothing selected",
    fields:[
        {name:"partSrc", type:"image", width:24, imageURLPrefix:"pieces/16/"},
        {name:"partName"},
        {name:"partNum", width:20}
    ],
    trackerImage:{src:"pieces/24/cubes_all.png", width:24, height:24}
})


isc.PartsListGrid.create({
    data: exampleData,
    canDragSelect: true,
    selectionUpdated : "mirrorSelectionList.setData(recordList)"
})


isc.PartsListGrid.create({
    ID:"mirrorSelectionList",
    left:200
})
