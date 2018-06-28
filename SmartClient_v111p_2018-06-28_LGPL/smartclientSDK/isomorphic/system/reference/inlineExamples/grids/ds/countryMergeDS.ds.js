isc.DataSource.create({
    ID: "countryDS",
    fields:[
        {name:"countryName", title:"Country"},
        {name:"countryCode", title:"Code"},
        {name:"independence", title:"Independence", type:"date"},
        {name:"population", title:"Population", type:"integer"},
        {name:"gdp", title:"GDP ($B)", type:"float"}
    ],
    clientOnly: true,
    testData: countryData
})
