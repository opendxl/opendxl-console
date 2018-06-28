isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png", canEdit:false},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"independence", title:"Nationhood", type:"date", emptyCellValue:"--"}
    ],
    canEdit:true, editByCell:true, modalEditing:true,
    emptyCellValue: "unknown"
})
