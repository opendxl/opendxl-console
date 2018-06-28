// variable-length name label and button control
isc.Label.create({
    ID: "nameLabel",
    width: 1,
    wrap: false,
    refreshTitle : function (longName) {
        var name = longName ? "Alejandro O'Reilly" : "Lucy Lu"; 
        this.setContents("<b>Candidate: " + name + "</b>");
    }
});

isc.AdaptiveMenu.create({
    ID: "adaptiveMenu",
    defaultLayoutAlign: "center",
    height:30,
    items: [
        {title: "Contact", click: "isc.say(this.title)"},
        {title: "Hire Now", click: "isc.say(this.title)"},
        {title: "View Résumé", click: "isc.say(this.title)"},
        {
            title: "Edit",
            showRollOver: false,
            embeddedComponent: isc.HStack.create({
                snapTo: "TR",
                height: "100%",
                width: 190,
                membersMargin: 3,
                layoutMarginBottom: 5,
                defaultLayoutAlign: "center",
                members: [
                    isc.IButton.create({title: "Cut", autoFit:true, click: "isc.say(this.title)"}),
                    isc.IButton.create({title: "Copy", autoFit:true, click: "isc.say(this.title)"}),
                    isc.IButton.create({title: "Paste", autoFit:true, click: "isc.say(this.title)"})
                ]
            }),
            embeddedComponentFields: ["key"]
        }
    ],
    menuProperties: {
        width: 350
    }
});

isc.Button.create({
    top: 50,
    refreshTitle : function (longName) {
        nameLabel.refreshTitle(longName);
        this.setTitle(longName ? "Shorter Name" : "Longer Name");
    },
    click : function () {
        this.longTitle = !this.longTitle;
        this.refreshTitle(this.longTitle);
    },
    initWidget : function () {
        this.Super("initWidget", arguments);
        this.refreshTitle();
    }
});

// parent Layouts
isc.ToolStrip.create({
    width: 375,
    membersMargin: 5,
    layoutLeftMargin: 10,
    ID: "toolStrip",
    showResizeBar: true,height:40,
    members: [nameLabel, "separator", adaptiveMenu]
});

isc.HLayout.create({
    height:40,
    width: "100%",
    hPolicy: "none",
    members: [toolStrip]
});
