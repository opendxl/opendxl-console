isc.ListGrid.create({
    ID: "countryList",
    width:550, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country", width:90},
        {name:"independence", title:"Nationhood", type:"date", width:100},
        {name:"area", title:"Area (km&sup2;)", type:"float", format:",0"},
        {name:"gdp_percap", title:"GDP (per capita)", align:"right",
            formatCellValue: function (value, record) {
                var gdpPerCapita = Math.round(record.gdp*1000000000/record.population);
                return isc.NumberUtil.format(gdpPerCapita, "\u00A4,0.00");
            },
            sortNormalizer: function (record) {
                return record.gdp/record.population;
            }
        }
    ],
    // initial sort on Area, high-to-low
    sortField: 3,
    sortDirection: "descending"
})
