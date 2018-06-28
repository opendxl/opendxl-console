isc.defineClass("DragPiece", "Img").addProperties({
    width:48, height:48,
    cursor: "move",
    appImgDir: "pieces/48/",
    canDrag: true,
    canDrop: true,
    dragAppearance: "tracker",
    setDragTracker: "isc.EventHandler.setDragTracker(isc.Canvas.imgHTML('pieces/24/'+this.src,24,24),24,24,15,15)"
})

isc.defineClass("DroppedPiece", "Img").addProperties({
    width:24, height:24,
    appImgDir: "pieces/24/",
    canDragReposition: true,
    keepInParentRect: true,
    dragAppearance: "target",
    showContextMenu: "this.destroy(); return false;"
})

isc.defineClass("PieceBin", "Canvas").addProperties({
    width:100, height:100, overflow:"hidden",
    showEdges: true,
    edgeSize: 6,
    showContextMenu: "return false",
    canAcceptDrop: true,
    dropOver: "if (this.willAcceptDrop()) this.setBackgroundColor('#ffff80')",
    dropOut: "this.setBackgroundColor('#ffffff')",
    drop: function () {
        this.addChild(isc.DroppedPiece.create({
            src: isc.EventHandler.getDragTarget().src,
            left: this.getOffsetX()-15-this.edgeSize,
            top: this.getOffsetY()-15-this.edgeSize
        }))
    }
})

isc.VStack.create({members:[
isc.HStack.create({layoutMargin:20, membersMargin:40, layoutAlign:"center", members:[
    isc.DragPiece.create({src:"cube_blue.png", dragType:"b"}),
    isc.DragPiece.create({src:"cube_yellow.png", dragType:"y"}),
    isc.DragPiece.create({src:"cube_green.png", dragType:"g"})
]}),
isc.HStack.create({membersMargin:20, members:[
    isc.PieceBin.create({edgeImage:"edges/blue/6.png", dropTypes:"b"}),
    isc.PieceBin.create({edgeImage:"edges/yellow/6.png", dropTypes:"y"}),
    isc.PieceBin.create({edgeImage:"edges/green/6.png", dropTypes:"g"}),
    isc.PieceBin.create({edgeImage:"edges/gray/6.png", dropTypes:["b","y","g"]})
]})
]})
