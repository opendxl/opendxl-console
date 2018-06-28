isc.ListGrid.create({
    ID: "countryList",
    width:500, height:232, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    headerHeight: 30,
    showHeader: false
})


isc.IButton.create({
    left:0, top:250,
    title:"Show header",
    click:"countryList.setShowHeader(true);"
})

isc.IButton.create({
    left:130, top:250,
    title:"Hide header",
    click:"countryList.setShowHeader(false);"
})
