// In this sample, a DrawPane is created to hold each of nine different types
// of DrawItems:  DrawLine, DrawRect, DrawOval, DrawTriangle, DrawCurve,
// DrawShape, DrawLinePath, DrawImage, and DrawLabel.  For each item a
// DynamicForm is created with checkboxes to toggle the control knobs available
// to the item.

// The nine DrawPanes will all have the same configuration defined in the
// following class:
isc.defineClass("DemoDrawPane", "DrawPane").addProperties({
    autoDraw: false,
    margin: 2,
    width: "100%",
    height: "*",
    border: "1px solid #f0f0f0",
    overflow: "hidden"
});

// The nine forms will be instances of the following DemoForm class.  It
// creates a checkbox for each KnobType and handles calling DrawItme.showKnobs()
// and hideKnobs() when the checkboxes are toggled.
isc.defineClass("DemoForm", "DynamicForm").addProperties({

    addPropertiesOnCreate: false,
    init : function (drawItem, knobTypes) {
        var numKnobTypes = knobTypes.length,
            items = this.items = new Array(numKnobTypes),
            initialValues = this.values = {};

        this.numCols = numKnobTypes;

        // Create a checkbox for each KnobType that shows/hides that type of
        // control knob.
        for (var i = 0; i < numKnobTypes; i++) {
            var knobType = knobTypes[i];

            items[i] = {
                editorType: "CheckboxItem",
                name: knobType,
                title: knobType,
                showTitle: false,
                changed : function (form, item, value) {
                    var drawItem = form.drawItem,
                        // The KnobType controlled by this checkbox was used
                        // for the name.
                        knob = item.name;
                    drawItem[value ? "showKnobs" : "hideKnobs"].call(drawItem, knob);
                }
            };

            // Initially check the checkbox if the DrawItem is showing this
            // type of control knob.
            initialValues[knobType] = (
                drawItem.knobs != null &&
                drawItem.knobs.contains(knobType));
        }

        // Save the DrawItem with this form so that it may be referenced from within
        // the changed() method of the checkboxes.
        this.drawItem = drawItem;

        this.Super("init", arguments);
    }
});

// The nine DrawPanes and accompanying DynamicForms will be placed in their own
// section of a SectionStack.  This method generates these sections.
var createSection = function (drawItem, expanded, knobTypes) {

    var title = drawItem.getClassName(),
        drawPane = drawItem.drawPane,
        knobsForm = isc.DemoForm.create(drawItem, knobTypes);

    // Place a slider at the bottom of each section to control the rotation of
    // the DrawItem.
    var minValue = 0, maxValue = 360, numValues = 361,
        rotationSlider = isc.Slider.create({
        vertical: false,
        value: 0,
        minValue: minValue,
        maxValue: maxValue,
        numValues: numValues,
        showValue: false,
        width: 300,
        height: 50,
        title: "Rotation",

        previousValue: 0,
        drawItem: drawItem,
        valueChanged : function (value) {
            this.drawItem.rotateBy(value - this.previousValue);
            this.previousValue = value;
        }
    });

    return {
        title: title,
        expanded: expanded,
        controls: [knobsForm],
        items: [
            isc.VLayout.create({
                width: "100%",
                height: 250,
                members: [drawPane, rotationSlider]
            })
        ]
    };
};

// Create the nine DrawItems:

var drawLine = isc.DrawLine.create({
    drawPane: isc.DemoDrawPane.create(),
    startPoint: [200, 20],
    endPoint: [400, 70],
    keepInParentRect: true
});

var drawRect = isc.DrawRect.create({
    drawPane: isc.DemoDrawPane.create(),
    left: 160,
    top: 30,
    width: 50,
    height: 120,
    keepInParentRect: true,
    knobs: ["resize"]
});

var drawOval = isc.DrawOval.create({
    drawPane: isc.DemoDrawPane.create(),
    left: 450,
    top: 10,
    width: 70,
    height: 140,
    keepInParentRect: true,
    knobs: ["resize"]
});

var drawTriangle = isc.DrawTriangle.create({
    drawPane: isc.DemoDrawPane.create(),
    points: [[75, 50], [100, 100], [50, 100]],
    keepInParentRect: true,
    knobs: ["resize"]
});

var drawCurve = isc.DrawCurve.create({
    drawPane: isc.DemoDrawPane.create(),
    startPoint: [60, 140],
    endPoint: [200, 10],
    controlPoint1: [20, 20],
    controlPoint2: [300, 120],
    keepInParentRect: true
});

var drawShape = isc.DrawShape.create({
    drawPane: isc.DemoDrawPane.create(),
    commands: [{
        type: "moveto", args: [275, 50]
    }, {
        type: "lineto",
        args: [
            [287, 50], [300, 62], [312, 62], [325, 62], [325, 87], [312, 87],
            [300, 87], [287, 100], [275, 100]]
    }, {
        type: "close"
    }],
    keepInParentRect: true,
    knobs: ["resize"]
});

var drawLinePath = isc.DrawLinePath.create({
    drawPane: isc.DemoDrawPane.create(),
    startPoint: [200, 20],
    endPoint: [400, 70],
    keepInParentRect: true
});

var drawImage = isc.DrawImage.create({
    drawPane: isc.DemoDrawPane.create(),
    left: 250,
    top: 30,
    width: 48,
    height: 48,
    src: "/isomorphic/system/reference/exampleImages/pieces/48/piece_red.png",
    keepInParentRect: true,
    knobs: ["resize"],
    useMatrixFilter: true
});

var drawLabel = isc.DrawLabel.create({
    drawPane: isc.DemoDrawPane.create(),
    left: 160,
    top: 30,
    contents: "DrawLabel",
    fontSize: 25,
    fontWeight: "normal",
    fontStyle: "italic",
    fontFamily: "Times New Roman, serif",
    keepInParentRect: true
});

var drawGroup = isc.DrawGroup.create({
    drawPane: isc.DemoDrawPane.create(),
    canDrag: true,
    useGroupRect: true,
    left: 130,
    top: 40,
    width: 120,
    height: 120,
    keepInParentRect: true
});
var groupedTriangle = isc.DrawTriangle.create({
    drawGroup: drawGroup,
    points: [[140, 50], [250, 40], [260, 100]],
    lineColor: null,
    fillGradient: {
        direction: 90,
        startColor: "#33CCCC",
        endColor: "#3366FF"
    }
});
var groupedRect = isc.DrawRect.create({
    drawGroup: drawGroup,
    left: 125,
    top: 70,
    width: 100,
    height: 60,
    rotation: -10,
    lineColor: null,
    fillGradient: {
        direction: 20,
        startColor: "#993366",
        endColor: "#CC99FF"
    }
});
var groupedPolygon = isc.DrawPolygon.create({
    drawGroup: drawGroup,
    points: [[160, 110], [235, 70], [270, 140], [200, 160]],
    lineColor: null,
    fillGradient: {
        direction: 50,
        startColor: "#CCFFCC",
        endColor: "#008080"
    }
});


// Put everything together in a SectionStack.
isc.SectionStack.create({
    width: "100%",
    overflow: "visible",
    visibilityMode: "multiple",
    sections: [
        createSection(drawLine, true, ["startPoint", "endPoint", "move"]),
        createSection(drawRect, false, ["resize", "move"]),
        createSection(drawOval, false, ["resize", "move"]),
        createSection(drawTriangle, true, ["resize", "move"]),
        createSection(drawCurve, false,
            ["startPoint", "endPoint", "controlPoint1", "controlPoint2"]),
        createSection(drawShape, true, ["resize", "move"]),
        createSection(drawLinePath, false,
            ["startPoint", "endPoint", "controlPoint1", "controlPoint2"]),
        createSection(drawImage, false, ["resize", "move"]),
        createSection(drawLabel, false, ["move"]),
        createSection(drawGroup, true, ["move"])
    ]
});
