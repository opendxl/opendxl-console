isc.FacetChart.create({
    ID: "regressionChart",
    title: "Time Series Trend Line",
    chartType: "Scatter",
    facets: [{
        id: "metric",
        inlinedValues: true,
        values: [{ id: "value" }, { id: "time" }]
    }],
    data: chartData,
    xAxisMetric: "time",
    yAxisMetric: "value",

    showRegressionLine: true,
    regressionLineType: "polynomial",
    regressionPolynomialDegree: 3,

    autoDraw: false,
    chartRectMargin: 15
});


// This is a form which you can use to change the regression line.

isc.DynamicForm.create({
    ID: "options",
    autoDraw: false,
    width: "50%",
    items: [{
        name: "showRegression",
        title: "Show / Hide Regression Line",
        type: "checkbox",
        defaultValue: regressionChart.showRegressionLine,
        changed : "regressionChart.setShowRegressionLine(value)"
    }, {
        name: "lineType",
        title: "Regression Type",
        wrapTitle: false,
        width: 222,
        type: "select",
        valueMap: ["linear", "curve"],
        defaultValue: (regressionChart.regressionLineType == "line" ? "linear" : "curve"),
        changed : "regressionChart.setRegressionLineType(value == 'linear' ? 'line' : 'polynomial')"
    }, {
        name: "degree",
        title: "Polynomial Degree",
        wrapTitle: false,
        editorType: "SpinnerItem",
        disabled: (regressionChart.regressionLineType == "line"),
        defaultValue: regressionChart.regressionPolynomialDegree,
        min: 1, max: 5,
        changed : "regressionChart.setRegressionPolynomialDegree(value)"
    }]
});


// Have the options form update itself if the context menu is used to change
// the properties showRegressionLine, regressionLineType, or
// regressionPolynomialDegree.

options.observe(
    regressionChart, "setShowRegressionLine",
    "options.getItem('showRegression').setValue(regressionChart.showRegressionLine)");

options.observe(
    regressionChart, "setRegressionLineType",
    function (observed, observer, returnVal) {
        var line = (regressionChart.regressionLineType == "line");
        options.getItem("lineType").setValue(line ? "linear" : "curve");
        options.getItem("degree").setDisabled(line);
    });

options.observe(
    regressionChart, "setRegressionPolynomialDegree",
    "options.getItem('degree').setValue(regressionChart.regressionPolynomialDegree)");


// Overall layout

isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [options, regressionChart]
});
