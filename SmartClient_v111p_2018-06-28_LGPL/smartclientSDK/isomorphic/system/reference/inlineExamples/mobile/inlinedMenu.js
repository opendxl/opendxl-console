// define and instantiate the adaptive-width InlinedMenu
isc.defineClass("InlinedMenu", "HLayout").addProperties({

    overflow: "hidden",
    canAdaptWidth: true,
    defaultLayoutAlign: "center",
    height:30,
    initWidget : function () {
        this.Super("initWidget", arguments);

        var menu = this.menu;
        menu._inlinedData = [];
        this.inlinedCount = 0;

        // add buttons to represent inlined menu items
        for (var i = 0; i < menu.getTotalRows(); i++) {
            var item = menu.getRecord(i);
            this.addMember(isc.ToolStripButton.create({
                contents: item.title, width: 1,
                wrap: false, visibility: "hidden"
            }, item));
        }
        this.inlinedMax = this.members.length;

        // add a menu button to show non-inlined items
        this.menuButton = isc.ToolStripMenuButton.create({
            menu: menu, title: null, width: 1,
            overflow: "visible", autoDraw: false
        });
        this.addMember(this.menuButton);
    },

    // get width of the next item to be inlined, by drawing it if needed
    getNextInlinedItemWidth : function () {
        var item = this.members[this.inlinedCount];
        if (!item.isDrawn()) item.draw();
                                              
        var isLast = this.inlinedCount == this.inlinedMax - 1;
        return item.getVisibleWidth() + (isLast ? -this.minimalWidth : 0);
    },
    
    // add an  inlined item - hide menu button if appropriate
    addInlinedItem : function () {
        var menu = this.menu;
        menu._inlinedData.add(menu.data.removeAt(0));
        if (menu.getTotalRows() == 0) this.menuButton.hide();

        this.members[this.inlinedCount++].show();
    },

    // remove an inlined item - show menu button if appropriate
    removeInlinedItem : function () {
        var menu = this.menu;
        if (menu.getTotalRows() == 0) this.menuButton.show();
        menu.data.addAt(menu._inlinedData.pop(), 0);

        this.members[--this.inlinedCount].hide();
    },

    adaptWidthBy: function (pixelDifference, unadaptedWidth) {
        var items = this.inlinedItems;

        // set the minimal width
        if (this.minimalWidth == null) {
            this.minimalWidth = this.menuButton.getVisibleWidth();
        }

        // all non-hidden children are drawn; expected width is sum of their widths
        var expectedWidth = 0;
        for (var i = 0; i < this.members.length; i++) {
            var member = this.members[i];
            if (member.visibility == "hidden") continue;
            expectedWidth += member.getVisibleWidth();
        }

        // calculate desired width based on overflow/surplus and unadapted width;
        // if desired width differs from the expected, add/remove inlined items
        var desiredWidth = unadaptedWidth + pixelDifference;
        if (desiredWidth < expectedWidth) {
            // remove inlined items if we have an overflow
            while (this.inlinedCount > 0 && expectedWidth > desiredWidth) 
            {
                this.removeInlinedItem();
                expectedWidth -= this.getNextInlinedItemWidth();
            }
        } else if (desiredWidth > expectedWidth) {
            var deltaX;
            // add inlined items if we have surplus space
            while (this.inlinedCount < this.inlinedMax && 
                   expectedWidth + (deltaX = this.getNextInlinedItemWidth()) <= desiredWidth)
            {
                this.addInlinedItem();
                expectedWidth += deltaX;
            }
        }
        return expectedWidth - unadaptedWidth;
    }
});

// variable-length name label and button control
isc.Label.create({
    ID: "variableName",
    width: 1,
    wrap: false,
    refreshTitle : function (longName) {
        var name = longName ? "Alejandro O'Reilly" : "Lucy Lu"; 
        this.setContents("<b>Candidate: " + name + "</b>");
    }
});
isc.Button.create({
    top: 50,
    refreshTitle : function (longName) {
        variableName.refreshTitle(longName);
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


// create the adaptive-width menu
isc.Menu.create({
    ID: "menu",
    data: [
        {title: "Contact", click: "isc.say(this.title)"},
        {title: "Hire Now", click: "isc.say(this.title)"},
        {title: "View Résumé", click: "isc.say(this.title)"}
    ]
});
isc.InlinedMenu.create({
    ID: "inlinedMenu", menu: menu
});

// parent Layouts
isc.ToolStrip.create({
    width: 375,
    membersMargin: 5,
    layoutLeftMargin: 10,
    ID: "toolStrip",
    showResizeBar: true,height: 40,
    members: [variableName, "separator", inlinedMenu]
});

isc.HLayout.create({
    height: 40,
    width: "100%",
    hPolicy: "none",
    members: [toolStrip]
});
