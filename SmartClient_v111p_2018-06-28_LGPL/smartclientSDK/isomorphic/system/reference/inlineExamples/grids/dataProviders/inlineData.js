isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    fields:[
        {name:"countryCode", title:"Code"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"}
    ],
    data:[
        {countryCode:"US", countryName:"United States", capital:"Washington, DC"},
        {countryCode:"CH", countryName:"China", capital:"Beijing"},
        {countryCode:"JA", countryName:"Japan", capital:"Tokyo"},
        {countryCode:"IN", countryName:"India", capital:"New Delhi"},
        {countryCode:"GM", countryName:"Germany", capital:"Berlin"},
        {countryCode:"UK", countryName:"United Kingdom", capital:"London"},
        {countryCode:"FR", countryName:"France", capital:"Paris"},
        {countryCode:"IT", countryName:"Italy", capital:"Rome"},
        {countryCode:"RS", countryName:"Russia", capital:"Moscow"},
        {countryCode:"BR", countryName:"Brazil", capital:"Brasilia"},
        {countryCode:"CA", countryName:"Canada", capital:"Ottawa"},
        {countryCode:"MX", countryName:"Mexico", capital:"Mexico (Distrito Federal)"},
        {countryCode:"SP", countryName:"Spain", capital:"Madrid"},
        {countryCode:"KS", countryName:"South Korea", capital:"Seoul"},
        {countryCode:"ID", countryName:"Indonesia", capital:"Jakarta"}
    ]
})
