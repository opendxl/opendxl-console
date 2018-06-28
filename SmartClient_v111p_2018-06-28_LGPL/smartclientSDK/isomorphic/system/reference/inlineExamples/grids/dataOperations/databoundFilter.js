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
    autoFetchData: true
})


isc.IButton.create({
    left:0, top:240, width:150,
    title:"Filter Country: united",
    click:"countryList.filterData({countryName:'United'})"
})


isc.IButton.create({
    left:170, top:240, width:150,
    title:"Filter Capital: port",
    click:"countryList.filterData({capital:'port'})"
})


isc.IButton.create({
    left:340, top:240, width:150,
    title:"Clear filter",
    click:"countryList.clearCriteria()"
})
