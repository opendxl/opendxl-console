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
    selectionType: "single"
})


isc.IButton.create({
    left:0, top:240, width:150,
    title:"Continent > Europe",
    click: function () {
        countryList.getSelectedRecord().continent = "Europe";
        countryList.markForRedraw();
    }
})

isc.IButton.create({
    left:170, top:240, width:150,
    title:"Continent > Asia",
    click: function () {
        countryList.getSelectedRecord().continent = "Asia";
        countryList.markForRedraw();
    }
})


countryList.selectRecord(0); // select first record automatically
