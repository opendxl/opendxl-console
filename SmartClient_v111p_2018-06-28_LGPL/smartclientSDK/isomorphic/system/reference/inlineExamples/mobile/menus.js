isc.Menu.create({
    ID: "menu",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    placement: "fillScreen",
    data: [
        {title: "New", keyTitle: "Ctrl+N", icon: "icons/16/document_plain_new.png"},
        {title: "Open", keyTitle: "Ctrl+O", icon: "icons/16/folder_out.png"},
        {isSeparator: true},
        {title: "Save", keyTitle: "Ctrl+S", icon: "icons/16/disk_blue.png"},
        {title: "Save As", icon: "icons/16/save_as.png"},
        {isSeparator: true},
        {title: "Recent Documents", icon: "icons/16/folder_document.png", submenu: [
            {title: "data.xml", checked: true},
            {title: "Component Guide.doc"},
            {title: "SmartClient.doc", checked: true},
            {title: "AJAX.doc"}
        ]},
        {isSeparator: true},
        {title: "Export as...", icon: "icons/16/export1.png", submenu: [
            {title: "XML"},
            {title: "CSV"},
            {title: "Plain text"}
        ]},
        {isSeparator: true},
        {title: "Print", enabled: false, keyTitle: "Ctrl+P", icon: "icons/16/printer3.png"}
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
    members: [menuButton]
});
