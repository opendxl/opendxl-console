var mainPane = isc.DrawPane.create({
    showEdges: true,
    autoDraw:  true,
    ID:        "mainPane",
    width:     400,
    height:    400,
    overflow:  "hidden",
    cursor:    "auto"
});

var dataForm = isc.DynamicForm.create({
    ID:     "dataForm",
    width:  270,
    fields: [
        {name: "startColor", title: "Start Color",       type: "color",  defaultValue: "#ff0000"},
        {name: "stop1Color", title: "First Stop Color",  type: "color",  defaultValue: "#ffff00", wrapTitle: false},
        {name: "stop2Color", title: "Second Stop Color", type: "color",  defaultValue: "#00ff00"},
        {name: "endColor",   title: "End Color",         type: "color",  defaultValue: "#0000ff"},
    ],
    itemChanged : updateGradient
});

var slidersForm = isc.DynamicForm.create({
    ID:         "slidersForm",
    width:      290,
    titleWidth: 20,
    fields: [
        {name: "r", type: "slider", defaultValue: 100, min: 0, max: 100, step: 1, height: 20}
    ],
    itemChanged : updateGradient
});

isc.VStack.create({
    ID: "vStack",
    membersMargin: 15,
    members: [ dataForm, slidersForm ]
});

isc.HStack.create({
    membersMargin: 20,
    members: [ mainPane, vStack ]
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
    mainPane.removeGradient("myRadialGradient");

    var dataFormValues = dataForm.getValues();

    var radialGradient = {
        id: "myRadialGradient",
        cx: 0,
        cy: 0,
        r: slidersForm.getValues().r + "%",
        fx: 0,
        fy: 0,
        colorStops: [
            {color: dataFormValues.startColor, offset: 0.00},
            {color: dataFormValues.stop1Color, offset: 0.33},
            {color: dataFormValues.stop2Color, offset: 0.66},
            {color: dataFormValues.endColor,   offset: 1.00}
        ]
    };

    drawTriangle.setFillGradient(radialGradient);
    drawCurve.setFillGradient(radialGradient);
    drawOval.setFillGradient(radialGradient);
    drawRect.setFillGradient(radialGradient);
}

updateGradient();
