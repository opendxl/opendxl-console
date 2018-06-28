var defaultShadow = {
    blur: 10,
    color: "#00FFFF",
    offset: [1, 1]
};

var drawLabel = isc.DrawLabel.create({
    left: 115,
    top: 40,
    contents: "Some Text in a DrawLabel",
    shadow: defaultShadow
});

var drawRect = isc.DrawRect.create({
    left: 70,
    top: 120,
    width: 190,
    height: 90,
    shadow: defaultShadow
});

var drawLine = isc.DrawLine.create({
    startPoint: [40, 350],
    endPoint: [190, 280],
    startArrow: "open",
    endArrow: "open",
    shadow: defaultShadow
});

var drawOval = isc.DrawOval.create({
    left: 250,
    top: 250,
    rx: 50,
    ry: 50,
    shadow: defaultShadow
});

var drawItems = [drawLabel, drawRect, drawLine, drawOval];
var mainPane = isc.DrawPane.create({
    autoDraw: false,
    showEdges: true,
    width: 400,
    height: 400,
    drawItems: drawItems
});

function updateShadows() {
    var configValues = configForm.getValues(),
        shadow;
    if (!configValues.showShadows) {
        shadow = null;
    } else {
        shadow = {
            blur: configValues.blur,
            color: configValues.color,
            offset: [configValues.offsetX, configValues.offsetY]
        };
    }
    drawItems.callMethod("setShadow", shadow);
}

var configForm = isc.DynamicForm.create({
    width: 400,
    colWidths: [150, "*"],
    items: [{
        name: "showShadows",
        title: "Show Shadows?",
        editorType: "CheckboxItem",
        labelAsTitle: true,
        defaultValue: defaultShadow != null,
        changed : function () {
            updateShadows();
        }
    }, {
        name: "blur",
        title: "Blur",
        editorType: "SliderItem",
        minValue: 0,
        maxValue: 20,
        defaultValue: defaultShadow && defaultShadow.blur,
        changed : function () {
            updateShadows();
        }
    }, {
        name: "color",
        title: "Color",
        editorType: "ColorItem",
        defaultValue: defaultShadow && defaultShadow.color,
        changed : function () {
            updateShadows();
        }
    }, {
        name: "offsetX",
        title: "X Offset",
        editorType: "SliderItem",
        minValue: -5,
        maxValue: 5,
        defaultValue: defaultShadow && defaultShadow.offset[0],
        changed : function () {
            updateShadows();
        }
    }, {
        name: "offsetY",
        title: "Y Offset",
        editorType: "SliderItem",
        minValue: -5,
        maxValue: 5,
        defaultValue: defaultShadow && defaultShadow.offset[1],
        changed : function () {
            updateShadows();
        }
    }]
});

isc.HStack.create({
    width: "100%",
    members: [mainPane, configForm]
});
