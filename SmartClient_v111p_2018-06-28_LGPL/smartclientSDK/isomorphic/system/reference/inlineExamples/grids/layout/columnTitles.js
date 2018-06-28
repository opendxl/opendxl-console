isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, top:50, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    canReorderFields: false
})


isc.IButton.create({
    left:0,
    title:"\"Name\"",
    click:"countryList.setFieldProperties(1, {title:'Name'})"
})

isc.IButton.create({
    left:130,
    title:"\"Country\"",
    click:"countryList.setFieldProperties(1, {title:'Country'})"
})
