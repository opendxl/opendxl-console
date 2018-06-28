isc.ListGrid.create({
    ID: "countryList",
    autoDraw:false,
    width:500, height:224, alternateRecordStyles:true,
    dataSource: worldDS,
    // display a subset of fields from the datasource
    fields:[
        {name:"countryCode"},
        {name:"countryName"},
        {name:"capital"},
        {name:"continent"}
    ],
    sortField: 1, // sort by countryName
    dataPageSize: 50,
    autoFetchData: true
})


isc.IButton.create({
    ID:"buttonRemoveFirst",
    width:140,
    autoDraw:false,
    title:"Remove first",
    click:"countryList.removeData(countryList.data.get(0))"
})


isc.IButton.create({
    ID:"buttonRemoverFirstSel",
    minWidth:140, autoFit:true,
    autoDraw:false,
    title:"Remove first selected",
    click: function () {
        if (countryList.getSelectedRecord()) {
            countryList.removeData(countryList.getSelectedRecord())
        }
    }
})


isc.IButton.create({
    ID:"buttonRemoveAllSel",
    width:140,
    autoDraw:false,
    title:"Remove all selected",
    click: function () {
        if (countryList.getSelection().getLength() > 0) {
            countryList.getSelection().map(function (item) { countryList.removeData(item) });
        }
    }
})

isc.HStack.create({
    ID:"hStackButtons",
    autoDraw:false,
    membersMargin:20,
    members: [ buttonRemoveFirst, buttonRemoverFirstSel, buttonRemoveAllSel ]
});

isc.VLayout.create({
    membersMargin:15,
    members: [ countryList, hStackButtons ]
});
