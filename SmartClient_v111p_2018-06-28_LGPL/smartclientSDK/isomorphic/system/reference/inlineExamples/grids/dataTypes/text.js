isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true, 
    canEdit:true, editEvent:"click", modalEditing:true,
    data: countryData,
    fields:[
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ]
})
