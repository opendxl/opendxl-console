isc.FilterBuilder.create({
    ID:"advancedFilter",
    dataSource:"countryDS"
});

isc.ListGrid.create({
    ID: "countryList",
    width:550, height:224, alternateRecordStyles:true, 
    dataSource: countryDS,
    fields:[
        {name:"countryName"},
        {name:"continent"},
        {name:"member_g8"},
        {name:"population"},
        {name:"independence"}
    ],
    autoFetchData: true
})

isc.IButton.create({
    ID:"filterButton",
    title:"Filter",
    click : function () {
        countryList.filterData(advancedFilter.getCriteria());
    }
})

isc.VStack.create({
    membersMargin:10,
    members:[ advancedFilter, filterButton, countryList ]
})
