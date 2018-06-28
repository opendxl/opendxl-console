var isRTL = isc.Page.isRTL();

var adaptiveButton = isc.Button.create({
    autoDraw: false,
    width: 140,
    canAdaptWidth: true,
    height: "100%",
    title: "Find Related",
    icon: "icons/16/find.png",
    customState: isRTL ? "RTL" : null,
    showFocusedAsOver: false,
    click : function () {
        var q = form.getValue("q");
        if (q) {
            isc.say("This is when the logic to search for <q>" + q.asHTML() + "</q> would run&hellip;");
        }
    }
});

var form = isc.DynamicForm.create({
    width: "*",
    minWidth: 200,
    height: "100%",
    overflow: "hidden",
    numCols: 1,
    cellPadding: 0,
    items: [{
        name: "q",
        showTitle: false,
        width: "100%",
        height: "100%",
        hint: "Related search terms",
        showHintInField: true
    }]
});

var layout = isc.HLayout.create({
    autoDraw: false,
    width: "100%",
    minWidth: 250,
    height: "100%",
    overflow: "hidden",
    layoutRightMargin: isRTL ? 0 : 6,
    layoutLeftMargin: isRTL ? 6 : 0,
    members: [adaptiveButton, form],
    showResizeBar: true
});

isc.HLayout.create({
    width: "100%",
    height: 36,
    overflow: "hidden",
    members: [layout, isc.LayoutSpacer.create({ width: "*" })],
    resizeBarProperties: {
        canCollapse: false
    }
});
