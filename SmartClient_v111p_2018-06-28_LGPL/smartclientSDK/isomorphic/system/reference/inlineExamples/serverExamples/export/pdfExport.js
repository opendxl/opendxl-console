isc.ListGrid.create({
    ID: "countryList",
    width:500, height:350, 
    alternateRecordStyles:true,
    data: countryData,
    fields: [
        {name: "countryName", title: "Country"},
        {name: "capital", title: "Capital"},
        {name: "continent", title: "Continent"}
    ],
    canExpandRecords: true,
    expansionMode: "detailField",
    detailField: "background"
});

isc.IButton.create({ 
    ID : "buttonPdf",
    width: 150,
    title:"Export",  
    click:function () {
        var settings = {
            skinName: "Enterprise", 
            pdfName: "export"// without .pdf
	    };
        isc.RPCManager.exportContent(mainLayout, settings);
    }
});
isc.IButton.create({ 
    ID : "buttonPreview",
    width: 150,
    title:"Show Print Preview",  
    click:function () {
        mainLayout.showPrintPreview();
    }
});
isc.HLayout.create({
    ID: "hLayout",
    membersMargin: 5,
    members: [
        buttonPdf,
        buttonPreview
    ]
});
isc.VLayout.create({
    ID: "mainLayout",
    width: 500,
    membersMargin: 5,
    height: 350,
    members: [
        countryList,
        hLayout
    ]
});
countryList.expandRecord(countryList.data[2]);
countryList.expandRecord(countryList.data[4]);
