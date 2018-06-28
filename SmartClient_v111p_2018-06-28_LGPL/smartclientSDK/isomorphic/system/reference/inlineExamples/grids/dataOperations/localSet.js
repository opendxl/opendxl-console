isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ]
})


isc.IButton.create({
    left:0, top:240,
    title: "Show all",
    click: "countryList.setData(countryData)"
})

isc.IButton.create({
    left:130, top:240,
    title: "Show first 5",
    click: "countryList.setData(countryData.getRange(0,5))"
})

isc.IButton.create({
    left:260, top:240,
    title: "Show Europe",
    click: "countryList.setData(countryData.findAll('continent','Europe'))"
})
