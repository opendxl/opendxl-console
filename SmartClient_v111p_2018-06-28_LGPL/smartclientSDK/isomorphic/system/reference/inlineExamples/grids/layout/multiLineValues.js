isc.ListGrid.create({
    ID: "countryList",
    width:"100%", height:"100%", alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryName", title:"Country", width:120},
        {name:"background", title:"Background"},
        {name:"countryCode", title:"Flag", align:"center", width:50, type:"image", imageSize:24, imageURLPrefix:"flags/24/", imageURLSuffix:".png"}
    ],
    wrapCells: true,
    cellHeight: 56
})
