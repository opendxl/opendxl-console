var ds = isc.DataSource.get("productRevenue");

// Label to show and clear region or time selection 
var selectedLabelValue = isc.Label.create({
    ID: "selectedRegion",
    cursor: "hand",
    iconOrientation: "right",
    showRollOverIcon: true,
    showRollOver: true,
    height: 5,
    padding: 10,
    click: function () {
        if (this.contents != "All") {
            createChart();    
        }
    }
});

// Overall layout
var dynamicChartLayout = isc.VLayout.create({
    ID: "dynamicChartLayout",
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [selectedLabelValue]
});

var createChart = function (region, time) {
    var dynamicChart = isc.Canvas.getById("dynamicChart");
    var swapFacets = false;
    if (dynamicChart) {
        swapFacets = time || dynamicChart.facets[0].id == "Regions";
        dynamicChart.destroy();
    }
    var facets;
    var timeFacet = {
        id: "Time",
        title: "Time"
    };
    var regionsFacet = {
        id: "Regions",
        title: "Region",
        values: [
            {id: "North", title: "North"},
            {id: "South", title: "South"},
            {id: "East", title: "East"},
            {id: "West", title: "West"}
        ]
    };
    if (!region && !time) {
        if (swapFacets) {
            facets = [regionsFacet, timeFacet];
            selectedLabelValue.setContents("Selected Region: All");
        } else {
            facets = [timeFacet, regionsFacet];
            selectedLabelValue.setContents("Selected Time: All");
        }
        selectedLabelValue.setIcon(null);
    } else {
        if (region) {
            facets = [timeFacet];
            selectedLabelValue.setContents("Selected Region: " + region);
        } else {
            facets = [regionsFacet];
            selectedLabelValue.setContents("Selected Time: " + time);
        }
        selectedLabelValue.setIcon("[SKIN]/DynamicForm/Remove_icon.png");
    }
    
    dynamicChart = isc.FacetChart.create({
        ID: "dynamicChart",
        title: "Revenue",
        facets: facets,
        chartType: "Column",
        stacked: true,
        valueProperty: "value", // the property in the data that is the numerical value to chart
        
        // activates when user clicks a segment of a column, drawnValue is a type of DrawnValue
        valueClick : function (drawnValue) {
            if (this.facets[0].id == "Time") {
                createChart(drawnValue.facetValues.Regions);
            } else {
                createChart(null, drawnValue.facetValues.Time);
            }
        },
        
        // activates when user clicks legend item
        legendClick : function (facetValue, metricFacetValue) {
            if (this.facets[0].id == "Time") {
                createChart(facetValue.id);
            } else {
                createChart(null, facetValue.id);
            }
        },
        
        dataLabelClick : function (facetValue) {
            if (this.facets[0].id == "Time") {
                createChart(null, facetValue.id);
            } else {
                createChart(facetValue.id);
            }
        },

        getDataLabelHoverHTML : function (facetValue) {
            return "Click to show only data from " + facetValue.title;
        },

        getLegendHoverHTML : function (facetValue, metricFacetValue) {
            return "Click to show only data from " + facetValue.title;
        }
    });
    var criteria = [
        {fieldName: "Time", operator: "startsWith", value: "Q"},
        {fieldName: "Scenarios", operator: "equals", value: "Actual"},
        {fieldName: "Products", operator: "equals", value: "Prod01"}
    ];
    // if user selected a specific region by clicking a value or legend then fetch values
    // of the region
    if (region) {
        criteria.add({fieldName: "Regions", operator: "equals", value: region});
    } else if (time) {
        criteria.add({fieldName: "Time", operator: "equals", value: time});
    }
    // this sets the chart's data with values fetched from the dataSource
    ds.fetchData(
        { _constructor: "AdvancedCriteria", operator: "and", criteria: criteria },
        function (dsResponse, data, dsRequest) {
            dynamicChart.setData(data);
        }
    );

    dynamicChartLayout.addMember(dynamicChart);
}

createChart();
