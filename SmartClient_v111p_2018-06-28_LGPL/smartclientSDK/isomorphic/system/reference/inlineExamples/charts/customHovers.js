// This creates the chart from the inline data.
// Note that the inline data is defined in the next tab.
isc.FacetChart.create({
    ID: "customHover",
    title: "Revenue",
    height: "350",

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
    chartType: "Area",
    // If we move pointer out of the area, hide the marker
    mouseOut : function() {
        var eventTarget = isc.EventHandler.getTarget();
        if (eventTarget != marker) {
            marker.hide();
        }
    },
    // Show the blue marker when the pointer is inside the chart
    mouseOver : function() {
        marker.show();
    },
    // Reposition blue marker each time the pointer moves
    mouseMove : function() {
        var nearestDV = this.getNearestDrawnValue();
        if (nearestDV.startAngle != null) {
            var arcMidpoint = isc.DrawSector.getArcMidpoint(nearestDV.x, nearestDV.y,
                                                            nearestDV.startAngle,
                                                            nearestDV.endAngle,
                                                            nearestDV.radius);
            marker.moveTo(arcMidpoint[0], arcMidpoint[1]);
        } else {
            marker.moveTo(nearestDV.x, nearestDV.y);
        }
    },
    // Display data gathered from getNearestDrawnValue
    // At least value, x, y coordinates, facetValue and record are displayed
    // Depending on the kind of chart some extra fields may be available
    // When the extra fields are present, we add them to the DetailViewer
    click : function() {
        var nearestDV = this.getNearestDrawnValue();
        var fields = initFields(),
            field;
        var dataItem = {};
        if(nearestDV.barThickness != null) {
            field = {name: "barThickness", title: "Bar Thickness", type: "number"};
            fields.add(field);
            dataItem.barThickness = nearestDV.barThickness;
        }
        if(nearestDV.startAngle != null) {
            field = {name: "startAngle", title: "Start Angle", type: "number"};
            fields.add(field);
            field = {name: "endAngle", title: "End Angle", type: "number"};
            fields.add(field);
            field = {name: "radius", title: "Radius", type: "number"};
            fields.add(field);
            dataItem.startAngle = nearestDV.startAngle;
            dataItem.endAngle = nearestDV.endAngle;
            dataItem.radius = nearestDV.radius;
        }
        dataItem.value = nearestDV.value;
        dataItem.x = nearestDV.x;
        dataItem.y = nearestDV.y;
        dataItem.facetValue = isc.JSON.encode(nearestDV.facetValues);
        dataItem.record = isc.JSON.encode(nearestDV.record);

        data = [dataItem];

        viewer.setFields(fields);
        viewer.setData(data);
    }
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
            customHover.setChartType(value)
        }
    }]
});

// Have the chartSelector update itself if the context menu is used to change chartType
chartSelector.observe(customHover, "setChartType", "chartSelector.getItem('chartType').setValue(customHover.chartType)");

// The DetailViewer that will display the data from nearestDrawnValue when user clicks
viewer = isc.DetailViewer.create({
	ID: "viewer",
        width: "100%",
        fields: [{name: "none"}]
});

// Overall layout
isc.VLayout.create({
    ID: "customHoverLayout",
    width: "100%",
    membersMargin: 20,
    members: [
        isc.HLayout.create({
            height: 20,
            members: [chartSelector]
        }),
        customHover,
	viewer
    ]
});

// The marker is positioned directly in root panel, not in the layout
marker = isc.Canvas.create({
    styleName: "blueMarker",

    mouseOut : function() {
        this.hide();
    }
});
customHover.addChild(marker);

// These fields are always present in the nearestDrawnValue record
// Others, like startAngle and endAngle, are optional
function initFields() {
        fields = new Array();
        field = {name: "value", title: "Value"};
        fields.add(field);
        field = {name: "x", title: "X"},
        fields.add(field);
        field = {name: "y", title: "Y"}
        fields.add(field);
        field = {name: "facetValue", title: "Facet Value"}
        fields.add(field);
        field = {name: "record", title: "Record"}
        fields.add(field);

        return fields;
}
