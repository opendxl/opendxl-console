var mainPane = isc.DrawPane.create({
    showEdges: true,
    autoDraw:  false,
    ID:        "mainPane",
    width: 720,
    height: 475,
    overflow:  "hidden"
});

var commonProps = {
    autoDraw: true,
    drawPane: mainPane,
    canDrag: true,
    titleRotationMode: "withItem",
};

var drawTriangle = isc.DrawTriangle.create({
    ID: "drawTriangle",
    points: [[100,50], [150,150], [50,150]],
    title: "Triangle"
}, commonProps);

var drawCurve = isc.DrawCurve.create({
    ID: "drawCurve",
    startPoint: [200, 50],
    endPoint: [300, 150],
    controlPoint1: [250, 0],
    controlPoint2: [250, 200],
    title: "Curve"
}, commonProps);

var drawLinePath = isc.DrawLinePath.create({
    ID: "drawLinePath",
    startPoint: [350, 50],
    endPoint: [450, 150],
    title: "LinePath"
}, commonProps);

var drawPolygon = isc.DrawPolygon.create({
    ID: "drawPolygon",
    points: [[500, 50], [525,50], [550,75], [575,75],
             [600,75], [600,125], [575,125], [550,125],
             [525,150], [500,150]],
    title: "Polygon"
}, commonProps);

var drawOval = isc.DrawOval.create({
    ID: "drawOval",
    left: 50,
    top: 300,
    width: 100,
    height: 100,
    title: "Oval"
}, commonProps);

var drawRect = isc.DrawRect.create({
    ID: "drawRect",
    left: 200,
    top: 300,
    width: 150,
    height: 100,
    title: "Rect"
}, commonProps);

var drawLine = isc.DrawLine.create({
    ID: "drawLine",
    startPoint: [400, 300],
    endPoint: [500,400],
    title: "Line"
}, commonProps);

var shapesRotation = isc.Slider.create({
    ID:            "shapesRotation",
    autoDraw:      false,
    minValue:      0,
    maxValue:      360,
    numValues:     361,
    width:         400,
    value:         0,
    title:         "Rotate Shapes",
    labelWidth:    110,
    vertical:      false,
    valueChanged : function (value) {
        drawTriangle.rotateTo(value);
        drawCurve.rotateTo(value);
        drawLinePath.rotateTo(value);
        drawPolygon.rotateTo(value);
        drawOval.rotateTo(value);
        drawRect.rotateTo(value);
        drawLine.rotateTo(value);
    }
});

var paneRotation = isc.Slider.create({
    ID:            "paneRotation",
    autoDraw:      false,
    minValue:      0,
    maxValue:      360,
    numValues:     361,
    width:         400,
    value:         ((mainPane.rotation % 360) + 360) % 360,
    title:         "Rotate Pane",
    labelWidth:    110,
    vertical:      false,
    valueChanged : function (value) {
        mainPane.rotate(value);
    }
});

isc.VStack.create({
    width: "100%",
    membersMargin: 15,
    members: [mainPane, shapesRotation, paneRotation]
});
