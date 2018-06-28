
var typeMenu = {
    _constructor: "Menu",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: "Document", keyTitle: "Ctrl+D", icon: "icons/16/document_plain_new.png"},
        {title: "Picture", keyTitle: "Ctrl+P", icon: "icons/16/folder_out.png"},
        {title: "Email", keyTitle: "Ctrl+E", icon: "icons/16/disk_blue.png"}
    ]
};

function getIconButton (title, props) {
    return isc.IconButton.create(isc.addProperties({
            title: title,
            icon: "pieces/16/cube_blue.png",
            largeIcon: "pieces/48/cube_blue.png",
            click: "isc.say(this.title + ' button clicked');"
        }, props)
    );
}

function getIconMenuButton (title, props) {
    return isc.IconMenuButton.create(isc.addProperties({
            title: title,
            icon: "pieces/16/piece_blue.png",
            largeIcon: "pieces/48/piece_blue.png",
            click: "isc.say(this.title + ' button clicked');"
        }, props)
    );
}

isc.RibbonGroup.create({
    ID: "fileGroup",
    title: "File (vertical icons)",
    numRows: 3,
    colWidths: [ 40, "*" ],
    titleAlign: "left",
    controls: [
        getIconMenuButton("New", { orientation: "vertical", menu: typeMenu, showMenuIconOver: false }),
        getIconButton("Open", { orientation: "vertical", largeIcon: "pieces/48/cube_green.png" }),
        getIconButton("Save", { orientation: "vertical", largeIcon: "pieces/48/star_yellow.png" }),
        getIconMenuButton("Save As", { orientation: "vertical", menu: typeMenu, largeIcon: "pieces/48/pawn_red.png" })
    ],
    autoDraw: false
});


isc.RibbonGroup.create({
    ID: "editGroup",
    title: "Editing Tools",
    numRows: 3,
    colWidths: [ 40, "*" ],
    controls: [
        getIconButton("Edit", { icon: "pieces/16/star_yellow.png" }),
        getIconButton("Copy", { icon: "pieces/16/pawn_white.png" }),
        getIconButton("Paste"),
        getIconMenuButton("Undo", { menu: typeMenu, showMenuIconOver: false, icon: "pieces/16/star_grey.png" }),
        getIconMenuButton("Redo", { menu: typeMenu, icon: "pieces/16/piece_green.png" })
    ],
    autoDraw: false
});

isc.RibbonGroup.create({
    ID: "insertGroup",
    title: "Insert",
    numRows: 3,
    colWidths: [ 40, "*" ],
    controls: [
        getIconMenuButton("Picture", { orientation: "vertical", menu: typeMenu, largeIcon: "pieces/48/cube_blue.png" }),
        getIconButton("Link", { icon: "pieces/16/piece_red.png" }),
        getIconButton("Document", { icon: "pieces/16/star_blue.png" }),
        getIconButton("Video", { icon: "pieces/16/pawn_yellow.png" })
    ],
    autoDraw: false
});

isc.RibbonBar.create({
    ID: "ribbonBar",
    groupTitleAlign: "center",
    groupTitleOrientation: "top"
});

ribbonBar.addGroup(fileGroup, 0);
ribbonBar.addGroup(editGroup, 1);
ribbonBar.addGroup(insertGroup, 2);
