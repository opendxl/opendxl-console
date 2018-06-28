isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, top:50, alternateRecordStyles:true,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    showEmptyMessage: true,
    emptyMessage: "Click the <b>Set data</b> button to populate this grid."
})


isc.IButton.create({
    left:0,
    title:"Set data",
    click:"countryList.setData(countryData)"
})

isc.IButton.create({
    left:130,
    title:"Clear data",
    click:"countryList.setData([])"
})
