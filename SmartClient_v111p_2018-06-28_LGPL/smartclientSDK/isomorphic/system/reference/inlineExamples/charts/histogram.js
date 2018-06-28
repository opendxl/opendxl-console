// data simulates measured variations in water pollutants from various sources
var chartData = [
    {water: "Tap", pollutant: "Metals",    minValue: 10, maxValue: 20, danger: 100},
    {water: "Tap", pollutant: "Organics",  minValue: 20, maxValue: 40, danger: 80 },
    {water: "Tap", pollutant: "Pathogens", minValue: 3,  maxValue: 8,  danger: 25 },

    {water: "Lake", pollutant: "Metals",    minValue: 50, maxValue: 60, danger: 100},
    {water: "Lake", pollutant: "Organics",  minValue: 55, maxValue: 80, danger: 80 },
    {water: "Lake", pollutant: "Pathogens", minValue: 15, maxValue: 25, danger: 25 },

    {water: "Ocean", pollutant: "Metals",    minValue: 20, maxValue: 70, danger: 100},
    {water: "Ocean", pollutant: "Organics",  minValue: 50, maxValue: 95, danger: 80 },
    {water: "Ocean", pollutant: "Pathogens", minValue: 10, maxValue: 45, danger: 25 },

    {water: "Bottled", pollutant: "Metals",    minValue: 5, maxValue: 10, danger: 100},
    {water: "Bottled", pollutant: "Organics",  minValue: 5, maxValue: 25, danger: 80 },
    {water: "Bottled", pollutant: "Pathogens", minValue: 0, maxValue: 0,  danger: 25 }
];

var lineColors = {
    Grey: "#333333", Orange: "#FF8C00", Cyan: "#00FFFF"
};
var dataColors = {
    Metals: "#DC143C", Organics: "#7FFF00", Pathogens: "#0000FF"
};

isc.FacetChart.create({
    ID: "histogram",

    width: "100%",
    height: "100%",

    chartType: "Histogram",
    title: "Measured Pollutant Levels",
    allowedChartTypes: ["Bar", "Column", "Histogram"],
    
    showValueOnHover:true,

    metricFacetId: "valueMetrics",
    endValueMetric:  "maxValue",
    valueProperty: "minValue",

    data: chartData,

    facets: [{
        id: "water",    
        title: "Water Source"
    },{
        id: "pollutant",
        title: "Pollutant"
    },{
        id: "valueMetrics",
        inlinedValues: true,
        values: [{ id: "minValue" }, { id: "maxValue" }, { id: "danger" }]
    }],

    // override the default chart segment colors

    getDataColor : function (index, facetValueId) {
        return dataColors[facetValueId];
    },
    getDataLineColor : function (index, facetValueId) {
        var item = configForm.getItem("borderColor");
        return lineColors[item.getValue()];
    }
});


isc.DynamicForm.create({
    ID: "configForm",
    numCols: 4,
    width: 500,
    wrapItemTitles: false,
    items: [{
        name: "zOrder",
        title: "Z-Ordering",
        type: "select",

        allowEmptyValue: true,
        emptyDisplayValue: "Draw order (default)",
        valueMap: {danger: "Use 'danger' Metric"},

        changed : function (form, item, value) {
            histogram.setZIndexMetric(value);
        }
    },{
        name: "borderColor",
        title: "Border Color",
        type: "select",

        visible: !histogram.matchBarChartDataLineColor,
        valueMap: ["Grey", "Orange", "Cyan"],
        defaultValue: "Grey",

        changed : function () {
            // force the chart to be redrawn
            histogram.setData(histogram.data);
        }
    }]
});

// Overall layout

isc.VLayout.create({
    ID: "simpleChartLayout",
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [configForm, histogram]
});
