// This creates the chart from the inline data.  Note that the inline data is defined in the
// next tab.
isc.FacetChart.create({
    ID: "mixedPlotsChart",
    title: "Revenue",

    // You use facets to define the ways in which you would like the chart to break down the
    // data.  In this case, our data has a value for each combination of two dimensions, time
    // and region, and a projected average value for each time.  Time is listed first so that
    // it will become the x-axis for the chart.
    facets: [{
        id: "time",
        title: "Period"
    }, {
        id: "region",
        title: "Region"
    }, {
        id: "metric",
        inlinedValues: true,
        values: [{
            id: "value", title: "Value"
        }, {
            id: "avg", title: "Projected Average"
        }]
    }],

    data: data, // This is a reference to the inline data supplied above
    chartType: "Column",
    stacked: false,

    extraAxisMetrics: ["avg"],
    extraAxisSettings: [{
        // Set showAxis to false to avoid a second axis appearing.
        showAxis: false,
        // Set matchGradations to the first metric, "value", so that the gradations of the
        // main plot are also used to plot the projected average.
        matchGradations: "value",

        // The projected average plot is single-facet because the projected average is for
        // all three regions.  However, in order to embed the projected average plot into a
        // multi-facet plot we must pick a legend facet value to fix.
        multiFacet: false,
        fixedFacetValue: "North",
        legendLabel: "Projected Average",

        chartType: "Line"
    }]
});

// Overall layout
isc.HLayout.create({
    width: "100%",
    height: "100%",
    members: [mixedPlotsChart]
});
