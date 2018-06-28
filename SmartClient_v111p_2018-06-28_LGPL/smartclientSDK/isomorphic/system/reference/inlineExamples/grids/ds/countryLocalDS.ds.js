isc.DataSource.create({
    ID: "countryDS",
    fields:[
        {name:"countryCode", title:"Code"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"}
    ],
    clientOnly: true,
    testData: countryData
})
