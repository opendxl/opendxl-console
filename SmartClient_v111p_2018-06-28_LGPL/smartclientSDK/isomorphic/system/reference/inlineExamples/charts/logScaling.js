// Note that the inline data is in the next tab, as an array
// of Javascript objects.

// This creates the chart from the inline data.
isc.FacetChart.create({
    ID: "logScalingChart",
    title: "S & P 500 Index",

    // You use facets to define the ways in which you would like the chart to
    // break down the data. In this case, our only facet is "date"
    facets: [{
        id: "year"  // the key used for this facet in the data
    }],
    
    data: data,  // This is a reference to the inline data supplied in a separate file
    valueProperty: "index", // the property in the data that is the numerical value to chart
    logScale: true, // makes the chart use a logarithmic scale
    logBase: 10,
    useLogGradations: true, // draws gradations based on the logBase
    logGradations: [1, 2, 5, 7.5], // specifies which gradations to draw within the logBase
    chartType: "Line"
});

// Overall layout
isc.VLayout.create({
    ID: "logarithmicChartLayout",
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [
        logScalingChart
    ]
});

