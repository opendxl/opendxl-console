isc.FacetChart.create({
    ID: "cityPopulationChangeChart",
    width: "100%",
    height: "100%",
    margin: 5,

    canZoom: true,
    zoomStartValue: "Abilene, Texas",
    zoomEndValue: "Greensboro, North Carolina",
    zoomChartHeight: 30,
    zoomChartProperties: { showInlineLabels: false },
    zoomShowSelection: false,

    chartType: "Column",
    data: populationData,
    barMargin: 2,
    minBarThickness: 2,
    labelCollapseMode: "sample",
    minLabelGap: 3,

    title: "Percentage Change in Populations of U.S. Cities from 2000 to 2009",
    facets: [{ id: "city", title: "City" }],
    valueProperty: "change",
    valueTitle: "% Change"
});

