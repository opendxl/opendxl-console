var currentDrawLine = null,
    startPoint;

var drawPane = isc.DrawPane.create({
    autoDraw: false,
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    click : function () {
        if (currentDrawLine == null) {
            startPoint = this.getDrawingPoint();

            // Start a new DrawLine having a random line color.
            var r = Math.floor(255 * Math.random()),
                g = Math.floor(255 * Math.random()),
                b = Math.floor(255 * Math.random());
            currentDrawLine = isc.DrawLine.create({
                drawPane: this,
                autoDraw: true,
                lineColor: "rgb(" + r + ", " + g + ", " + b + ")",
                lineWidth: 3,
                startLeft: startPoint[0],
                startTop: startPoint[1],
                endLeft: startPoint[0],
                endTop: startPoint[1]
            });

        } else {
            currentDrawLine.setEndPoint(this.getDrawingPoint());
            currentDrawLine = null;
        }
    },
    mouseMove : function () {
        if (currentDrawLine != null) {
            currentDrawLine.setEndPoint(this.getDrawingPoint());
        }
    }
});

var configForm = isc.DynamicForm.create({
    autoDraw: false,
    overflow: "hidden",
    width: 200,
    height: "100%",
    numCols: 1,
    items: [{
        name: "zoomLevel",
        title: "Zoom Level",
        titleOrientation: "top",
        editorType: "SliderItem",
        minValue: 10,
        maxValue: 100,
        numValues: 10,
        defaultValue: 100,
        sliderProperties: {
            minValueLabel: "10%",
            maxValueLabel: "100%"
        },
        changed : function (form, self, value) {
            drawPane.setZoomLevel(value / 100);
        }
    }, {
        name: "rotation",
        title: "Rotation",
        titleOrientation: "top",
        editorType: "SliderItem",
        minValue: 0,
        maxValue: 360,
        defaultValue: 0,
        changed : function (form, self, value) {
            drawPane.setRotation(value);
        }
    }]
});

isc.HLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 10,
    members: [
        isc.VLayout.create({
            members:[
                isc.Label.create({
                    contents:"Click to draw lines",
                    align:"center",
                    height:30
                }),
                drawPane
            ]
        }), 
        configForm
    ]
});
