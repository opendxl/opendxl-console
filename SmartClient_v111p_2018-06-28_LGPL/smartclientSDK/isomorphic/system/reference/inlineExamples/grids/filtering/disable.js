isc.ListGrid.create({
    ID: "countryList",
    width:500, height:300, alternateRecordStyles:true, cellHeight: 30,
    dataSource: worldDS,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageSize:24, imageURLPrefix:"flags/24/", imageURLSuffix:".png",
            canFilter:false
        },
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital",
            canFilter:false
        },
        {name:"continent", title:"Continent"}
    ],
    autoFetchData: true,
    showFilterEditor: true
})
