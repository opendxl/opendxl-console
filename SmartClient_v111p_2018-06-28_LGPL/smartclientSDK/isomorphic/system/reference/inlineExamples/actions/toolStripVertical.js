isc.ToolStripButton.create({
    ID: "printButton",
    icon: "[SKIN]/RichTextEditor/print.png"
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
    showFocusOutline: true
});
isc.ToolStripButton.create({
    ID: "italics",
    icon: "[SKIN]/RichTextEditor/text_italic.png",
    actionType: "checkbox",
    showFocused: false,
    showFocusOutline: true
});
isc.ToolStripButton.create({
    ID: "underlined",
    icon: "[SKIN]/RichTextEditor/text_underline.png",
    actionType: "checkbox",
    showFocused: false,
    showFocusOutline: true
});

isc.ToolStrip.create({
    width: 30, height:160, 
    vertical: true,
    members: [ printButton, 
        "resizer", bold, italics, underlined, 
        "separator",
        alignLeft, alignRight, alignCenter
    ]
});
