isc.Button.create({
    ID: "button1",
    autoFit: true,
    autoDraw: false,
    title: "Find Related",
    icon: "icons/16/find.png"
});

isc.IButton.create({
    ID: "button2",
    autoFit: true,
    autoDraw: false,
    title: "Search within results",
    icon: "icons/16/find.png"
});

isc.HStack.create({
    membersMargin: 20,
    height: 24,
    border: "1px solid blue",
    members: [ button1, button2 ]
});


isc.Button.create({
    title: "Change Title",
    top: 45,
    left: 60,
    click : function () {
        // have buttons exchange their titles
        var title1 = button1.getTitle();
        button1.setTitle(button2.getTitle());
        button2.setTitle(title1);
    }
});
    