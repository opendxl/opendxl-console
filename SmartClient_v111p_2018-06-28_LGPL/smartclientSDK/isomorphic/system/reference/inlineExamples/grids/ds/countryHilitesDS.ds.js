isc.DataSource.create({
    ID: "countryDSHilites",
    fields:[
        { name: "countryName", title:"Country" },
        { name: "countryCode", title:"Code" },
        { name: "independence", title:"Independence", type:"date" },
        { name: "population", title:"Population", type:"integer" },
        { name: "gdp", title:"GDP ($M)", type:"float" },
        { name: "area", title:"Area (km&sup2;)", type: "float" },
        { name: "population", type: "integer", title: "Population" },
        { name: "capital", type: "text", title: "Capital" },
        { name: "government", type: "text", title: "Government", length: 500 }
    ],
    clientOnly: true,
    testData: countryDataHilites
});


