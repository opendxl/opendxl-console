isc.ListGrid.create({
    ID: "countryList",
    height:224, width:100, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country", width:100},
        {name:"capital", title:"Capital", width:100},
        {name:"continent", title:"Continent", width:100}
    ],
    autoFitData: "horizontal",
    leaveScrollbarGap: false
})

