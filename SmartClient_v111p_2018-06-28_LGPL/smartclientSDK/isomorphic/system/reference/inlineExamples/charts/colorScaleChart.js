var defaultUseMultiplePointShapes = true,
    defaultStartColor = "#0000FF",
    defaultEndColor = "#FF0000";

isc.FacetChart.create({
    ID: "colorScaleChart",
    showTitle: false,
    chartType: "Bubble",
    facets: [{
        id: "metric",
        inlinedValues: true,
        values: [{
            id: "value"
        }, {
            id: "time"
        }, {
            id: "volume", title: "Volume"
        }, {
            id: "heat", title: "Heat"
        }]
    }, {
        id: "series",
        values: [{ id: "A", title: "Series A" }, { id: "B", title: "Series B" }]
    }],
    data: chartData,

    xAxisMetric: "time",
    yAxisMetric: "value",
    pointSizeMetric: "volume",
    colorScaleMetric: "heat",
    scaleStartColor: defaultStartColor,
    scaleEndColor: defaultEndColor,
    useMultiplePointShapes: defaultUseMultiplePointShapes,
    showBubbleLegendPerShape: true,
    minDataPointSize: 10,
    maxDataPointSize: 50,

    bubbleProperties: {
        lineWidth: 1,
        lineColor: "#000000"
    },
    dataColors: ["#ffffff"],

    showChartRect: true,
    chartRectProperties: {
        lineWidth: 1,
        lineColor: "#bbbbbb",
        rounding: 0.05
    },
    bandedBackground: false,
    chartRectMargin: 15,
    showValueOnHover: true,
    autoDraw: false
});

// This is a form which you can use to change the values of useMultiplePointShapes,
// scaleStartColor, and scaleEndColor.
isc.DynamicForm.create({
    ID: "options",
    autoDraw: false,
    numCols: 6,
    colWidths: [20, "*", 90, "*", 80, "*"],
    width: 600,
    saveOnEnter: true,
    submitValues : function (values, form) {
        form.setValues(values);
    },
    items: [{
        name: "useMultiplePointShapes",
        title: "Use Multiple Shapes",
        type: "checkbox",
        defaultValue: defaultUseMultiplePointShapes,
        changed : function (form, item, value) {
            colorScaleChart.setUseMultiplePointShapes(value);
        }
    }, {
        name: "scaleStartColor",
        title: "Start Color",
        type: "color",
        defaultValue: defaultStartColor,
        width: 100,
        keyPressFilter: "[0-9a-fA-F#]",
        changed : function (form, item, value) {
            colorScaleChart.setScaleStartColor(value);
        }
    }, {
        name: "scaleEndColor",
        title: "End Color",
        type: "color",
        defaultValue: defaultEndColor,
        width: 100,
        keyPressFilter: "[0-9a-fA-F#]",
        changed : function (form, item, value) {
            colorScaleChart.setScaleEndColor(value);
        }
    }]
});

// Overall layout
isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [options, colorScaleChart]
});
