isc.ListGrid.create({
    ID: "countryList",
    width:800, height:250, top:75, left: 10,
    alternateRecordStyles:true,
    dataSource: worldDSExport,
    autoFetchData: true,
    fields:[
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"},
        {name:"independence", type: "date", title:"Nationhood", format:"ddd MMMM dd yyyy", width:150},
        {name:"population", type: "number", title:"Population", format:",0"},
        {name:"gdp", title:"GDP", type: "float", format: ",0.00"}    ],
    showFilterEditor: true
});

isc.DynamicForm.create({
    ID: "exportForm",
    width:300, top: 10,
    fields: [
        { name: "exportType", title: "Export Type", type:"select", width:"*",
            defaultToFirstOption: true,
            valueMap: { 
                "csv" : "CSV" , 
                "xml" : "XML", 
                "json" : "JSON",
                "xls" : "XLS (Excel97)",
                "ooxml" : "OOXML (Excel2007)"
            }
        },
        { name: "showInWindow", title: "Show in Window", type: "boolean", align:"left" }
    ]
});

isc.Button.create({
   ID: "exportButton",
   title: "Export",
   left: 320, top: 10,
   click: function () {
       var exportAs = exportForm.getField("exportType").getValue();
       var showInWindow = exportForm.getField("showInWindow").getValue();
       if (exportAs == "json") {
           // JSON exports are server-side only
           isc.say("For security reasons, client-sourced requests for JSON exports are not " +
                   "allowed.  Please use a different format.");
       } else {
           countryList.exportClientData({ exportAs: exportAs,
               exportDisplay: showInWindow ? "window" : "download", lineBreakStyle: "dos"
           });
       }
   }
});

