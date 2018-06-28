isc.defineClass("StarImg", "Img").addProperties({
    width:48, height:48,
    layoutAlign:"center",
    appImgDir:"pieces/48/"
})

isc.HStack.create({
    ID:"starsLayout",
    top:50, membersMargin:10, layoutMargin:10, showEdges:true,
    animateMembers:true,
    members:[
        isc.StarImg.create({src:"star_blue.png"}),
        isc.StarImg.create({src:"star_green.png", ID:"greenStar"}),
        isc.StarImg.create({src:"star_yellow.png"})
    ]
})

isc.IButton.create({
    title:"Hide",
    icon:"pieces/16/star_green.png",
    iconOrientation:"right",
    click: "starsLayout.hideMember(greenStar)"
})

isc.IButton.create({
    title:"Show", left:120,
    icon:"pieces/16/star_green.png",
    iconOrientation:"right",
    click: "starsLayout.showMember(greenStar)"
})
