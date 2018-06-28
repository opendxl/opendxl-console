isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    selectionType: "multiple",
    canDragSelect: true,
    selectionUpdated : "selectedCountries.setData(recordList)"
})


isc.ListGrid.create({
    ID: "selectedCountries",
    width:250, height:100, top:250, alternateRecordStyles:true, showAllRecords:true,
    emptyMessage: "<b>nothing selected</b>",
    fields:[
        {name:"countryName", title:"Selected countries"}
    ]
})
