isc.Img.create({
    ID: "myImage",
    left:120, top:20, width:48, height:48,
    appImgDir: "pieces/48/",
    src: "star_grey.png"
})

isc.IButton.create({
    left:10, top:100, width:80,
    title: "Show",
    iconOrientation: "right",
    icon: "pieces/16/star_blue.png",
    click: "myImage.setSrc('star_blue.png')"
})

isc.IButton.create({
    left:100, top:100, width:80,
    title: "Show",
    iconOrientation: "right",
    icon: "pieces/16/star_yellow.png",
    click: "myImage.setSrc('star_yellow.png')"
})

isc.IButton.create({
    left:190, top:100, width:80,
    title: "Show",
    iconOrientation: "right",
    icon: "pieces/16/star_green.png",
    click: "myImage.setSrc('star_green.png')"
})

