isc.Img.create({
    ID:"eyesImg",
    top: 50,
    width:360, height:188,
    src:"other/eyes.jpg",
    showEdges:true,
    animateTime:1200,
    opacity:0
})

isc.HLayout.create({
    membersMargin: 10,
    members: [
        isc.IButton.create({
            title:"Fade in", 
            click:"eyesImg.animateFade(100)"
        }),
        isc.IButton.create({
            title:"Fade out", 
            click:"eyesImg.animateFade(0)"
        })
    ]
});
