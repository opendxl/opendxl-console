var defaultUseMultiplePointShapes = true;

isc.FacetChart.create({
    ID: "bubbleChart",
    title: "Bubble Chart",
    chartType: "Bubble",
    facets: [{
        id: "metric",
        inlinedValues: true,
        values: [{ id: "value" }, { id: "time" }, { id: "volume", title: "Volume" }]
    }, {
        id: "series",
        values: [{ id: "A", title: "Series A" }, { id: "B", title: "Series B" }]
    }],
    data: chartData,

    xAxisMetric: "time",
    yAxisMetric: "value",
    pointSizeMetric: "volume",
    useMultiplePointShapes: defaultUseMultiplePointShapes,
    minDataPointSize: 10,
    maxDataPointSize: 50,

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

// This is a form which you can use to change the value of useMultiplePointShapes.
isc.DynamicForm.create({
    ID: "options",
    autoDraw: false,
    width: "50%",
    items: [{
        name: "useMultiplePointShapes",
        title: "Use Multiple Shapes",
        type: "checkbox",
        defaultValue: defaultUseMultiplePointShapes,
        changed : function (form, item, value) {
            bubbleChart.setUseMultiplePointShapes(value);
        }
    }]
});

// Overall layout
isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [options, bubbleChart]
});
