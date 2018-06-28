isc.ListGrid.create({
    ID: "countryList1",
    width:325, height:224,
    data: countryData1,
    canDragRecordsOut:true, canAcceptDroppedRecords:true, 
    canReorderRecords:true, dragDataAction:"move",
    fields:[
        {name:"countryCode", title:"Flag", frozen:true, width:40,
         type: "image", imageURLPrefix: "flags/16/", imageURLSuffix: ".png"},
        {name:"countryName", frozen:true, title:"Country", width:100},
        {name:"capital", title:"Capital", width:100},
        {name:"continent", title:"Continent", width:100},
        {name:"government", title:"Government", width:100},
        {name:"independence", title:"Independence", type:"date", width:100},
        {name:"population", title:"Population", width:100, type:"int"}
    ]
})


isc.ListGrid.create({
    ID: "countryList2",
    left:350, width:225, height:224,
    data: countryData2,
    canDragRecordsOut:true, canAcceptDroppedRecords:true,
    canReorderRecords:true, dragDataAction:"move",
    fields:[
        {name:"countryName", title:"Country"}
    ]
})
