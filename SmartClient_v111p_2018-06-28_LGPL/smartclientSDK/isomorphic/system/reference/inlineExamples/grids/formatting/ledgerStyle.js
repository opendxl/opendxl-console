isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ]
})


isc.IButton.create({
    left:0, top:240,
    title:"Ledger on",
    click:"countryList.body.alternateRowStyles = true; countryList.markForRedraw();"
})

isc.IButton.create({
    left:120, top:240,
    title:"Ledger off",
    click:"countryList.body.alternateRowStyles = false; countryList.markForRedraw();"
})
