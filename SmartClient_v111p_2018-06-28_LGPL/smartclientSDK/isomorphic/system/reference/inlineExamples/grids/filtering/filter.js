isc.ListGrid.create({
    ID: "countryList",
    width:500, height:300, alternateRecordStyles:true,
    dataSource: worldDS,
    fields:[
        {name:"countryCode", title:"Code", width:60},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    autoFetchData: true,
    showFilterEditor: true
})
