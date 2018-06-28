isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    fields:[
    // move countryCode before country name and replace with flag image/title
        {name:"countryCode", title:"Flag", width:40, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName"},
    // change title and alignment of independence date
        {name:"independence", title:"Nationhood", align:"center", width:100},
    // change format of population from the one on the DataSource
        {name:"population", format:"0.0"},
    // format GDP as $M instead of $B
        {name:"gdp", title:"GDP ($M)", formatCellValue:"isc.NumberUtil.format(value*1000, ',0')"}
    ],
    dataSource: countryDS,
    autoFetchData: true
})
