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
    title:"Add EU (top)",
    left:0, top:240, width:160,
    click: function () {

        countryList.data.addAt(
            {countryCode:"EU", countryName:"European Union", capital:"Brussels", continent:"Europe"},
            0 // first position in the data set
        )
        
    }
})


isc.IButton.create({
    title:"Add Australia (bottom)",
    left:170, top:240, width:160,
    click: function () {

        countryList.data.add( // add() defaults to last position in the data set
            {countryCode:"AS", countryName:"Australia", capital:"Canberra", continent:"Australia/Oceania"}
        )

    }
})
