isc.defineClass("DragLabel", "Label").addProperties({
    top:50, align:"center", padding:4, showEdges:true,
    backgroundColor:"#e0e0ff",
    keepInParentRect:true,
    canDragReposition:true
})

isc.DragLabel.create({
    left:50,
    contents:"Translucent",
    dragAppearance:"target",
    dragOpacity:60
})

isc.DragLabel.create({
    left:200,
    contents:"Shadow",
    dragAppearance:"target",
    showDragShadow:true,
    dragShadowDepth:8
})

isc.DragLabel.create({
    left:350,
    contents:"Outline",
    dragAppearance:"outline"
})

