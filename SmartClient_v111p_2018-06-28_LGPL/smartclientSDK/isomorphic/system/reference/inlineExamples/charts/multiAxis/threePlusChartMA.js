var chart = isc.FacetChart.create({
    autoDraw: false,
    width: 600,
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
               { id: "1", title: "North America" }
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
           },
           {
               id: "throughput",
               title: "Throughput"
           }]
       }
    ],
    extraAxisMetrics: ["events", "throughput"],
    extraAxisSettings: [{
       chartType: "Line",
       multiFacet: true,
       showDataPoints: true,
       valueTitle: "Events"
       },
       {
       chartType: "Area",
       multiFacet: true,
       showDataPoints: true,
       valueTitle: "Throughput"
    }],
    data: [
       { area: "1", date: "13 Sep 16", percent: 0.55, events: 8751, throughput: 20 },
       { area: "2", date: "13 Sep 16", percent: 0.32, events: 3210, throughput: 24 },
       { area: "3", date: "13 Sep 16", percent: 0.21, events: 2071, throughput: 28 },
       { area: "1", date: "14 Sep 16", percent: 0.49, events: 6367, throughput: 30 },
       { area: "2", date: "14 Sep 16", percent: 0.41, events: 3771, throughput: 36 },
       { area: "3", date: "14 Sep 16", percent: 0.22, events: 2166, throughput: 39 },
       { area: "1", date: "15 Sep 16", percent: 0.7, events: 6011, throughput: 41 },
       { area: "2", date: "15 Sep 16", percent: 0.19, events: 1950, throughput: 45 },
       { area: "3", date: "15 Sep 16", percent: 0.25, events: 2375, throughput: 48 },
       { area: "1", date: "16 Sep 16", percent: 0.47, events: 9234, throughput: 51 },
       { area: "2", date: "16 Sep 16", percent: 0.25, events: 4321, throughput: 55 },
       { area: "3", date: "16 Sep 16", percent: 0.3, events: 909, throughput: 59 },
       { area: "1", date: "17 Sep 16", percent: 0.3, events: 6144, throughput: 54 },
       { area: "2", date: "17 Sep 16", percent: 0.44, events: 4077, throughput: 50 },
       { area: "3", date: "17 Sep 16", percent: 0.06, events: 1477, throughput: 52 },
       { area: "1", date: "18 Sep 16", percent: 0.7, events: 8502, throughput: 48 },
       { area: "2", date: "18 Sep 16", percent: 0.29, events: 3061, throughput: 44 },
       { area: "3", date: "18 Sep 16", percent: 0.22, events: 2955, throughput: 42 },
       { area: "1", date: "19 Sep 16", percent: 0.45, events: 7020, throughput: 53 },
       { area: "2", date: "19 Sep 16", percent: 0.22, events: 3040, throughput: 59 },
       { area: "3", date: "19 Sep 16", percent: 0.31, events: 2177, throughput: 53 },
       { area: "1", date: "20 Sep 16", percent: 0.69, events: 6712, throughput: 48 },
       { area: "2", date: "20 Sep 16", percent: 0.21, events: 4981, throughput: 42 },
       { area: "3", date: "20 Sep 16", percent: 0.12, events: 1234, throughput: 45 },
       { area: "1", date: "21 Sep 16", percent: 0.6, events: 9321, throughput: 48},
       { area: "2", date: "21 Sep 16", percent: 0.29, events: 6532, throughput: 49 },
       { area: "3", date: "21 Sep 16", percent: 0.35, events: 6622, throughput: 45 },
       { area: "1", date: "22 Sep 16", percent: 0.37, events: 8389, throughput: 48 },
       { area: "2", date: "22 Sep 16", percent: 0.35, events: 5104, throughput: 51 },
       { area: "3", date: "22 Sep 16", percent: 0.3, events: 5111, throughput: 55 },
       { area: "1", date: "23 Sep 16", percent: 0.4, events: 7555, throughput: 49 },
       { area: "2", date: "23 Sep 16", percent: 0.34, events: 2345, throughput: 52 },
       { area: "3", date: "23 Sep 16", percent: 0.16, events: 3456, throughput: 57 },
       { area: "1", date: "24 Sep 16", percent: 0.62, events: 9567, throughput: 60 },
       { area: "2", date: "24 Sep 16", percent: 0.12, events: 5678, throughput: 55 },
       { area: "3", date: "24 Sep 16", percent: 0.37, events: 6789, throughput: 51 }
    ],

    border: "1px solid black",
    showTitle: false,
    showChartRect: true
});

isc.HStack.create({
    width: "100%",
    members: [chart]
});
