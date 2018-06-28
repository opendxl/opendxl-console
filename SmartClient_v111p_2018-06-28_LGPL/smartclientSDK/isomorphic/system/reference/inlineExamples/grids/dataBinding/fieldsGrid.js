isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true, 
    fields:[
        {name:"countryCode", title:"Code"},
        {name:"countryName", title:"Country"},
        {name:"independence", title:"Nationhood", type:"date", width:100},
        {name:"population", title:"Population", type:"integer"},
        {name:"gdp", title:"GDP", type:"float"}
    ],
    data: countryData
})
