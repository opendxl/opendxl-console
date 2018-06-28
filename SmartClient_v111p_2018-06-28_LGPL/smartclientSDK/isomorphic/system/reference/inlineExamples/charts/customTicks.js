isc.FacetChart.create({
    ID: "multiScatterChart",
    chartType: "Scatter",

    width: "100%",
    showXTicks: true,

    gradationGaps: [2],
    otherAxisGradationTimes: ["1m","1y"],
    majorTickTimeIntervals: ["1q"],

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
           "Time": new Date(2015, 0, 2)
           ,"value":0.02
           ,animal:"Moose"
       },
       {
           "Time": new Date(2015, 0, 8)
           ,"value":0.15
           ,animal:"Moose"
       },
       {
           "Time": new Date(2015, 0, 22)
           ,"value":0.77
           ,animal:"Moose"
       },
       {
           "Time": new Date(2015, 1, 12)
           ,"value":0.87
           ,animal:"Moose"
       },
       {
           "Time": new Date(2015, 3, 1)
           ,"value":1.15
           ,animal:"Moose"
       },
       {
           "Time": new Date(2015, 6, 1)
           ,"value":1.15
           ,animal:"Moose"
       },
       {
           "Time": new Date(2016, 0, 1)
           ,"value":0.71
           ,animal:"Moose"
       },
       {
           "Time": new Date(2016, 3, 1)
           ,"value":0.67
           ,animal:"Moose"
       },
       {
           "Time": new Date(2016, 6, 1)
           ,"value":0.61
           ,animal:"Moose"
       },
       {
           "Time": new Date(2016, 9, 1)
           ,"value":0.41
           ,animal:"Moose"
       },
       {
           "Time": new Date(2016, 11, 31)
           ,"value":0.22
           ,animal:"Moose"
       },
       {
           "Time": new Date(2015, 0, 2)
           ,"value":0.02
           ,animal:"Platypus"
       },
       {
           "Time": new Date(2015, 0, 8)
           ,"value":0.28
           ,animal:"Platypus"
       },
       {
           "Time": new Date(2015, 0, 22)
           ,"value":0.71
           ,animal:"Platypus"
       },
       {
           "Time": new Date(2015, 1, 12)
           ,"value":0.81
           ,animal:"Platypus"
       },
       {
           "Time": new Date(2015, 3, 1)
           ,"value":1.06
           ,animal:"Platypus"
       },
       {
           "Time": new Date(2015, 6, 1)
           ,"value":1.06
           ,animal:"Platypus"
       },
       {
           "Time": new Date(2016, 0, 1)
           ,"value":0.52
           ,animal:"Platypus"
       },
       {
           "Time": new Date(2016, 11, 31)
           ,"value":0.10
           ,animal:"Platypus"
       }
    ]
});

isc.DynamicForm.create({
    ID: "multiScatterForm",
    titleWidth: 120,
    width: 220,
    items: [{
        type: "integer",
        editorType: "SelectItem",
        title: "Gradation Times",
        wrapTitle: false,
        defaultValue: 0,
        valueMap: {0: "Month/Year", 1: "Month/Quarter/Year"},
        autoDraw: true,
        changed: function (form, item, value) {
            multiScatterChart.setOtherAxisGradationTimes(
                value ? ["1m", "1q", "1y"] : ["1m", "1y"]);
        }
    }]
});

isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    minBreadthMember: multiScatterForm,
    members: [multiScatterForm, multiScatterChart]
});




