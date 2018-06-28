isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ]
})


isc.IButton.create({
    left:0, top:240, width:140,
    title:"Remove first",
    click:"countryList.data.remove(countryList.data.get(0))"
})


isc.IButton.create({
    left:160, top:240, minWidth:140, autoFit:true,
    title:"Remove first selected",
    click:"countryList.data.remove(countryList.getSelectedRecord())"
})


isc.IButton.create({
    left:320, top:240, width:140,
    title:"Remove all selected",
    click:"countryList.data.removeList(countryList.getSelection())"
})


countryList.selectRecord(0); // select first record automatically
