isc.SectionStack.create({
    autoDraw: false,
    ID: "printStack",
    visibilityMode: "multiple",
    width: 300, height: 450,
    border:"1px solid blue",
    sections: [
        {title: "Countries", expanded: true, items: [
            isc.ListGrid.create({
                autoDraw: false,
                ID: "printGrid",
                height:150, alternateRecordStyles:true,
                dataSource: worldDS,
                recordClick:"printViewer.setData(record)",
                fields: [
                    {name:"countryCode", title:"Code", width:50},
                    {name:"countryName", title:"Country"},
                    {name:"capital", title:"Capital"},
                    {name:"continent", title:"Continent"}
                ]
            })
        ]},
        {title: "Country Details", expanded: true, items: [
            isc.VStack.create({
                overflow: "auto",
                width:"100%",
                members: [
                    isc.DetailViewer.create({
                        autoDraw: false,
                        ID:"printViewer",
                        dataSource: worldDS,
                        width:"100%",
                        margin:"25",
                        emptyMessage:"Select a country to view its details"
                    })
                ]
            })
        ]}
    ]
});

isc.HLayout.create({
    autoDraw: false,
    membersMargin: 5,
    ID: "printButtonLayout", members: [
        isc.IButton.create({
            autoDraw: false,
            title: "New"
        }),
        isc.IButton.create({
            autoDraw: false,
            title: "Change"
        }),
        isc.IButton.create({ 
            autoDraw: false,            
            title:"Export",  
            click:function () {
               var settings = {
                   skinName: "Enterprise", 
                   pdfName: "export"// without .pdf
	           };
               isc.RPCManager.exportContent(printContainer, settings);
            }
        }),
        isc.IButton.create({
            autoDraw: false,
            title: "Print Preview",
            click: "isc.Canvas.showPrintPreview(printContainer)"
        })
    ]
});

isc.VLayout.create({
    membersMargin: 10,
    ID: "printContainer",
    members: [ printStack, printButtonLayout ]
});

// The filter is just to limit the number of records in the ListGrid - we don't want to print
// them all!
printGrid.filterData({countryName: "land"}, 
    function () { 
        printGrid.selectRecord(0); 
        printViewer.setData(printGrid.getSelectedRecord(0));
    }
);