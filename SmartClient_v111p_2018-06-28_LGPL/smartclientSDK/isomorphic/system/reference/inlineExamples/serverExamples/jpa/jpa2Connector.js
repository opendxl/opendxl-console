isc.FilterBuilder.create({
    ID:"advancedFilter",
    dataSource:"worldJPA2"
});

isc.ListGrid.create({
    ID:"worldList",
    dataSource:worldJPA2,
    autoFitDateFields: "both",
    width:1000,
    height:224,
    alternateRecordStyles:true,
    autoFetchData:true,
    dataPageSize: 50,
    fields: [
        { name:"countryCode", title:"Code", width:50 },
        { name:"countryName", title:"Country" },
        { name:"capital", title:"Capital" },
        { name:"government", title:"Government", width: 100 },
        { name:"continent", title:"Continent" },
        { name:"independence", title:"Nationhood", width: 100 },
        { name:"area" },
        { name:"population", title:"Population" },
        { name:"gdp", title:"GDP ($M)" },
        { name:"member_g8", title:"Member of G8" }
    ]
});

isc.IButton.create({
    ID:"filterButton",
    title:"Filter",
    click : function () {
        worldList.filterData(advancedFilter.getCriteria());
    }
});

isc.VStack.create({
    membersMargin:10,
    members:[ advancedFilter, filterButton, worldList ]
});

