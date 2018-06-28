exampleText = "When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation."


isc.defineClass("DragText", "Label").addProperties({
    contents:exampleText,
    width:250,
    canDragReposition:true, dragAppearance:"target", keepInParentRect:true
})

isc.DragText.create({
    showEdges:true,
    edgeShowCenter:true,
    styleName:"blackText",
    edgeImage:"corners/flat_100.png",
    edgeSize:30,
    edgeOffset:14
})

isc.DragText.create({
    left:100, top:80,
    showEdges:true,
    styleName:"blackText",
    edgeShowCenter:true,
    edgeImage:"corners/ridge_28.png",
    edgeSize:28,
    edgeOffset:18
})

isc.DragText.create({
    left:200, top:160, width:270,
    showEdges:true,
    styleName:"blackText",
    edgeShowCenter:true,
    edgeImage:"corners/glow_35.png",
    edgeSize:35,
    edgeOffset:25
})