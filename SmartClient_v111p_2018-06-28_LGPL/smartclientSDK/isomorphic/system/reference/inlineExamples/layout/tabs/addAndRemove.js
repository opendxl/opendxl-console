isc.TabSet.create({
    ID: "tabSet",
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

isc.HLayout.create({
    top: 225,
    membersMargin: 10,
    members: [
        isc.IButton.create({
            title: "Add Tab",
            click: function () {
                // alternate between yellow pawn and green cube
                if (tabSet.tabs.length % 2 == 0) {
                    tabSet.addTab({
                        title: "Yellow",
                        icon: "pieces/16/pawn_yellow.png", iconSize:16,
                        pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_yellow.png"})
                    });
                } else {
                    tabSet.addTab({
                        title: "Green",
                        icon: "pieces/16/cube_green.png", iconSize:16,
                        pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/cube_green.png"})
                    });            
                }
                if (tabSet.tabs.length == 1) tabSet.selectTab(0);
            }
        }),
        isc.IButton.create({
            title: "Remove Tab",
            click: function () {
                tabSet.removeTab(tabSet.tabs.length-1);
            }
        })
    ]
});

