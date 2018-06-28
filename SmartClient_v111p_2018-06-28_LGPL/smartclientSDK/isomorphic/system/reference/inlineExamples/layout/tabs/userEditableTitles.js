isc.TabSet.create({
    ID: "tabSet",
    tabBarPosition: "top",
    width: 550,
    height: 200,
    canEditTabTitles: true, 
    titleEditEvent: "doubleClick",
    titleEditorTopOffset: 2,
    tabs: [
        {title: "Blue", canClose: true,
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_blue.png"})},
        {title: "Green", canClose: true,
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_green.png"})},
        {title: "123-Yellow", canClose: true, ID: "validatedTab",
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_yellow.png"})},
        {title: "Can't Change Me", canEditTitle: false,
         pane: isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_red.png"})}
    ],
    titleChanged : function (newTitle, oldTitle, tab) {
        if (tab.ID == "validatedTab" && (!newTitle || newTitle.substring(0, 4) != "123-")) {
            isc.warn("Tab title must start with the prefix \"123-\"");
            return false;
        }
    }
});
