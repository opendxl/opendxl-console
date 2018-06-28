isc.defineClass("DragPiece", "Img").addProperties({
    width: 48,
    height: 48,
    padding: 12,
    layoutAlign: "center",
    canDragReposition: true,
    canDrop: true,
    dragAppearance: "target",
    appImgDir: "pieces/48/"
})

var eventsForm = isc.DynamicForm.create({
    ID: "eventsForm",
    width: "100%",
    height: 250,
    titleWidth: 50,
    numCols: 1,
    fields: [
        {title:"Events", type:"textArea", name: "eventsArea", value: "", width: "*", height: "*", titleOrientation: "top"}
    ]
});

var itemsStack = isc.VStack.create({
    ID: "itemsStack",
    membersMargin: 10,
    layoutMargin: 10,
    showEdges: true,
    members: [
        isc.DragPiece.create({src:"pawn_blue.png"}),
        isc.DragPiece.create({src:"pawn_green.png"}),
        isc.DragPiece.create({src:"pawn_yellow.png"})
    ]
});

var portal = isc.PortalLayout.create({
    ID: "portal",
    width: "70%",
    height: "100%",
    canResizePortlets: true,
    portlets: [
        [ // Array for left column
            isc.Portlet.create({
                title: "Portlet 1"
            }),
            [ // Array for a row
                isc.Portlet.create({
                    title: "Portlet 2"
                }),
                isc.Portlet.create({
                    title: "Portlet 3"
                })
            ]
        ],[ // Array for right column
            [
                isc.Portlet.create({
                    title: 'Portlet 4'
                }),
                isc.Portlet.create({
                    title: 'Portlet 5'
                })
            ],
            isc.Portlet.create({
                title: 'Portlet 6'
            })
        ]
    ],
    portletMaximized : function (portlet) {
        var message = "portlet maximized: " + portlet.title + "\n";
        eventsForm.setValue("eventsArea", eventsForm.getValue("eventsArea") + message);
    },
    portletMinimized : function (portlet) {
        var message = "portlet minimized: " + portlet.title + "\n";
        eventsForm.setValue("eventsArea", eventsForm.getValue("eventsArea") + message);
    },
    portletRestored : function (portlet) {
        var message = "portlet restored: " + portlet.title + "\n";
        eventsForm.setValue("eventsArea", eventsForm.getValue("eventsArea") + message);
    },
    portletsChanged : function () {
        var message = "portlets changed";
        if (this.fromColNum) {
            if (isc.Portlet.isA(this.dragTarget)) {
                message += "\ndrag from " + this.fromColNum + "," + this.fromRowNum;
                if (this.fromDropPosition) {
                    message += "," + this.fromDropPosition;
                }
                message += " to " + this.toColNum + "," + this.toRowNum;
                if (this.toDropPosition) {
                    message += "," + this.toDropPosition;
                }
            } else {
                message += "\nnew portlet at " + this.toColNum + "," + this.toRowNum;
            }
            delete this.fromColNum;
            delete this.fromRowNum;
            delete this.fromDropPosition;
            delete this.dragTarget;
            delete this.toColNum;
            delete this.toRowNum;
            delete this.toDropPosition;
        }
        message += "\n";
        eventsForm.setValue("eventsArea", eventsForm.getValue("eventsArea") + message);
    },
    portletsResized : function () {
        var message = "portlets resized\n";
        eventsForm.setValue("eventsArea", eventsForm.getValue("eventsArea") + message);
    },
    willClosePortlet : function (portlet) {
        var message = "portlet about to close: " + portlet.title + "\n";
        eventsForm.setValue("eventsArea", eventsForm.getValue("eventsArea") + message);
        return true;
    },
    dropOver: function () {
        var message = "drop over\n";
        eventsForm.setValue("eventsArea", eventsForm.getValue("eventsArea") + message);
    },
    willAcceptPortletDrop : function (dragTarget, colNum, rowNum, dropPosition) {
        if (!this.fromColNum) {
            this.fromColNum = colNum;
            this.fromRowNum = rowNum;
            this.fromDropPosition = dropPosition;
            this.dragTarget = dragTarget;
        }
        if (this.toColNum != colNum || this.toRowNum != rowNum || this.toDropPosition != dropPosition) {
            this.toColNum = colNum;
            this.toRowNum = rowNum;
            this.toDropPosition = dropPosition;
        }
        return true;
    }
});

isc.HLayout.create({
    width: "100%",
    height: "100%",
    overflow: "hidden",
    members: [
        portal, 
        isc.VLayout.create({
            width: "*",
            members: [
                itemsStack, eventsForm      
            ]
        })
    ]
});
