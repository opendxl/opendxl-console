isc.HStack.create({
    ID: "hStack",
    height:50,
    membersMargin:10,
    autoDraw: false,
    members: [
        isc.IButton.create({
            ID: "touchButton",
            width: 120,
            title: "Touch This"
        }),
        isc.Label.create({
            height: 20,
            contents: "<a href='http://www.google.com' target='_blank'>Open Google</a>"
        })
    ]
});

isc.IButton.create({
    ID: "button",
    autoDraw: false,
    title: "Show Window",
    click : function () {
        touchButton.setTitle("Can't Touch This");
        modalWindow.show();
    }
});

isc.VLayout.create({
    defaultLayoutAlign: "center",
    members: [ hStack, button ]
});

isc.Window.create({
    ID: "modalWindow",
    title: "Modal Window",
    autoSize:true,
    autoCenter: true,
    isModal: true,
    showModalMask: true,
    autoDraw: false,
    closeClick : function () { touchButton.setTitle('Touch This'); this.Super("closeClick", arguments)},
    items: [
        isc.DynamicForm.create({
            autoDraw: false,
            height: 48,
            padding:4,
            fields: [
                {name: "field1", type: "select", valueMap: ["foo", "bar"]},
                {name: "field2", type: "date"},
                {type: "button", title: "Done",
                 click: "modalWindow.hide();touchButton.setTitle('Touch This')" }
            ]
        })
    ]
});
