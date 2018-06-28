isc.defineClass("DragPiece", "Img").addProperties({
    width:48, height:48,
    layoutAlign:"center",
    canDragReposition:true,
    canDrop:true,
    dragAppearance:"target",
    appImgDir:"pieces/48/"
})

isc.HStack.create({
    membersMargin:10,
    canAcceptDrop:true,
    animateMembers:true,
    dropLineThickness:4,
    members:[
        isc.DragPiece.create({src:"pawn_blue.png"}),
        isc.DragPiece.create({src:"pawn_red.png"}),
        isc.DragPiece.create({src:"pawn_green.png"}),
        isc.DragPiece.create({src:"pawn_yellow.png"}),
        isc.DragPiece.create({src:"pawn_white.png"})
    ]
})
