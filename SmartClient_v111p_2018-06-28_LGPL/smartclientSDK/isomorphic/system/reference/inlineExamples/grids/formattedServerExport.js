isc.ListGrid.create({
    ID: "countryList",
    width:700, height:250, top:80, left: 10,
    alternateRecordStyles:true,
    dataSource: worldDSExportWithFormats,
    autoFetchData: true,
    fields:[
        {name:"countryName", title:"Country", width: "20%"},
        {name:"capital", title:"Capital", width: "20%"},
        {name:"continent", title:"Continent", width: "20%"},
        {name:"independence", title:"Nationhood", width: "20%"},
        {name:"area", width: "20%"}
    ],
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

