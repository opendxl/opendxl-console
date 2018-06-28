isc.TabSet.create({
    ID: "tabSet",
    tabBarPosition: "top",
    tabBarAlign: "right",
    width: 300,
    height: 200,
    tabs: [
        {title: "Blue", icon: "pieces/16/pawn_blue.png", iconSize:16,
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_blue.png"})},
        {title: "Green", icon: "pieces/16/pawn_green.png", iconSize:16,
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_green.png"})}
    ]
});

isc.TabSet.create({
    tabBarPosition: "left",
    tabBarAlign: "bottom",
    width: 200,
    height: 300,
    left: 350,
    tabs: [
        {icon: "pieces/16/pawn_blue.png", iconSize:16, title: "",
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_blue.png"})},
        {icon: "pieces/16/pawn_green.png", iconSize:16, title: "",
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_green.png"})}
    ]
});



