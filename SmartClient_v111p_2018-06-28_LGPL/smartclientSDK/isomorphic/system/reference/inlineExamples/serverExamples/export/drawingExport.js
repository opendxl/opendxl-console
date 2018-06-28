var mainPane = isc.DrawPane.create({
    autoDraw: false,
    showEdges: true,
    width: 400,
    height: 400,
    canDrag: true
});

var rg = mainPane.createRadialGradient("rg", { 
    cx: 0,
    cy: 0,
    r: "90%",
    fx: 0,
    fy: 0,
    colorStops: [
        {color: "teal", offset: 0.0},
        {color: "#ffff00", offset: 0.3},
        {color: "#00ff00", offset: 0.8},
        {color: "#0000ff", offset: 1.0}
    ]
});

var lg = mainPane.createLinearGradient("lg", { 
    x1: "51%", 
    y1: "32%", 
    x2: "80%", 
    y2: "80%",
    colorStops: [
        {color: "#ff0000", offset: 0.00},
        {color: "#ffff00", offset: 0.33},
        {color: "#00ff00", offset: 0.66},
        {color: "#0000ff", offset: 1.00}
    ]
});

isc.DrawOval.create({
    drawPane: mainPane,
    fillGradient: rg,
    left: 50,
    top: 200,
    width: 100,
    height: 150,
    canDrag: true
});

isc.DrawImage.create({
    drawPane: mainPane,
    left: 50,
    top: 10,
    src: "/isomorphic/system/reference/inlineExamples/tiles/images/Elephant.jpg",
    width: 120,
    height: 100,
    canDrag: true
});

isc.DrawTriangle.create({
    drawPane: mainPane,
    points: [[180, 250], [150, 150], [375, 100]],
    lineColor: "#ff8000",
    fillColor: "#ffff00",
    canDrag: true
});

isc.DrawCurve.create({
    drawPane: mainPane,
    startPoint: [200, 50],
    endPoint: [300, 150],
    controlPoint1: [250, 0],
    controlPoint2: [250, 200],
    canDrag: true
});

isc.DrawRect.create({
    drawPane: mainPane,
    fillGradient: lg,
    left: 200,
    top: 270,
    width: 150,
    height: 100,
    canDrag: true
});

var form = isc.DynamicForm.create({
    autoDraw: false,
    topPadding: 5,
    width: 300,
    numCols: 2,
    items: [{
        name: "format",
        type: "select",
        title: "Export format",
        wrapTitle: false,
        valueMap: {
            "png": "PNG",
            "jpeg": "JPEG",
            "pdf": "PDF"
        },
        required: true,
        defaultValue: "png",

        changed : function (form, item, value) {
            var format = value;

            var qualityItem = form.getItem("quality");
            if (format == "jpeg") qualityItem.show();
            else qualityItem.hide();

            form.getItem("_saveButton").setTitle(format == "pdf" ? "Save" : "Save Image");
        }
    }, {
        name: "quality",
        type: "integer",
        title: "JPEG quality",
        editorType: "SliderItem",
        minValue: 0,
        maxValue: 100,
        numValues: 21,
        defaultValue: 80,
        showIf: "form.getValue('format') == 'jpeg'",
        titleVAlign: "top",
        colSpan: 2,
        height: 50,
        required: true
    }, {
        name: "_saveButton",
        title: "Save",
        type: "button",

        click : function (form) {
            var format = form.getValue("format");
            if (format == "pdf") {
                isc.RPCManager.exportContent(mainPane, {
                    exportDisplay: "download",
                    exportFilename: "masterpiece"
                });
            } else {
                isc.RPCManager.exportImage(mainPane.getSvgString(), {
                    exportDisplay: "download",
                    exportImageFormat: format,
                    exportImageQuality: form.getValue("quality")/100,
                    exportFilename: "masterpiece"
                });
            }
        }
    }]
});

var layout = isc.HLayout.create({
    membersMargin: 20,
    members: [mainPane, form]
});
