isc.Img.create({
    ID:"bluePiece",
    left:50, top:50, width:48, height:48, src:"pieces/48/pawn_blue.png",
    canDrag: true,
    canDrop: true,
    dragAppearance: "tracker",
    setDragTracker: "isc.EventHandler.setDragTracker('Blue Piece')"
})

isc.Img.create({
    ID:"greenPiece",
    left:150, top:50, width:48, height:48, src:"pieces/48/pawn_green.png",
    canDrag: true,
    canDrop: true,
    dragAppearance: "tracker",
    setDragTracker: "isc.EventHandler.setDragTracker(isc.Canvas.imgHTML('pieces/24/pawn_green.png',24,24))"
})

isc.Label.create({
    left:250, top:50, showEdges:true,
    contents: "Drop Here", align:"center",
    canAcceptDrop: true,
    dropOver: "this.setBackgroundColor('#ffff80')",
    dropOut: "this.setBackgroundColor('#ffffff')",
    drop: "isc.say('You dropped the '+isc.EventHandler.getDragTarget().getID())"
})