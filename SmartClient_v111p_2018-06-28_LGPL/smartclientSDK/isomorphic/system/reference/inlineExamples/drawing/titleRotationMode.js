var mainPane = isc.DrawPane.create({
    autoDraw: false,
    showEdges: true,
    width: 720,
    height: 220
});
var mainItems = [];

var configForm = isc.DynamicForm.create({
    autoDraw: false,
    width: 500,
    colWidths: [150, "*"],
    items: [{
        name: "titleRotationMode",
        title: "Title Rotation Mode",
        editorType: "SelectItem",
        valueMap: ["neverRotate", "withItem", "withItemAlwaysUp", "withLine", "withLineAlwaysUp"],
        defaultValue: "neverRotate",
        changed : function (configForm, self, value) {
            createItems();
        }
    }, {
        name: "rotation",
        title: "Rotate Shapes",
        editorType: "SliderItem",
        minValue: 0,
        maxValue: 360,
        numValues: 361,
        defaultValue: 0,
        changed : function (configForm, self, value) {
            mainItems.callMethod("rotateTo", value);
        }
    }]
});

function createItems() {
    mainPane.destroyItems();

    var commonProps = {
        autoDraw: true,
        drawPane: mainPane,
        canDrag: false,
        titleRotationMode: configForm.getValue("titleRotationMode")
    };

    var drawTriangle = isc.DrawTriangle.create({
        points: [[100,50], [150,150], [50,150]],
        title: "Triangle"
    }, commonProps);

    var drawCurve = isc.DrawCurve.create({
        startPoint: [225, 50],
        endPoint: [325, 150],
        controlPoint1: [275, 0],
        controlPoint2: [275, 200],
        lineCap: "round",
        title: "Curve"
    }, commonProps);

    var drawLinePath = isc.DrawLinePath.create({
        startPoint: [495, 150],
        endPoint: [395, 50],
        title: "LinePath"
    }, commonProps);

    var drawLine = isc.DrawLine.create({
        startPoint: [550, 50],
        endPoint: [650, 150],
        endArrow: "block",
        title: "Line"
    }, commonProps);

    mainItems = [drawTriangle, drawCurve, drawLinePath, drawLine];
    mainItems.callMethod("rotateTo", configForm.getValue("rotation"));
}

createItems();

isc.VStack.create({
    width: "100%",
    members: [mainPane, configForm],
    membersMargin: 10
});
