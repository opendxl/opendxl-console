isc.FilterBuilder.create({
    ID:"advancedFilter",
    dataSource:"supplyItemHB"
});

isc.ListGrid.create({
    ID: "itemList",
    width:550, height:224, alternateRecordStyles:true, 
    dataSource: supplyItemHB,
    fields:[
        {name:"itemName", width: "35%"},
        {name:"SKU", width: "15%"},
        {name:"description", width: "35%"},
        {name:"unitCost", width: "15%"}
    ],
    autoFetchData: true
})

isc.IButton.create({
    ID:"filterButton",
    title:"Filter",
    click : function () {
        itemList.filterData(advancedFilter.getCriteria());
    }
})

isc.VStack.create({
    membersMargin:10,
    members:[ advancedFilter, filterButton, itemList ]
})