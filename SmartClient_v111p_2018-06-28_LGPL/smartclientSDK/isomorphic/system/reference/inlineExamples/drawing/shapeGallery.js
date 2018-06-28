var mainPane = isc.DrawPane.create({
    autoDraw: false,
    showEdges: true,
    width: 720,
    height: 475
});

var commonProps = {
    autoDraw: true,
    drawPane: mainPane,
    canDrag: true,
    titleRotationMode: "neverRotate"
};

isc.DrawTriangle.create({
    points: [[100,50], [150,150], [50,150]],
    title: "Triangle"
}, commonProps);

isc.DrawCurve.create({
    startPoint: [200, 50],
    endPoint: [300, 150],
    controlPoint1: [250, 0],
    controlPoint2: [250, 200],
    lineCap: "round",
    title: "Curve"
}, commonProps);

isc.DrawLinePath.create({
    startPoint: [350, 50],
    endPoint: [450, 150],
    title: "LinePath"
}, commonProps);

isc.DrawPath.create({
    points: [[500, 50], [525,50], [550,75], [575,75],
             [600,75], [600,125], [575,125], [550,125],
             [525,150], [500,150]],
    title: "Path"
}, commonProps);

isc.DrawOval.create({
    left: 50,
    top: 300,
    width: 100,
    height: 100,
    title: "Oval"
}, commonProps);

isc.DrawRect.create({
    left: 200,
    top: 300,
    width: 150,
    height: 100,
    title: "Rectangle"
}, commonProps);

isc.DrawLine.create({
    startPoint: [400, 300],
    endPoint: [500,400],
    title: "Line"
}, commonProps);

isc.DrawSector.create({
    centerPoint: [550, 300],
    startAngle: 0,
    endAngle: 90,
    radius: 100,
    title: "Sector"
}, commonProps);


isc.HStack.create({
    width: "100%",
    members: [mainPane]
});
