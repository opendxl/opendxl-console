isc.defineClass("DragPiece", "Img").addProperties({
    width:48, height:48,
    layoutAlign:"center",
    canDragReposition:true,
    canDrop:true,
    dragAppearance:"target",
    appImgDir:"pieces/48/"
})


isc.VStack.create({
    showEdges:true, edgeImage:"edges/green/6.png",
    membersMargin:10,  layoutMargin:10,
    canAcceptDrop:true,
    animateMembers:true,
    dropLineThickness:4,
    dropLineProperties: {
        border: "1px solid #40c040",
        backgroundColor: "#40c040"
    },
    showDragPlaceHolder:true,
    placeHolderProperties:{border:"1px solid #40c040"},
    members:[
        isc.DragPiece.create({src:"pawn_blue.png"}),
        isc.DragPiece.create({src:"pawn_green.png"}),
        isc.DragPiece.create({src:"pawn_yellow.png"})
    ]
})

isc.HStack.create({
    left:120,
    showEdges:true, edgeImage:"edges/blue/6.png",
    membersMargin:10,  layoutMargin:10,
    canAcceptDrop:true,
    animateMembers:true,
    dropLineThickness:4,
    dropLineProperties: {
        border: "1px solid #4040ff",
        backgroundColor: "#4040ff"
    },
    showDragPlaceHolder:true,
    placeHolderProperties:{border:"1px solid #4040ff"},
    members:[
        isc.DragPiece.create({src:"cube_blue.png"}),
        isc.DragPiece.create({src:"cube_green.png"}),
        isc.DragPiece.create({src:"cube_yellow.png"})
    ]
})
