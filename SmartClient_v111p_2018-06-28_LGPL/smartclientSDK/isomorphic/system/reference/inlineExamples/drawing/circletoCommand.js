var startPoint = [50, 200],
    centerPoint = [335, 240],
    radius = 100,
    startAngle = 125,
    endAngle = 345;

var dp = isc.DrawPane.create({
    autoDraw: false,
    width: "*",
    height: 460,
    overflow: "hidden",
    showEdges: true
});

var specifiedDrawCircle = isc.DrawOval.create({
    drawPane: dp,
    autoDraw: true,
    lineWidth: 1,
    centerPoint: centerPoint.duplicate(),
    radius: radius
});

var startAngleDrawLine = isc.DrawLine.create({
    drawPane: dp,
    autoDraw: true,
    lineWidth: 1,
    startLeft: centerPoint[0],
    startTop: centerPoint[1]
});

var endAngleDrawLine = isc.DrawLine.create({
    drawPane: dp,
    autoDraw: true,
    lineWidth: 1,
    startLeft: centerPoint[0],
    startTop: centerPoint[1]
});

var angle0DrawLine = isc.DrawLine.create({
    drawPane: dp,
    autoDraw: true,
    lineWidth: 1,
    lineColor: "#0000FF",
    startLeft: centerPoint[0],
    startTop: centerPoint[1]
});

var initialLineSegmentDrawLine = isc.DrawLine.create({
    drawPane: dp,
    autoDraw: true,
    lineWidth: 1,
    startLeft: startPoint[0],
    startTop: startPoint[1]
});

var drawShape = isc.DrawShape.create({
    drawPane: dp,
    autoDraw: true,
    lineColor: "#33CCFF",
    lineWidth: 15,
    lineOpacity: 0.8
});

var initialLineSegmentDrawLabel = isc.DrawLabel.create({
    drawPane: dp,
    autoDraw: true,
    lineColor: "#000000",
    contents: "initial line segment \u25B2",
    fontSize: 14,
    fontWeight: "normal",
    left: 100,
    top: 100
});

var startDrawPoint = isc.DrawOval.create({
    drawPane: dp,
    autoDraw: true,
    lineWidth: 1,
    fillColor: "#eee",
    // Duplicate the startPoint array because the super drawMove() implementation changes the
    // contained coordinates.
    centerPoint: startPoint.duplicate(),
    radius: 10,
    canDrag: true,
    keepInParentRect: true,

    dragMove : function () {
        this.Super("dragMove", arguments);
        startPoint = this.centerPoint;
        updateDrawItems();
    }
});

dp.draw();

function updateDrawItems() {
    specifiedDrawCircle.setRadius(radius);

    angle0DrawLine.setEndPoint(Math.round(centerPoint[0] + radius), centerPoint[1]);

    var arcStartX = Math.round(centerPoint[0] + radius * Math.cos(startAngle * Math.PI / 180)),
        arcStartY = Math.round(centerPoint[1] - radius * Math.sin(-startAngle * Math.PI / 180));
    startAngleDrawLine.setEndPoint(arcStartX, arcStartY);

    endAngleDrawLine.setEndPoint(
        Math.round(centerPoint[0] + radius * Math.cos(endAngle * Math.PI / 180)),
        Math.round(centerPoint[1] - radius * Math.sin(-endAngle * Math.PI / 180)));

    initialLineSegmentDrawLine.setStartPoint(startPoint[0], startPoint[1]);
    initialLineSegmentDrawLine.setEndPoint(arcStartX, arcStartY);

    drawShape.setCommands([
        { type: "moveto", args: startPoint },
        { type: "circleto", args: [centerPoint, radius, startAngle, endAngle] }
    ]);

    var initialLineSegmentCenterPoint = initialLineSegmentDrawLine.getCenter(),
        initialLineSegmentSlope = (initialLineSegmentCenterPoint[1] - startPoint[1]) / (initialLineSegmentCenterPoint[0] - startPoint[0]),
        isSteep = !(Math.abs(initialLineSegmentSlope) < 1.5);
    initialLineSegmentDrawLabel.setContents("initial line segment " + (isSteep ? "\u25B6" : "\u25B2"));
    var initialLineSegmentLabelWidth = 135;
    initialLineSegmentDrawLabel.moveTo(initialLineSegmentCenterPoint[0] + (isSteep ? 0 : 5) - initialLineSegmentLabelWidth, initialLineSegmentCenterPoint[1]);
}

updateDrawItems();

var configureForm = isc.DynamicForm.create({
    isGroup: true,
    groupTitle: "Configure \"circleto\" Command",
    width: 220,
    height: 300,
    padding: 3,
    titleOrientation: "top",
    items: [{
        name: "radius",
        title: "Change radius",
        colSpan: 2,
        type: "slider",
        value: radius,
        minValue: 100,
        maxValue: 200,

        changed : function (form, item, value) {
            radius = value;
            updateDrawItems();
        }
    }, {
        name: "startAngle",
        title: "Change start angle",
        colSpan: 2,
        type: "slider",
        value: startAngle,
        minValue: 0,
        maxValue: 360,
        sliderProperties: {
            minValueLabel: "0&deg;",
            maxValueLabel: "360&deg;"
        },

        changed : function (form, item, value) {
            startAngle = value;
            updateDrawItems();
        }
    }, {
        name: "endAngle",
        title: "Change end angle",
        colSpan: 2,
        type: "slider",
        value: endAngle,
        minValue: 0,
        maxValue: 360,
        sliderProperties: {
            minValueLabel: "0&deg;",
            maxValueLabel: "360&deg;"
        },

        changed : function (form, item, value) {
            endAngle = value;
            updateDrawItems();
        }
    }]
});

var mainLayout = isc.HLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 15,
    members: [dp, configureForm]
});
