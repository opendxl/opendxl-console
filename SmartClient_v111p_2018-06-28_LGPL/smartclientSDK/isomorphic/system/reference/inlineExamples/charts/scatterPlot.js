isc.FacetChart.create({
    ID: "multiScatterChart",
    title:"Multi Scatter",
    chartType: "Scatter",
    width: "100%",
    showScatterDataLabels:true,
    showScatterLines: true,
    dataLineType: "smooth",
    valueProperty:"value",
    facets: [
       { id:"metric",
         inlinedValues:true,
         values:[{id:"value"}, {id:"Time"}]
       },
       { id:"animal" }
    ],
    data: [
       {
           "Time":0.033,
           "value":0.02
           ,animal:"Moose"
       },
       {
           "Time":0.083,
           "value":0.15
           ,animal:"Moose"
       },
       {
           "Time":0.25,
           "value":0.77
           ,animal:"Moose"
       },
       {
           "Time":0.5,
           "value":0.87
           ,animal:"Moose"
       },
       {
           "Time":1,
           "value":1.15
           ,animal:"Moose"
       },
       {
           "Time":2,
           "value":1.15
           ,animal:"Moose"
       },
       {
           "Time":4,
           "value":0.71
           ,animal:"Moose"
       },
       {
           "Time":5,
           "value":0.67
           ,animal:"Moose"
       },
       {
           "Time":6,
           "value":0.61
           ,animal:"Moose"
       },
       {
           "Time":7,
           "value":0.41
           ,animal:"Moose"
       },
       {
           "Time":8,
           "value":0.22
           ,animal:"Moose"
       },
       {
           "Time":0.033,
           "value":0.02
           ,animal:"Platypus"
       },
       {
           "Time":0.083,
           "value":0.28
           ,animal:"Platypus"
       },
       {
           "Time":0.25,
           "value":0.71
           ,animal:"Platypus"
       },
       {
           "Time":0.5,
           "value":0.81
           ,animal:"Platypus"
       },
       {
           "Time":1,
           "value":1.06
           ,animal:"Platypus"
       },
       {
           "Time":2,
           "value":1.06
           ,animal:"Platypus"
       },
       {
           "Time":4,
           "value":0.52
           ,animal:"Platypus"
       },
       {
           "Time":8,
           "value":0.10
           ,animal:"Platypus"
       }
    ]
});

isc.DynamicForm.create({
    ID: "multiScatterForm",
    titleWidth: 120,
    width: 220,
    items: [{
        type: "select",
        title: "Show Lines",
        wrapTitle: false,
        defaultValue: "Smooth",
        valueMap: ["None", "Straight", "Smooth"],
        autoDraw: true,
        changed: function () {
            if (this.getValue() == "None") {
                multiScatterChart.setShowScatterLines(false);
            } else {
                if (this.getValue() == "Smooth") {
                    multiScatterChart.setDataLineType("smooth");
                } else {
                    multiScatterChart.setDataLineType("straight");
                }
                multiScatterChart.setShowScatterLines(true);
            }
        }
    }]
});

isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [multiScatterForm, multiScatterChart]
});
