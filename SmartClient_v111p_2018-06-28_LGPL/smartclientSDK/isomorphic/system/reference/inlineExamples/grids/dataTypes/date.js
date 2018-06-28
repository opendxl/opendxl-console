isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    canEdit:true, editEvent:"click", modalEditing:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png", canEdit:false},
        {name:"countryName", title:"Country"},
        {name:"independence", title:"Nationhood",
            type: "date"
        }
    ]
})
