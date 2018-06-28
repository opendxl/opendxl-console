isc.Label.create({
    ID:"messageBox",
    styleName:"exampleTitle", showEdges:true, padding:5,
    backgroundColor:"#ffffd0",
    valign:"center", align:"center",
    width:200, top:50, left:-220, // start off-screen    
    contents:"Vision is the art of seeing the invisible.",
    animateTime:1200 // milliseconds
});

isc.HLayout.create({
    membersMargin:10,
    members: [
        isc.IButton.create({
            title:"Move in",
            click:"messageBox.animateMove(10,50)"
        }),
        isc.IButton.create({
            title:"Move out",
            click:"messageBox.animateMove(-220,50)"
        })
    ]
});
