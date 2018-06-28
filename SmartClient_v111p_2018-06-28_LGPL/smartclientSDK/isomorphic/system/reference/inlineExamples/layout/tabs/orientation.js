isc.TabSet.create({
    ID: "topTabSet",
    autoDraw: false,
    tabBarPosition: "top",
    width: 400,
    height: 200,
    tabs: [
        {title: "Blue", icon: "pieces/16/pawn_blue.png", iconSize:16,
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_blue.png"})},
        {title: "Green", icon: "pieces/16/pawn_green.png", iconSize:16,
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_green.png"})}
    ]
});

isc.TabSet.create({
    ID:"leftTabSet",
    autoDraw: false,
    tabBarPosition: "left",
    width: 400,
    height: 200,
    tabs: [
        {icon: "pieces/16/pawn_blue.png", iconSize:16, title: "",
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_blue.png"})},
        {icon: "pieces/16/pawn_green.png", iconSize:16, title: "",
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_green.png"})}
    ]
});

isc.IButton.create({
    ID: "buttonBlue",
    autoDraw: false,
    title: "Select Blue",
    click: function () {
        topTabSet.selectTab(0);
        leftTabSet.selectTab(0);
    }
});

isc.IButton.create({
    ID: "buttonGreen",
    autoDraw: false,
    title: "Select Green",
    click: function () {
        topTabSet.selectTab(1);
        leftTabSet.selectTab(1);
    }
});

isc.HStack.create({
    ID: "hStack",
    autoDraw: false,
    height: 20,
    membersMargin: 10,
    members: [ buttonBlue, buttonGreen ]
});
            
isc.VStack.create({
    membersMargin: 15,
    members: [
        topTabSet,
        hStack,
        leftTabSet
    ]
});