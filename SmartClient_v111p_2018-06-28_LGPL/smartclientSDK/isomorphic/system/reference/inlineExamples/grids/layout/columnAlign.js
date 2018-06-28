isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, top:100, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, align:"center", type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ]
})


isc.FormLayout.create({
    items:[{
        type:"radioGroup", showTitle:false,
        valueMap:["left","center","right"],
        defaultValue:"center",
        change:"countryList.getField('countryCode').align = value; countryList.markForRedraw()"
    }]
})
