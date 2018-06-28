isc.Img.create({
    ID:"van",
    left:50, top:50, width:96, height:96,
    src:"other/van.png"
})

isc.Img.create({
    src:"icons/48/reset.png", width:48, height:48, showRollOver:true,
    click:"van.moveTo(50,50)"
})

isc.Img.create({
    src:"icons/48/downright.png", left:50, width:48, height:48, showRollOver:true,
    mouseStillDown:"van.moveBy(20,20)"
})
