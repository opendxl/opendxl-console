isc.Menu.create({
    ID: "menu",
    autoDraw: false,
    showShadow: true,
    width: 505,
    height: 440,
    data: [
        {
            title: "New tab",
            keyTitle: "Ctrl+T"
        },
        {
            title: "New window",
            keyTitle: "Ctrl+N"
        },
        {
            isSeparator: true
        },
        {
            title: "Edit",
            showRollOver: false,
            embeddedComponent: isc.HStack.create({
                autoDraw: false,
                height: "100%",
                snapTo: "TR",
                membersMargin: 3,
                layoutRightMargin: 3,
                defaultLayoutAlign: "center",
                members: [
                    isc.IButton.create({title: "Cut", width: 63}),
                    isc.IButton.create({title: "Copy", width: 63}),
                    isc.IButton.create({title: "Paste", width: 63})
                ]
            }),
            embeddedComponentFields: ["key"]
        },
        {
            isSeparator: true
        },
        {
            title: "Add bookmark",
            showRollOver: false,
            click: function() {
                bookmarkForm.focusInItem("bookmarkTitle");
            },
            embeddedComponent: isc.HStack.create({
                autoDraw: false,
                height: "100%",
                snapTo: "TR",
                membersMargin: 3,
                defaultLayoutAlign: "center",
                members: [
                    isc.Canvas.create({
                        ID: "colorBox",
                        width: 22,
                        height: 22
                    }),
                    isc.DynamicForm.create({
                        ID: "bookmarkForm",
                        width: 200,
                        height: "*",
                        snapTo: "TR",
                        fields: [
                            {
                                width: 200,
                                showTitle: false,
                                name: "bookmarkTitle",
                                type: "text",
                                defaultValue: "SmartClient Feature Explorer"
                            }
                        ]
                    }),
                    isc.IButton.create({
                        title: "Add",
                        width: 50,
                        click: function() {
                            menu.hide();
                        }
                    })
                ]
            }),
            embeddedComponentFields: ["key"]
        },
        {
            isSeparator: true
        },
        {
            showRollOver: false,
            embeddedComponent: isc.ColorPicker.create({
                snapTo: "TR",
                styleName: "",
                bodyStyle: "",
                marginLeft: 20,
                border: "0",
                showShadow: false,
                defaultPickMode: "complex",
                showHeader: false,
                showFooter: false,
                showEdges: false,
                showOkButton: false,
                showModeToggleButton: false,
                showCancelButton: false,
                canDragReposition: false,
                autoHide: false,
                colorChanged: function() {
                    colorBox.setBackgroundColor(this.getHtmlColor());
                }
            }),
            embeddedComponentFields: ["key"]
        }
    ]
});

var menuButton = isc.MenuButton.create({
    ID: "menuButton",
    autoDraw: false,
    title: "Menu",
    width: 100,
    menu: menu
});

isc.HStack.create({
    width: "100%",
    members: [menuButton]
});
