isc.Label.create({
    ID:"label1",
    left:50, top:50,
    showEdges:true,
    contents:"autoDraw:true",
    autoDraw:true
})

isc.Label.create({
    ID:"label2",
    left:200, top:50,
    showEdges:true,
    contents:"autoDraw:false",
    autoDraw:false
})

isc.IButton.create({
    title:"Draw", left:200,
    click:"label2.draw()"
})
