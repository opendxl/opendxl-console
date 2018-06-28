isc.ImgButton.create({
    ID: "alignLeft",
    size: 24,
    src: "icons/24/text_align_left.png",
    showRollOver: false,
    showFocused: false,
    actionType: "radio",
    radioGroup: "textAlign"
});
isc.ImgButton.create({
    ID: "alignRight",
    size: 24,
    src: "icons/24/text_align_right.png",
    showRollOver: false,
    showFocused: false,
    actionType: "radio",
    radioGroup: "textAlign"
});
isc.ImgButton.create({
    ID: "alignCenter",
    size: 24,
    src: "icons/24/text_align_center.png",
    showRollOver: false,
    showFocused: false,
    actionType: "radio",
    radioGroup: "textAlign"
});
isc.ImgButton.create({
    ID: "bold",
    size: 24,
    src: "icons/24/text_bold.png",
    showRollOver: false,
    showFocused: false,
    actionType: "checkbox"
});
isc.ImgButton.create({
    ID: "italics",
    size: 24,
    src: "icons/24/text_italics.png",
    showRollOver: false,
    showFocused: false,
    actionType: "checkbox"
});
isc.ImgButton.create({
    ID: "underlined",
    size: 24,
    src: "icons/24/text_underlined.png",
    showRollOver: false,
    showFocused: false,
    actionType: "checkbox"
});


isc.ToolStrip.create({
    width: 140,
    members: [bold, italics, underlined, alignLeft, alignRight, alignCenter]
});
