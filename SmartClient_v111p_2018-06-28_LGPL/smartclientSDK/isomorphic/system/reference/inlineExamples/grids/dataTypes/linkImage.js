isc.ListGrid.create({
    ID: "countryList",
    width:300, height:224, cellHeight:24, alternateRecordStyles:true, 
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png", canEdit:false},
        {name:"countryName", title:"Country"},
        {name:"article", title:"Info",
            type: "link",
            width:50,
            align:"center",            
            linkText:isc.Canvas.imgHTML("other/openbook.png",24,24)
        }
    ]
})
