isc.ListGrid.create({
    ID: "countryList",
    width:550, height:224, alternateRecordStyles:true,
    // use server-side dataSource so edits are retained across page transitions
    dataSource: countryDS,
    // display a subset of fields from the datasource
    fields:[
        {name:"countryName"},
        {name:"continent"},
        {name:"member_g8"},
        {name:"population"},
        {name:"independence"}
    ],
    autoFetchData: true,
    canEdit: true,
    editEvent: "click",
    listEndEditAction: "next",
    autoSaveEdits: false
})

isc.IButton.create({
    top:250,
    title:"Edit New",
    click:"countryList.startEditingNew()"
});


isc.IButton.create({
    top:250, left: 140,
    title:"Save",
    click:"countryList.saveAllEdits()"
});

isc.IButton.create({
    top:250, left: 280,
    title:"Discard",
    click:"countryList.discardAllEdits()"
});
