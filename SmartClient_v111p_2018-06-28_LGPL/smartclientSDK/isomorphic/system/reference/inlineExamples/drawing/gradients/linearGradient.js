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
    width:  250,
    fields: [
        {name: "startColor", title: "Start Color",       type: "color",  defaultValue: "#FF6600"},
        {name: "stop1Color", title: "First Stop Color",  type: "color",  defaultValue: "#FFFF99", wrapTitle: false},
        {name: "stop2Color", title: "Second Stop Color", type: "color",  defaultValue: "#CCFFCC"},
        {name: "endColor",   title: "End Color",         type: "color",  defaultValue: "#33CCCC"},
    ],
    itemChanged : updateGradient
});

var slidersForm = isc.DynamicForm.create({
    ID:         "slidersForm",
    width:      290,
    titleWidth: 20,
    fields: [
        {name: "x1", type: "slider", defaultValue: 85, min: 0, max: 100, step: 1, height: 20},
        {name: "y1", type: "slider", defaultValue: 0, min: 0, max: 100, step: 1, height: 20},
        {name: "x2", type: "slider", defaultValue: 0, min: 0, max: 100, step: 1, height: 20},
        {name: "y2", type: "slider", defaultValue: 100, min: 0, max: 100, step: 1, height: 20}
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
    mainPane.removeGradient("myLinearGradient");

    var slidersFormValues = slidersForm.getValues(),
        dataFormValues = dataForm.getValues();

    var linearGradient = {
        id: "myLinearGradient",
        x1: slidersFormValues.x1 + "%",
        y1: slidersFormValues.y1 + "%",
        x2: slidersFormValues.x2 + "%",
        y2: slidersFormValues.y2 + "%",
        colorStops: [
            {color: dataFormValues.startColor, offset: 0.00},
            {color: dataFormValues.stop1Color, offset: 0.33},
            {color: dataFormValues.stop2Color, offset: 0.66},
            {color: dataFormValues.endColor,   offset: 1.00}
        ]
    };

    drawTriangle.setFillGradient(linearGradient);
    drawCurve.setFillGradient(linearGradient);
    drawOval.setFillGradient(linearGradient);
    drawRect.setFillGradient(linearGradient);
}

updateGradient();
