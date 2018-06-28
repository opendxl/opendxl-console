// subclass of FacetChart with bars sized to match label widths
isc.defineClass("FittedChart", "FacetChart").addProperties({

    autoScrollData: true,
    autoScrollDataApproach: "clusters",

    initWidget : function () {
        this.Super("initWidget", arguments);
        // create a label that we'll use to choose the bar thickness
        var drawPane = isc.DrawPane.create({visibility: "hidden", 
                                            width: 200, height: 50});
        this.barSizingLabel = isc.DrawLabel.create({
            drawPane: drawPane}, this.dataLabelProperties);
    },

    getMinClusterSize : function (index, facetValueId) {
        // set facet value text into sizing label and measure width
        this.barSizingLabel.setContents(facetValueId);
        var box = this.barSizingLabel.getBoundingBox(true);
        return box[2] - box[0];
    }

});    

isc.FittedChart.create({
    ID: "scrollChart",
    minLabelGap: 5,

    valueProperty: "population",
    valueTitle: "Population (Thousands)",

    title: "2000 Census Population by State",

    data: statePopData,
    facets: [{ id: "state", title: "State" }],
    allowedChartTypes: ["Column", "Area", "Line"],

    setBarSizing : function (enabled) {
        var prototype = isc.FittedChart.getPrototype();
        this.getMinClusterSize = enabled ? prototype.getMinClusterSize : null;
        this.setAutoScrollDataApproach(enabled ? "clusters" : "labels");
    }
});

isc.DynamicForm.create({
    ID: "configForm",
    items: [{
        title: "Scroll Chart to Fit",
        height: 30, width:140,
        showTitle: false,
        defaultValue: true,
        type: "checkbox",
        name: "scroll",

        changed : function (form, item, value) {
            var sizing = form.getItem("sizing");
            if (!value) {
                scrollChart.setBarSizing(false);
                sizing.setValue(false);
            }
            sizing.setDisabled(!value);
            scrollChart.setAutoScrollData(value);
        }
    },{
        title: "Dynamic Bar Thickness",
        showTitle: false,
        type: "checkbox",
        defaultValue: true,
        name: "sizing",

        changed : function (form, item, value) {
            scrollChart.setBarSizing(value);
        }
    }]
});

isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [configForm, scrollChart]
});
