// This creates the chart from the inline data.
// Note that the inline data is defined in the next tab.
isc.FacetChart.create({
    ID: "multiSeriesChart",
    title: "Revenue",

    // You use facets to define the ways in which you would like the chart to
    // break down the data. In this case, our data has two dimensions: time and region.
    // Time is listed first so that it will become the x-axis for the chart -- you
    // can use the "Swap Facets" contextual menu on the chart to change that, though
    // in this case the results would not be sensible!
    facets: [{
        id: "time",  
        title: "Period" 
    },{
        id: "region",  // the key used for this facet in the data
        title: "Region" // the user-visible title you want in the chart
    }],
    
    data: data,  // This is a reference to the inline data supplied above
    valueProperty: "value", // the property in the data that is the numerical value to chart
    chartType: "Area"
});

// This is a form which you can use to change the chart type
isc.DynamicForm.create({
    ID: "chartSelector",
    wrapItemTitles: false,
    width: "25%",
    items: [{
        name: "chartType",
        title: "Chart Type",
        type: "select",
        valueMap: ["Area", "Column", "Bar", "Line", "Pie", "Doughnut", "Radar"],
        defaultValue: "Area",
        changed : function (form, item, value) {
            multiSeriesChart.setChartType(value)
        }
    }]
});

// Have the chartSelector update itself if the context menu is used to change chartType
chartSelector.observe(multiSeriesChart, "setChartType", "chartSelector.getItem('chartType').setValue(multiSeriesChart.chartType)");

// Overall layout
isc.VLayout.create({
    ID: "multiSeriesChartLayout",
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [
        isc.HLayout.create({
            height: 40,
            members: [chartSelector]
        }),
        multiSeriesChart
    ]
});

