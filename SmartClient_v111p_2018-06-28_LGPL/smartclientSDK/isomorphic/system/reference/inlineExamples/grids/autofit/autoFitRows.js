isc.ListGrid.create({
    ID: "countryList",
    width:500, top:50, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    autoFitData: "vertical",
    leaveScrollbarGap: false
})


isc.IButton.create({
    width:150,
    title:"Data set: 5 records",
    click:"countryList.setData(countryData.getRange(0,5))"
})

isc.IButton.create({
    left:170,
    width:150,
    title:"Data set: 10 records",
    click:"countryList.setData(countryData.getRange(0,10))"
})

isc.IButton.create({
    left:340,
    width:150,
    title:"Data set: 15 records",
    click:"countryList.setData(countryData)"
})
