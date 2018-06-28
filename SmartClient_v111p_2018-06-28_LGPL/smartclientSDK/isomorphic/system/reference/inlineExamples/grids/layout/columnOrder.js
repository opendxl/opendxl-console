isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital", showIf:"false"},
        {name:"continent", title:"Continent"}
    ],
    canReorderFields: true
})


isc.IButton.create({
    left:0, top:240,
    title:"Show Capitals",
    click:"countryList.showField('capital')"
})

isc.IButton.create({
    left:130, top:240,
    title:"Hide Capitals",
    click:"countryList.hideField('capital')"
})
