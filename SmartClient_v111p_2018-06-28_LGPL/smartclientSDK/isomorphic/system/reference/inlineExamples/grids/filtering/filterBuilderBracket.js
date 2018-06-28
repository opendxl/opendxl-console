isc.FilterBuilder.create({
    ID:"advancedFilter",
    dataSource:"worldDS",
    criteria: { _constructor: "AdvancedCriteria",
        operator: "and", criteria: [
            {fieldName: "continent", operator: "equals", value: "Europe"},
            {operator: "or", criteria: [
                {fieldName: "countryName", operator: "iEndsWith", value: "land"},
                {fieldName: "population", operator: "lessThan", value: 3000000}
            ]}
        ]
    }
});

isc.ListGrid.create({
    ID: "countryList",
    width:700, height:224, alternateRecordStyles:true, 
    dataSource: worldDS,
    fields:[
        {name:"countryName"},
        {name:"continent"},
        {name:"population"},
        {name:"area"},
        {name:"gdp"},
        {name:"independence", width:100}
    ]})

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

// Perform the initial filter
filterButton.click();