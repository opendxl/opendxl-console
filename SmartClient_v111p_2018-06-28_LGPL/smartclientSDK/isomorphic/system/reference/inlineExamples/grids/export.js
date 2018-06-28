isc.ListGrid.create({
    ID: "countryList",
    width:500, height:250, top:70, alternateRecordStyles:true,
    dataSource: worldDSExport,
    autoFetchData: true,
    fields:[
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"},
        {name:"independence", title:"Nationhood", width:100},
        {name:"population", title:"Population"}
    ],
    showFilterEditor: true
});

isc.DynamicForm.create({
    ID: "exportForm",
    width:300,
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
   left: 320,
   click: function () {
       var exportAs = exportForm.getField("exportType").getValue();
       var showInWindow = exportForm.getField("showInWindow").getValue();
       if (exportAs == "json") {
           // JSON exports are server-side only, so use the OperationBinding on the DataSource
           countryList.exportData({ operationId: "customJSONExport", 
               exportDisplay: showInWindow ? "window" : "download"});
       } else {
           // exportAs is not JSON, so we can set that with requestProperties
           countryList.exportData({ exportAs: exportAs,
               exportDisplay: showInWindow ? "window" : "download"
           });
       }
   }
});

