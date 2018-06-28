DEFAULT_LINE_WIDTH = 5;
DEFAULT_LINE_PATTERN = "solid";
DEFAULT_LINE_CAP = "round";
DEFAULT_LINE_COLOR = "#993366";
DEFAULT_ARROW_HEAD_STYLE = "open";

var mainPane = isc.DrawPane.create({
    autoDraw: false,
    ID: "mainPane",
    width: 800,
    height: 340,
    top: 110,
    overflow: "hidden",
    showEdges: true
});

var drawLine = isc.DrawLine.create({
    autoDraw: true,
    drawPane: mainPane,
    lineWidth: DEFAULT_LINE_WIDTH,
    linePattern: DEFAULT_LINE_PATTERN,
    lineCap: DEFAULT_LINE_CAP,
    lineColor: DEFAULT_LINE_COLOR,
    startArrow: DEFAULT_ARROW_HEAD_STYLE,
    endArrow: DEFAULT_ARROW_HEAD_STYLE,
    startPoint: [20, 30],
    endPoint: [180, 190]
});

var drawLinePath = isc.DrawLinePath.create({
    autoDraw: true,
    drawPane: mainPane,
    lineWidth: DEFAULT_LINE_WIDTH,
    linePattern: DEFAULT_LINE_PATTERN,
    lineCap: DEFAULT_LINE_CAP,
    lineColor: DEFAULT_LINE_COLOR,
    startArrow: DEFAULT_ARROW_HEAD_STYLE,
    endArrow: DEFAULT_ARROW_HEAD_STYLE,
    startPoint: [190, 40],
    endPoint: [340, 190]
});

var drawPath = isc.DrawPath.create({
    autoDraw: true,
    drawPane: mainPane,
    lineWidth: DEFAULT_LINE_WIDTH,
    linePattern: DEFAULT_LINE_PATTERN,
    lineCap: DEFAULT_LINE_CAP,
    lineColor: DEFAULT_LINE_COLOR,
    startArrow: DEFAULT_ARROW_HEAD_STYLE,
    endArrow: DEFAULT_ARROW_HEAD_STYLE,
    points: [[400,25], [425,50], [450,75], [475,75],
             [500,75], [500,125], [475,125], [450,125],
             [425,150], [500,175]]
});

var drawCurve = isc.DrawCurve.create({
    autoDraw: true,
    drawPane: mainPane,
    lineWidth: DEFAULT_LINE_WIDTH,
    linePattern: DEFAULT_LINE_PATTERN,
    lineCap: DEFAULT_LINE_CAP,
    lineColor: DEFAULT_LINE_COLOR,
    startArrow: DEFAULT_ARROW_HEAD_STYLE,
    endArrow: DEFAULT_ARROW_HEAD_STYLE,
    startPoint: [600, 50],
    endPoint: [700, 200],
    controlPoint1: [680, -10],
    controlPoint2: [620, 260]
});

var drawItems = [drawLine, drawLinePath, drawPath, drawCurve];

var dataForm = isc.DynamicForm.create({
    autoDraw: false,
    ID: "dataForm",
    width: 300,
    height: 140,
    overflow: "hidden",
    colWidths: [150, "*"],
    items: [
        {
            name: "lineWidth",
            title: "Line Width",
            editorType: "SpinnerItem",
            defaultValue: DEFAULT_LINE_WIDTH,
            min: 1,
            max: 10,
            step: 1,
            defaultValue: 5,
            width: 150,
            changed : function (form, self, value) {
                drawItems.callMethod("setLineWidth", value);
            }
        },
        {
            name: "linePattern",
            title: "Line Pattern",
            type: "select",
            defaultValue: DEFAULT_LINE_PATTERN,
            valueMap: {
                "solid": "Solid",
                "dot": "Dot",
                "dash": "Dash",
                "shortdot": "Short dot",
                "shortdash": "Short dash",
                "longdash": "Long dash"
            },
            changed : function (form, self, value) {
                drawItems.callMethod("setLinePattern", value);
            }
        },
        {
            name: "lineCap",
            title: "Line Cap",
            type: "select",
            defaultValue: DEFAULT_LINE_CAP,
            valueMap: {
                "round": "Round",
                "square": "Square",
                "butt": "Butt"
            },
            changed : function (form, self, value) {
                drawItems.callMethod("setLineCap", value);
            }
        },
        {
            name: "lineColor",
            title: "Line Color",
            editorType: "ColorItem",
            defaultValue: DEFAULT_LINE_COLOR,
            changed : function (form, self, value) {
                drawItems.callMethod("setLineColor", value);
            }
        },
        {
            name: "arrowHeadStyle",
            title: "Arrow Head Style",
            type: "select",
            defaultValue: DEFAULT_ARROW_HEAD_STYLE,
            valueMap: {
                "open": "Open",
                "block": "Block"
            },
            changed : function (form, self, value) {
                drawItems.callMethod("setStartArrow", value);
                drawItems.callMethod("setEndArrow", value);
            }
        }
    ]
});

isc.VStack.create({
    membersMargin: 10,
    members: [dataForm, mainPane]
});
