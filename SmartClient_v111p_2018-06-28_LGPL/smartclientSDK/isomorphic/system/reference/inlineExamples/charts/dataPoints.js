// Note that the data is defined inline in the next tab.
// One could also fetch it from a datasource.

// Create the chart
var chart = isc.FacetChart.create({
    title: "Lifespan of Animals in Years",

    width: "100%",
    height: "100%",

    // You use facets to define the ways in which you would like the chart to
    // break down the data. In this case, we'll label the x-axis with the commonName
    facets: [{
        id: "commonName",  // the key used for this facet in the data
        title: "Name" // the user-visible title you want in the chart
    }],

    // The animalData is defined inline in the next tab
    data: animalData,
    chartType: "Line",
    valueProperty: "lifeSpan", // the property in the data that is the numerical value to chart

    showDataPoints: true,

    // Function that returns HTML to show when hovering over a data point
    getPointHoverHTML : function (value, record) {
        var imgStyle = "padding-top: 6px; padding-bottom: 8px;";
        var imgBase = "/isomorphic/system/reference/inlineExamples/tiles/images/"; 
        return (
            '<b>' + record.commonName + '</b><br />' +
            '<i>' + record.scientificName + '</i><br />' +
            '<img width=120 height=100 style="' + imgStyle + '" src="' + imgBase + record.picture + '"><br />' +
            '<b>Life Span:</b> ' + record.lifeSpan + '<br />' +
            '<b>Diet:</b> ' + record.diet + '<br />' +
            '<b>' + record.status + '</b><br />' +
            '<hr>' + record.information
        );
    },

    // Function that is called when you click on a data point
    pointClick : function (value, record) {
        editForm.setVisibility(isc.Canvas.INHERIT);
        editWindow.editRecord(record);
    }
});

var editForm = isc.DynamicForm.create({
    autoDraw: false,
    visibility: "hidden",
    margin: 6,
    wrapItemTitles: false,

    fields: [
        {name: "commonName", title: "Common Name", type: "text"},
        {name: "scientificName", title: "Scientific Name", type: "text"},
        {name: "lifeSpan", title: "Life Span", type: "Integer"},
        {name: "diet", title: "Diet", type: "text"},
        {name: "status", title: "Status", valueMap: [
            "Threatened", "Endangered", "Not Endangered",
            "Not currently listed", "May become threatened", "Protected"
        ]},
        {name: "information", title: "Information", type: "textArea"},
        {type:"submit", title: "Save", colSpan: 2, align: "right"}
    ],

    submit : function () {
        // Update the record we are editing with the edited values
        isc.addProperties(editWindow.record, this.getValues());
        // And force the chart to redraw
        chart.setData(chart.data);
        // And dismiss the window
        editWindow.hide();
    }
});

// A window for editing data when you click on points in the graph.
var editWindow = isc.Window.create({
    autoDraw: false,
    isModal: true,
    showModalMask: true,
    dismissOnEscape: true,
    saveOnEnter: true,
    autoSize: true,
    autoCenter: true,
    showMinimizeButton: false,

    items: [
        // The window contains a form we will use to edit records
        editForm
    ],

    // Keep a reference to the record we are editing, for ease of updating
    record: null,

    // Shows the window and edits a record
    editRecord : function (record) {
        this.record = record;
        this.setTitle(record.commonName);
        this.show();
        editForm.editRecord(record);
    }
});
