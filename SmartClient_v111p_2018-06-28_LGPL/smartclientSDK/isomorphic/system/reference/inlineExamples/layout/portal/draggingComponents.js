isc.defineClass("PartsListGrid","ListGrid").addProperties({
    cellHeight: 24, 
    imageSize: 16,
    showEdges: true,
    border: "0px",
    bodyStyleName: "normal",
    alternateRecordStyles: true, 
    showHeader: false,
    leaveScrollbarGap: false,
    fields: [
        {name: "partSrc", type: "image", width: 24, imageURLPrefix: "pieces/16/"},
        {name: "partName"},
        {name: "partNum", width: 20}
    ],
    trackerImage: {src:"pieces/24/cubes_all.png", width: 24, height: 24}
})

isc.PartsListGrid.create({
    ID: "myList",
    data: exampleData,
    canDragRecordsOut: true,
    canReorderRecords: true,
    dragDataAction: "copy"
}),

isc.PortalLayout.create({
    ID: "portalLayout",

    getDropPortlet : function (dragTarget, colNum, rowNum, rowOffset) {
        // You can use getDropPortlet to customize what happens when a component is dropped
        if (dragTarget.isA("PartsListGrid")) {
            return isc.Portlet.create({
                title: "Dragged Records",
                items: [
                    isc.PartsListGrid.create({
                        data: dragTarget.getDragData()
                    })
                ]
            }); 
        } else {
            // By default, the whole component is wrapped in a Portlet
            return this.Super("getDropPortlet", arguments);
        }
    }
});

isc.defineClass("DragPiece", "Img").addProperties({
    width: 48,
    height: 48,
    padding: 12,
    layoutAlign: "center",
    canDragReposition: true,
    canDrop: true,
    dragAppearance: "target",
    appImgDir: "pieces/48/"
})

isc.VStack.create({
    ID: "myImages",
    membersMargin: 10,
    layoutMargin: 10,
    showEdges: true,
    members: [
        isc.DragPiece.create({src:"pawn_blue.png"}),
        isc.DragPiece.create({src:"pawn_green.png"}),
        isc.DragPiece.create({src:"pawn_yellow.png"})
    ]
})

isc.HLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [
        portalLayout,
        isc.VLayout.create({
            width: 200,
            membersMargin: 10,
            members: [
                myList,
                myImages
            ]
        })
    ]
});
