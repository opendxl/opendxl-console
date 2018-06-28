isc.TabSet.create({
    ID: "tabSet",
    tabBarPosition: "top",
    width: 400,
    height: 200,
    tabs: [
        {title: "Blue", canClose: true,
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_blue.png"})},
        {title: "Green",
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_green.png"})}
    ]
});

isc.HLayout.create({
    top: 215,
    membersMargin: 15,
    members: [
        isc.IButton.create({
            title: "Add Tab",
            click: function () {
                // alternate between yellow pawn and green cube
                if (tabSet.tabs.length % 2 == 0) {
                    tabSet.addTab({
                        title: "Yellow",
                        canClose: true,
                        pane: isc.Img.create({autoDraw: false, width: 48, height: 48, 
                                              src: "pieces/48/pawn_yellow.png"})
                    });
                } else {
                    tabSet.addTab({
                        title: "Green",
                        canClose: true,
                        pane: isc.Img.create({autoDraw: false, width: 48, height: 48, 
                                              src: "pieces/48/cube_green.png"})
                    });            
                }
                
                if (tabSet.tabs.length == 1) {
                    tabSet.selectTab(0);
                } else {
                    tabSet.selectTab(tabSet.tabs.length-1);
                };
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
