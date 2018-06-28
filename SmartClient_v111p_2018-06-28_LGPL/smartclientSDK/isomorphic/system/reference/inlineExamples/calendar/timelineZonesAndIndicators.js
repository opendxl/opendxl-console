var developers = [
    { name: "charlesMadigen", title: "Charles Madigen", devGroup: "Managers" },
    { name: "tamaraKane", title: "Tamara Kane", devGroup: "Developers" },
    { name: "darcyFeeney", title: "Darcy Feeney", devGroup: "Managers" },
    { name: "kaiKong", title: "Kai Kong", devGroup: "Developers" },
    { name: "shellyFewel", title: "Shelly Fewel", devGroup: "Managers" },
    { name: "garretMonroe", title: "Garret Monroe", devGroup: "Developers" }
];

var _calStart = isc.DateUtil.getStartOf(new Date(2016, 6, 5), "W");
var _calEnd = _calStart.duplicate();
_calEnd.setDate(_calEnd.getDate() + 20);

isc.Timeline.create({
    ID: "timeline", 
    height: 451,
    startDate: _calStart, 
    endDate: _calEnd,
    data: events,
    lanes: developers,
    headerLevels: [ { unit: "week" }, { unit: "day" } ],
    laneFields: [ { name: "title", title: "Developer", minWidth: 120, autoFitWidth: true } ],
    canEditLane: true,
    showEventDescriptions: false,
    columnsPerPage: 5,
    disableWeekends: false,
    laneEventPadding: 2,
    eventSnapGap: 360, // 6-hour snapGap
    
    showZones: true,
    zones: [
        { name: "Week 27 - July 3-6", startDate: new Date(2016, 6, 3, 3), endDate: new Date(2016, 6, 6, 9) },
        { name: "Week 28 - July 10-14", startDate: new Date(2016, 6, 10, 20), endDate: new Date(2016, 6, 14, 14) }
    ],
        
    showIndicators: true,
    indicators: [
        { name: "July 4 - noon", description: "Independence day", startDate: new Date(2016, 6, 4, 12) }
    ]

});
