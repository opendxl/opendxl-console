var mainPane = isc.DrawPane.create({
    autoDraw: false,
    showEdges: true,
    autoDraw: true,
    top: 70,
    width: 400,
    height: 400,
    backgroundColor: "#ffefd5",
    drawingWidth: 600,
    drawingHeight: 600,
    translate: [10, 10],
    canDragScroll: true,
    zoomLevel: 1.5
});

isc.DrawLine.create({
    autoDraw: true,
    drawPane: mainPane,
    startPont: [0, 0],
    endPoint: [100, 0],
    lineWidth: 1,
    lineColor: "#ff0000",
    endArrow: "open"
});
isc.DrawLabel.create({
    autoDraw: true,
    drawPane: mainPane,
    left: 110,
    top: 10,
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "normal",
    lineColor: "#ff0000",
    contents: "X"
});
isc.DrawLine.create({
    autoDraw: true,
    drawPane: mainPane,
    startPont: [0, 0],
    endPoint: [0, 100],
    lineWidth: 1,
    lineColor: "#ff0000",
    endArrow: "open"
});
isc.DrawLabel.create({
    autoDraw: true,
    drawPane: mainPane,
    left: 10,
    top: 110,
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "normal",
    lineColor: "#ff0000",
    contents: "Y"
});
isc.DrawOval.create({
    autoDraw: true,
    drawPane: mainPane,
    centerPoint: [0, 0],
    radius: 4,
    fillColor: "#ff0000",
    lineColor: null
});
isc.DrawLabel.create({
    autoDraw: true,
    drawPane: mainPane,
    left: 5,
    top: 5,
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "normal",
    lineColor: "#ff0000",
    contents: "(0, 0)"
});

isc.DrawTriangle.create({
    autoDraw: true,
    drawPane: mainPane,
    points: [[140, 80], [100, 210], [40, 40]],
    rotation: 0
});

isc.DrawCurve.create({
    autoDraw: true,
    drawPane: mainPane,
    startPoint: [155, 45],
    endPoint: [320, 140],
    controlPoint1: [340, 60],
    controlPoint2: [160, 250]
});

isc.DrawLinePath.create({
    autoDraw: true,
    drawPane: mainPane,
    startPoint: [330, 200],
    endPoint: [540, 280]
});

isc.DrawPath.create({
    autoDraw: true,
    drawPane: mainPane,
    points:   [[320, 90],
              [360, 30],
              [480, 70],
              [480, 20],
              [560, 100],
              [400, 120],
              [520, 160],
              [580, 230]]
});

isc.DrawOval.create({
    autoDraw: true,
    drawPane: mainPane,
    left: 30,
    top: 420,
    width: 250,
    height: 140
});

isc.DrawRect.create({
    autoDraw: true,
    drawPane: mainPane,
    left: 50,
    top: 240,
    width: 200,
    height: 80,
    rotation: -30
});

isc.DrawLine.create({
    autoDraw: true,
    drawPane: mainPane,
    startPoint: [280, 320],
    endPoint: [540, 360]
});

isc.DrawSector.create({
    autoDraw: true,
    drawPane: mainPane,
    centerPoint: [400, 580],
    startAngle: 0,
    endAngle: 90,
    radius: 175,
    rotation: -120
});

var zoomSlider = isc.Slider.create({
    autoDraw: false,
    minValue: 0.10,
    maxValue: 3.00,
    value: mainPane.zoomLevel,
    numValues: 300,
    roundValues: false,
    roundPrecision: 2,
    width: 400,
    title: "Zoom Shapes",
    labelWidth: 110,
    vertical: false,
    valueChanged : function (value) {
        mainPane.zoom(value);
    }
});

var paneRotationSlider = isc.Slider.create({
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
    members: [mainPane, zoomSlider, paneRotationSlider]
});
