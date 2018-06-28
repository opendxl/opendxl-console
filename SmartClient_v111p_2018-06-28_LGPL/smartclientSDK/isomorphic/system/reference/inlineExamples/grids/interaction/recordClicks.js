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
    recordClick: "countryDetails.setData(record)",
    recordDoubleClick: "isc.say('Double-clicked country: <b>'+record.countryName+'</b>')",
    rowContextClick: "isc.say('Context-clicked country: <b>'+record.countryName+'</b>'); return false;"
})


isc.DetailViewer.create({
    ID:"countryDetails",
    width:500, top:250,
    fields:[
        {name:"countryName", title:"Country"},
        {name:"countryCode", title:"Code"},
        {name:"government", title:"Government"},
        {name:"article", title:"More Information", type:"link", linkText:"Click here for more information"}
    ],
    emptyMessage:"click a row in the grid"
})
