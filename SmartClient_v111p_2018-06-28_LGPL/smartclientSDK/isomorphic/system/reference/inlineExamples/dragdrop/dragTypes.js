isc.defineClass("DragPiece", "Img").addProperties({
    width:48, height:48,
    layoutAlign:"center",
    canDragReposition:true,
    canDrop:true,
    dragAppearance:"target",
    appImgDir:"pieces/48/"
})

isc.defineClass("DropBox", "VStack").addProperties({
    showEdges:true,
    membersMargin:10,  layoutMargin:10,
    canAcceptDrop:true,
    animateMembers:true,
    dropLineThickness:4
})

isc.HStack.create({membersMargin:20, members:[

    isc.DropBox.create({
        edgeImage:"edges/gray/6.png",
        members:[
            isc.DragPiece.create({src:"pawn_blue.png", dragType:"b"}),
            isc.DragPiece.create({src:"cube_green.png", dragType:"g"}),
            isc.DragPiece.create({src:"piece_yellow.png", dragType:"y"})
        ],
        dropTypes:["b", "g", "y"]
    }),
    isc.DropBox.create({
        edgeImage:"edges/blue/6.png",
        members:[
            isc.DragPiece.create({src:"pawn_blue.png", dragType:"b"}),
            isc.DragPiece.create({src:"cube_blue.png", dragType:"b"}),
            isc.DragPiece.create({src:"piece_blue.png", dragType:"b"})
        ],
        dropTypes:"b"
    }),
    isc.DropBox.create({
        edgeImage:"edges/green/6.png",
        members:[
            isc.DragPiece.create({src:"pawn_green.png", dragType:"g"}),
            isc.DragPiece.create({src:"cube_green.png", dragType:"g"}),
            isc.DragPiece.create({src:"piece_green.png", dragType:"g"})
        ],
        dropTypes:"g"
    })

]})
