isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"independence", title:"Nationhood", type:"date", format: "MMM d, yyyy", width: "25%"},
        {name:"area", title:"Area", type:"number", format: ",0 km&sup2;"}
    ]
})
