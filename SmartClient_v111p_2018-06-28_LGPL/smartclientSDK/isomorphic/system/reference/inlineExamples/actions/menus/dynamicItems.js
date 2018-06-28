var listGrid = isc.ListGrid.create({
    ID: "listGrid",
    autoDraw: false,
    width: 130,
    fields: [
        {name: "project", title: "Project", type: "text"}
    ],
    data: [
        {project: "AJAX Interface"},
        {project: "Simplify Backend"},
        {project: "Broaden Reach"}
    ]
});

isc.Menu.create({
    ID: "menu",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {keyTitle: "Ctrl+N",
         enableIf: "listGrid.getSelectedRecord() != null",
         dynamicTitle: "'New file in' + (listGrid.getSelectedRecord() == null ? '...' : ' '+listGrid.getSelectedRecord().project)",
         dynamicIcon: "listGrid.getSelectedRecord() == null ? 'icons/16/document_plain_new_Disabled.png' : 'icons/16/document_plain_new.png'"
        },
        {title: "Open", keyTitle: "Ctrl+O", icon: "icons/16/folder_out.png"},
        {isSeparator: true},
        {title: "Save", keyTitle: "Ctrl+S", icon: "icons/16/disk_blue.png"},
        {title: "Save As", icon: "icons/16/save_as.png"},
        {isSeparator: true},
        {title: "Project Listing", checkIf: "listGrid.isVisible()",
         click: "listGrid.isVisible() ? listGrid.hide() : listGrid.show()"}
    ]
});

var menuButton = isc.MenuButton.create({
    ID: "menuButton",
    autoDraw: false,
    title: "File",
    width: 100,
    menu: menu
});

isc.HStack.create({
    width: "100%",
    membersMargin: 20,
    members: [listGrid, menuButton]
});
