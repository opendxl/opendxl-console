var labels = "ABCDEFGHIJKLMNO".split("");

isc.FacetChart.create({
    ID: "randomDataChart",
    title: "Random Data Chart",
    chartType: "Column",
    facets: [{ id: "label", title: "Label" }],

    // Draw bright blue lines showing one standard deviation above the mean
    // and one standard deviation below the mean, as per the default
    // configuration of the FacetChart.standardDeviations property.
    showStandardDeviationLines: true,
    standardDeviationLineProperties: {
        lineWidth: 2,
        lineColor: "#0000EE"
    },

    // Draw a bright green line to show the average of the data.
    showExpectedValueLine: true,
    expectedValueLineProperties: {
        lineWidth: 2,
        lineColor: "#00EE00"
    },

    autoDraw: false,
    showDataAxisLabel: false,
    chartRectMargin: 15,
    valueTitle: "Random Values",

    generateRandomData : function () {
        var length = labels.length,
            newChartData = new Array(length),
            min = 0.0,
            max = 25.0;

        // Fill newChartData with a random value for each label, generated
        // uniformly over the range from min to max.
        for (var i = 0; i < length; ++i) {
            newChartData[i] = {
                label: labels[i],
                _value: min + (max - min) * Math.random()
            };
        }
        return newChartData;
    },

    initWidget : function () {
        // Generate the initial data
        this.data = this.generateRandomData();

        this.Super("initWidget", arguments);
    }
});

isc.DynamicForm.create({
    ID: "chartSelector",
    width: "30%",
    autoDraw: false,
    items: [{
        name: "chartType",
        title: "Chart Type",
        type: "select",
        valueMap: ["Area", "Column", "Bar", "Line", "Radar"],
        defaultValue: randomDataChart.chartType,
        changed : "randomDataChart.setChartType(value)"
    }]
});

// Have the chartSelector update itself if the context menu is used to
// change chartType.
chartSelector.observe(
    randomDataChart, "setChartType",
    "chartSelector.getItem('chartType').setValue(randomDataChart.chartType)");

isc.Button.create({
    ID: "regenerateButton",
    width: "30%",
    title: "Regenerate Random Data",
    autoFit: true,
    padding: 5,
    autoDraw: false,
    click : "randomDataChart.setData(randomDataChart.generateRandomData())"
});

isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [isc.HStack.create({
        height: 30,
        members: [chartSelector, regenerateButton]
    }), randomDataChart]
});
