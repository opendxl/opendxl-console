// Suppose you have an array of plain Javascript hashes,
// representing sales of certain products in certain regions

var chartData = [
    {region: "West",  product: "Cars", sales: 37},
    {region: "North", product: "Cars", sales: 29},
    {region: "East",  product: "Cars", sales: 80},
    {region: "South", product: "Cars", sales: 87},

    {region: "West",  product: "Trucks", sales: 23},
    {region: "North", product: "Trucks", sales: 45},
    {region: "East",  product: "Trucks", sales: 32},
    {region: "South", product: "Trucks", sales: 67},

    {region: "West",  product: "Motorcycles", sales: 12},
    {region: "North", product: "Motorcycles", sales: 4},
    {region: "East",  product: "Motorcycles", sales: 23},
    {region: "South", product: "Motorcycles", sales: 45}
]

// You could construct a simple chart of that data like this ...

isc.FacetChart.create({
    ID: "simpleChart",
    // You use facets to define the ways in which you would like the chart to
    // break down the data. In this case, our data has two dimensions: region and product.
    facets: [{
        id: "region",    // the key used for this facet in the data above
        title: "Region"  // the user-visible title you want in the chart
    },{
        id: "product",
        title: "Product"
    }],
    data: chartData,        // a reference to our data above
    valueProperty: "sales", // the property in our data that is the numerical value to chart
    chartType: "Area",
    title: "Sales by Product and Region"  // a title for the chart as a whole
});


// This is a form which you can use to change the chart type

isc.DynamicForm.create({
    ID: "chartSelector",
    items: [{
        name: "chartType",
        title: "Chart Type",
        type: "select",
        valueMap: ["Area", "Column", "Bar", "Line", "Pie", "Doughnut", "Radar"],
        defaultValue: "Area",
        changed : function (form, item, value) {
            simpleChart.setChartType(value)
        }
    }]
});

// Have the chartSelector update itself if the context menu is used to change chartType

chartSelector.observe(simpleChart, "setChartType", "chartSelector.getItem('chartType').setValue(simpleChart.chartType)");

// Overall layout

isc.VLayout.create({
    ID: "simpleChartLayout",
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [chartSelector, simpleChart]
});
