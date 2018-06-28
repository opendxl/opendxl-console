var chart = isc.FacetChart.create({
    autoDraw: false,
    width: 500,
    height: 400,
    chartType: "Column",
    stacked: true,
    valueTitle: "Percent",
    facets: [
       {
           id: "date"
       },
       {
           id: "area",
           values: [
               { id: "1", title: "North America" },
               { id: "2", title: "Europe" },
               { id: "3", title: "Asia-Pacific" }
           ]
       },
       {
           id: "metric",
           inlinedValues: true,
           values: [{
               id: "percent",
               title: "Percent"
           },
           {
               id: "events",
               title: "Events"
           }]
       }
    ],
    extraAxisMetrics: ["events"],
    extraAxisSettings: [{
       chartType: "Line",
       multiFacet: true,
       showDataPoints: true,
       valueTitle: "Events"
    }],
    data: [
       { area: "1", date: "13 Sep 16", percent: 0.55, events: 8751 },
       { area: "2", date: "13 Sep 16", percent: 0.32, events: 3210 },
       { area: "3", date: "13 Sep 16", percent: 0.21, events: 2071 },
       { area: "1", date: "14 Sep 16", percent: 0.49, events: 6367 },
       { area: "2", date: "14 Sep 16", percent: 0.41, events: 3771 },
       { area: "3", date: "14 Sep 16", percent: 0.22, events: 2166 },
       { area: "1", date: "15 Sep 16", percent: 0.7, events: 6011 },
       { area: "2", date: "15 Sep 16", percent: 0.19, events: 1950 },
       { area: "3", date: "15 Sep 16", percent: 0.25, events: 2375 },
       { area: "1", date: "16 Sep 16", percent: 0.47, events: 9234 },
       { area: "2", date: "16 Sep 16", percent: 0.25, events: 4321 },
       { area: "3", date: "16 Sep 16", percent: 0.3, events: 909 },
       { area: "1", date: "17 Sep 16", percent: 0.3, events: 6144 },
       { area: "2", date: "17 Sep 16", percent: 0.44, events: 4077 },
       { area: "3", date: "17 Sep 16", percent: 0.06, events: 1477 },
       { area: "1", date: "18 Sep 16", percent: 0.7, events: 8502 },
       { area: "2", date: "18 Sep 16", percent: 0.29, events: 3061 },
       { area: "3", date: "18 Sep 16", percent: 0.22, events: 2955 },
       { area: "1", date: "19 Sep 16", percent: 0.45, events: 7020 },
       { area: "2", date: "19 Sep 16", percent: 0.22, events: 3040 },
       { area: "3", date: "19 Sep 16", percent: 0.31, events: 2177 },
       { area: "1", date: "20 Sep 16", percent: 0.69, events: 6712 },
       { area: "2", date: "20 Sep 16", percent: 0.21, events: 4981 },
       { area: "3", date: "20 Sep 16", percent: 0.12, events: 1234 },
       { area: "1", date: "21 Sep 16", percent: 0.6, events: 9321},
       { area: "2", date: "21 Sep 16", percent: 0.29, events: 6532 },
       { area: "3", date: "21 Sep 16", percent: 0.35, events: 6622 },
       { area: "1", date: "22 Sep 16", percent: 0.37, events: 8389 },
       { area: "2", date: "22 Sep 16", percent: 0.35, events: 5104 },
       { area: "3", date: "22 Sep 16", percent: 0.3, events: 5111 },
       { area: "1", date: "23 Sep 16", percent: 0.4, events: 7555 },
       { area: "2", date: "23 Sep 16", percent: 0.34, events: 2345 },
       { area: "3", date: "23 Sep 16", percent: 0.16, events: 3456 },
       { area: "1", date: "24 Sep 16", percent: 0.62, events: 9567 },
       { area: "2", date: "24 Sep 16", percent: 0.12, events: 5678 },
       { area: "3", date: "24 Sep 16", percent: 0.37, events: 6789 }
    ],

    border: "1px solid black",
    showTitle: false,
    showChartRect: true,
    dataMargin: 12,
    barMargin: 27,
    minBarThickness: 25,
    dataColors: ["#fffd53", "#f8c14c", "#60ffff", "#97E997", "#F36050", "#7F62B4"]
});

isc.HStack.create({
    width: "100%",
    members: [chart]
});
