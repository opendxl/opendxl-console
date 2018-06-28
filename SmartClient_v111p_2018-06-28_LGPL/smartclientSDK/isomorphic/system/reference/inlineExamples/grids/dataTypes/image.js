isc.ListGrid.create({
    ID: "countryList",
    width:200, height:224, alternateRecordStyles:true, 
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50,
            type: "image",
            imageURLPrefix: "flags/16/",
            imageURLSuffix: ".png"
        },
        {name:"countryName", title:"Country"}
    ]
})
