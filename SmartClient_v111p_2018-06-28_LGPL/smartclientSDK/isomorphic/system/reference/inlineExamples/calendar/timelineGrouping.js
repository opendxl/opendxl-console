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
    canEditLane: true,
    showEventDescriptions: false,
    columnsPerPage: 5,
    laneEventPadding: 2,
    disableWeekends: false,
    // grouping settings
    canGroupLanes: true,
    laneGroupByField: "devGroup",
    laneFields: [
        { name: "title", title: "Developer", minWidth: 120, autoFitWidth: true },
        // fields which can be grouped must be declared here
        { name: "devGroup", hidden: true }
    ]
});
