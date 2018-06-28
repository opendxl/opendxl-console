isc.Label.create({
    ID:"textbox", align:"center", showEdges:true, padding:5,
    left:50, top:50, width:200,
    contents:"The future has a way of arriving unannounced.",
    visibility:"hidden"
});

isc.HLayout.create({
    membersMargin:10,
    left:40,
    members: [
        isc.IButton.create({
            title:"Show", 
            click:"textbox.show();"
        }),
        isc.IButton.create({
            title:"Hide",
            click:"textbox.hide();"
        })
    ]
});
