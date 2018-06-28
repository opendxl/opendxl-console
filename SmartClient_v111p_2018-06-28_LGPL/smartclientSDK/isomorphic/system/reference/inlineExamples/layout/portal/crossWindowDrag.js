

isc.defineClass("Part", "Img").addProperties({
    width: 48,
    height: 48,
    padding: 12,
    layoutAlign: "center",
    appImgDir: "pieces/48/"
});

var portalLayout = isc.PortalLayout.create({
    ID: "portalLayout",
    width: "100%",
    height: "100%",
    numColumns: 3,
    columnProperties: {
        dropTypes: ["partPortlet"]
    },

    _srcMap: {
        "Blue": "pawn_blue.png",
        "Green": "pawn_green.png",
        "Yellow": "pawn_yellow.png"
    },
    createPortlet : function (portletName) {
        var src = this._srcMap[portletName];
        if (src == null) return null;
        return isc.Portlet.create({
            title: portletName,
            portletName: portletName,
            canDrag: true,
            dragType: "partPortlet",
            useNativeDrag: true,
            items: [
                isc.Part.create({ src: src })
            ],
            dragStart : function () {
                isc.EventHandler.setNativeDragData(portletName, portletName);
                isc.EventHandler.setDragTrackerImage("pieces/48/" + src, 28, 38);
            }
        });
    },

    getDropPortlet : function (dragTarget, colNum, rowNum, rowOffset) {
        if (isc.isA.Portlet(dragTarget)) return dragTarget;

        var portletName = isc.EventHandler.getNativeDragData();
        if (portletName != null) {
            return this.createPortlet(portletName);
        }
        return null;
    }
});

portalLayout.addPortlet(portalLayout.createPortlet("Blue"), 0);
portalLayout.addPortlet(portalLayout.createPortlet("Green"), 1);
portalLayout.addPortlet(portalLayout.createPortlet("Yellow"), 2);
