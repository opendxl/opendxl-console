isc.Menu.create({
    ID: "menu",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
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

isc.ToolStripMenuButton.create({
    ID: "menuButton",
    title: "File",   
    menu: menu
});

isc.ToolStripButton.create({
    ID: "printButton",    
    icon: "[SKIN]/RichTextEditor/print.png",
    title: "Print"
    
});
isc.ToolStripButton.create({
    ID: "alignLeft",   
    icon: "[SKIN]/RichTextEditor/text_align_left.png",    
    actionType: "radio",
    radioGroup: "textAlign"
});
isc.ToolStripButton.create({
    ID: "alignRight",   
    icon: "[SKIN]/RichTextEditor/text_align_right.png", 
    actionType: "radio",
    radioGroup: "textAlign"
});
isc.ToolStripButton.create({
    ID: "alignCenter",   
    icon: "[SKIN]/RichTextEditor/text_align_center.png", 
    actionType: "radio",
    radioGroup: "textAlign"
});
isc.ToolStripButton.create({
    ID: "bold",
    icon: "[SKIN]/RichTextEditor/text_bold.png",
    actionType: "checkbox",
    showFocused: false,
    showFocusOutline:true
});
isc.ToolStripButton.create({
    ID: "italics",
    icon: "[SKIN]/RichTextEditor/text_italic.png",
    actionType: "checkbox",
    showFocused: false,
    showFocusOutline:true
});
isc.ToolStripButton.create({
    ID: "underlined",
    icon: "[SKIN]/RichTextEditor/text_underline.png",
    actionType: "checkbox",
    showFocused: false,
    showFocusOutline:true
});

isc.DynamicForm.create({
    ID: "fontSelector",
    showResizeBar:true,
    width:120, minWidth:50,
    numCols:1,
    fields: [
        {name: "selectFont", showTitle: false, width:"*",
         valueMap: {
            "courier": "<span style='font-family:courier'>Courier</span>",
            "verdana": "<span style='font-family:verdana'>Verdana</span>",
            "times": "<span style='font-family:times'>Times</span>"
         }, defaultValue:"courier" }
    ]    
});

isc.DynamicForm.create({
    ID: "zoomSelector",
    width:100, minWidth:50,
    numCols:1,
    fields: [
        {name: "selectZoom", showTitle: false, width:"*",
         valueMap: ["50%", "75%", "100%", "150%", "200%", "Fit"],
         defaultValue:"100%" }
    ]
});

isc.ToolStrip.create({
    width: 450,
    members: [menuButton, "separator", printButton, 
              "resizer", bold, italics, underlined, 
              "separator",
              alignLeft, alignRight, alignCenter,
              "separator",
              fontSelector, "resizer", zoomSelector]
});
