exampleText = "When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation."


isc.defineClass("DragText", "Label").addProperties({
    contents:exampleText,
    width:240, padding:8,
    styleName:"blackOnWhite",
    canDragReposition:true, dragAppearance:"target", keepInParentRect:true
})

isc.DragText.create({
    showEdges:true,
    edgeImage:"edges/custom/sharpframe_10.png",
    edgeSize:10
})

isc.DragText.create({
    left:100, top:80,
    showEdges:true,
    edgeImage:"edges/custom/frame_10.png",
    edgeSize:10
})

isc.DragText.create({
    left:200, top:160, width:250,
    showEdges:true,
    edgeImage:"edges/custom/glow_15.png",
    edgeSize:15
})