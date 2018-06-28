var productRevenue = isc.DataSource.get("productRevenue");

isc.FacetChart.create({
    ID: "errorBars",
    title: "Error Bars",
    chartType: "Line",
    metricFacetId: "errorMetrics",
    lowErrorMetric: "lowValue",
    highErrorMetric: "highValue",
    showDataPoints: true,
    stacked: false,
    showLegend: false,

    facets: [{
        id: "Time"
    }, {
        id: "Regions"
    }, {
        id: "errorMetrics",
        inlinedValues: true,
        values: [{ id: "value" }, { id: "lowValue" }, { id: "highValue" }]
    }],

    updateData : function () {
        var criteria = {
            Scenarios: "Actual",
            Products: "sum",
            Regions: "North"
        };
        productRevenue.fetchData(criteria, "errorBars.setData(data)");
    },

    randomErrorPercentage : function () {
        return Math.max(0.05, Math.random() * 0.15);
    },

    // Override setData() to add random error bars to the line chart.
    setData : function (data) {
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                var record = data[i];
                record.lowValue = record.value * (1 - this.randomErrorPercentage());
                record.highValue = record.value * (1 + this.randomErrorPercentage());
            }
        }
        return this.Super("setData", arguments);
    },

    initWidget : function () {

        // Chart can auto-derive facet values from data.  The productRevenue
        // data source has values that are parents/sums of other values.  For example,
        // the value for "Q4-2016" is a sum of the values for "10/1/2016", "11/1/2016",
        // and "12/1/2016".  The sum values need to be excluded from the time facet
        // to avoid having a bizarre chart comparing sums to parts.
        var timeFacet = this.facets.find("id", "Time"),
            timeFacetValueIds = [
                "12/1/2016", "11/1/2016", "10/1/2016", "9/1/2016", "8/1/2016",
                "7/1/2016", "6/1/2016", "5/1/2016", "4/1/2016", "3/1/2016",
                "2/1/2016", "1/1/2016", "12/1/2015", "11/1/2015", "10/1/2015",
                "9/1/2015", "8/1/2015", "7/1/2015", "6/1/2015", "5/1/2015",
                "4/1/2015", "3/1/2015", "2/1/2015", "1/1/2015", "12/1/2014",
                "11/1/2014", "10/1/2014", "9/1/2014", "8/1/2014", "7/1/2014",
                "6/1/2014", "5/1/2014", "4/1/2014", "3/1/2014", "2/1/2014",
                "1/1/2014"];

        timeFacet.values = [];

        for (var i = 0; i < timeFacetValueIds.length; ++i) {
            var valueId = timeFacetValueIds[i],
                year = valueId.substring(valueId.lastIndexOf("/") + 1),
                month = valueId.substring(0, valueId.indexOf("/")),
                quarter = Math.ceil(parseInt(month) / 3);
            timeFacet.values[i] = {
                id: valueId,
                title: valueId,
                parentId: "Q" + quarter + "-" + year
            };
        }

        return this.Super("initWidget", arguments);
    }
});

isc.VLayout.create({
    width: "100%",
    height: "100%",
    members: [errorBars]
});

errorBars.updateData();
