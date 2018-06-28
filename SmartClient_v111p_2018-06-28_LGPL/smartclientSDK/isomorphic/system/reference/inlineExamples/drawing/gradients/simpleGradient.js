var mainPane = isc.DrawPane.create({
    showEdges: true,
    autoDraw:  true,
    ID:        "mainPane",
    width:     400,
    height:    400,
    overflow:  "hidden",
    cursor:    "auto"
});

DEFAULT_DIRECTION = 45;
var dataForm = isc.DynamicForm.create({
    ID:     "dataForm",
    width:  250,
    left:   420,
    fields: [
        {name: "startColor", title: "Start Color", type: "color",   defaultValue: "#33CCCC"},
        {name: "endColor",   title: "End Color",   type: "color",   defaultValue: "#3366FF"},
        {name: "direction",  title: "Direction",   type: "spinner", defaultValue: DEFAULT_DIRECTION,
            min: 0, max: 360, step: 1}
    ],
    itemChanged : updateGradient
});

var drawTriangle = isc.DrawTriangle.create({
    autoDraw: true,
    drawPane: mainPane,
    points: [[100, 50], [150, 150], [50, 150]]
});

var drawCurve = isc.DrawCurve.create({
    autoDraw: true,
    drawPane: mainPane,
    startPoint: [200, 50],
    endPoint: [340, 150],
    controlPoint1: [270, 0],
    controlPoint2: [270, 200]
});

var drawOval = isc.DrawOval.create({
    autoDraw: true,
    drawPane: mainPane,
    left: 50,
    top: 200,
    width: 100,
    height: 150
});

var drawRect = isc.DrawRect.create({
    autoDraw: true,
    drawPane: mainPane,
    left: 200,
    top: 225,
    width: 150,
    height: 100
});

function updateGradient() {
    mainPane.removeGradient("mySimpleGradient");

    var dataFormValues = dataForm.getValues();

    var simpleGradient = {
        id: "mySimpleGradient",
        direction: (dataFormValues.direction == null ? DEFAULT_DIRECTION : dataFormValues.direction),
        startColor: dataFormValues.startColor,
        endColor: dataFormValues.endColor
    };

    drawTriangle.setFillGradient(simpleGradient);
    drawCurve.setFillGradient(simpleGradient);
    drawOval.setFillGradient(simpleGradient);
    drawRect.setFillGradient(simpleGradient);
}

updateGradient();
