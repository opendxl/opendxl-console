isc.ListGrid.create({
    ID: "countryList",
    width:550, height:224, alternateRecordStyles:true,
    // use server-side dataSource so edits are retained across page transitions
    dataSource: countryDS,
    // display a subset of fields from the datasource
    fields:[
        {name:"countryCode", title:"Flag", width:40, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png", canEdit:false},
        {name:"countryName"},
        {name:"continent"},
        {name:"member_g8"},
        {name:"population"},
        {name:"independence"}
    ],
    autoFetchData: true,
    canEdit: true,
    editEvent: "click",
    editByCell: true
})
