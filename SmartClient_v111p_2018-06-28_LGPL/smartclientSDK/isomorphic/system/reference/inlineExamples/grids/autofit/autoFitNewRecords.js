
countryData = [

{
    countryCode:"US",
    countryName:"United States",
    population:298444215
},
{
    countryCode:"CH",
    countryName:"China",
    population:1313973713
},
{
    countryCode:"JA",
    countryName:"Japan",
    population:127463611
}];

isc.ListGrid.create({
    autoDraw: false,
    ID: "countryList",
    width:500, alternateRecordStyles:true, 
    autoFitMaxRecords: 6,
    autoFitData: "vertical",
    data: countryData,
    canEdit: true,
    editEvent: "click",
    listEndEditAction: "next",
    enterKeyEditAction: "nextRowStart",
    fields: [
        {name: "countryCode", title: "Country Code"},
        {name: "countryName", title: "Country Name"},
        {name: "population", title: "Population"}
    ]
})

isc.IButton.create({
    ID: "button",
    autoDraw: false,
    title:"Edit New",
    click:"countryList.startEditingNew()"
});

isc.VStack.create({
    membersMargin: 10,
    members: [
        countryList, button
    ]
});
