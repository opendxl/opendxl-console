var form = isc.DynamicForm.create({
    autoDraw: false,
    items: [{
        name: "search",
        title: "Search Term",
        width: 200,
        icons: [{
            name: "view",
            src: "[SKINIMG]actions/view.png",
            hspace: 5,
            inline: true,
            baseStyle: "roundedTextItemIcon",
            showRTL: true,
            tabIndex: -1
        }, {
            name: "clear",
            src: "[SKINIMG]actions/close.png",
            width: 10,
            height: 10,
            inline: true,
            prompt: "Clear this field",

            click : function (form, item, icon) {
                item.clearValue();
                item.focusInItem();
            }
        }],
        iconWidth: 16,
        iconHeight: 16
    }]
});

isc.VStack.create({
    width: "100%",
    members: [form]
});
