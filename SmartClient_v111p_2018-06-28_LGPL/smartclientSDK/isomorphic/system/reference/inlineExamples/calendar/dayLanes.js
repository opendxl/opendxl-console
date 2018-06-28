
var lanes = [
    { name: "charlesMadigen", title: "Charles Madigen", width: 200 },
    { name: "tamaraKane", title: "Tamara Kane", width: 200 },
    { name: "darcyFeeney", title: "Darcy Feeney", width: 200 },
    { name: "kaiKong", title: "Kai Kong", width: 200 },
    { name: "shellyFewel", title: "Shelly Fewel", width: 200 }
];

isc.Calendar.create({
    ID: "calendar", 
    top: 40,
    data: dayLaneData,
    lanes: lanes,
    showWeekView: false,
    showMonthView: false,
    showTimelineView: false,

    chosenDate: new Date(),

    showDayLanes: true,
    canEditLane: true
    
});
