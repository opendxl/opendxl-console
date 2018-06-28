isc.ListGrid.create({
    ID: "countryList",
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
    autoFetchData: true,
    selectionType: "single"
})


isc.IButton.create({
    left:0, top:240, width:150,
    title:"Continent > Europe",
    click: function () {
        if (!countryList.getSelectedRecord()) return; // nothing selected
        var updatedRecord = isc.addProperties(
            countryList.getSelectedRecord(),
            {continent:"Europe"}
        );        
        countryList.updateData(updatedRecord);
    }
})

isc.IButton.create({
    left:170, top:240, width:150,
    title:"Continent > Asia",
    click: function () {
        if (!countryList.getSelectedRecord()) return; // nothing selected
        var updatedRecord = isc.addProperties(
            countryList.getSelectedRecord(),
            {continent:"Asia"}
        );        
        countryList.updateData(updatedRecord);
    }
})
