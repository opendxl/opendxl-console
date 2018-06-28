var ds = isc.DataSource.get("productRevenue");

isc.FacetChart.create({
    ID: "dynamicChart",
    title: "Revenue",

    // You use facets to define the ways in which you would like the chart to
    // break down the data. In this case, we will use only one dimensions: region
    facets: [{
        id: "Regions",  // the key used for this facet in the data
        title: "Region" // the user-visible title you want in the chart
    }],
    
    chartType: "Column",
    stacked: false, 
    valueProperty: "value", // the property in the data that is the numerical value to chart

    updateData : function (title) {
        var self = this; // So we can refer to ourself in the callback below, where "this" will have changed
        ds.fetchData(
         isc.DataSource.combineCriteria({
                Products: "Prod01",
                Regions: ["North", "South", "East", "West"],
                Scenarios:"budget"
            }, {Time: "sum"}),
            function (dsResponse, data, dsRequest) {
                self.setProperty("title", title);
                self.setData(data);
            }
        );
    },

    chartBackgroundDrawn : function() {

        var values = this.getFacetData().getProperty(["value"]);
        var sum = 0;

        for(var i = 0, l = values.length;i < l;i++) {
		    sum = sum + parseFloat(values[i]);
        }
        
        avgLineY = this.getYCoord(sum/l);

        isc.DrawLine.create({
            drawPane: this,
            startPoint: [this.getChartLeft(), avgLineY],
            endPoint : [this.getChartLeft() + this.getChartWidth(), avgLineY],
            autoDraw: true
        }, {
            lineWidth: 4,
            lineColor: "red",
            linePattern: "dash"
        });
    }
});

dynamicChart.updateData("Revenue for All Years");

// Overall layout

isc.VLayout.create({
    ID: "dynamicChartLayout",
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [
        dynamicChart
    ]
});
