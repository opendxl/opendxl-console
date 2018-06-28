var developers = [
    { name: "charlesMadigen", title: "Charles Madigen" },
    { name: "tamaraKane", title: "Tamara Kane" },
    { name: "darcyFeeney", title: "Darcy Feeney" },
    { name: "kaiKong", title: "Kai Kong" },
    { name: "shellyFewel", title: "Shelly Fewel" },
    { name: "garretMonroe", title: "Garret Monroe" }
];

var _calStart = isc.DateUtil.getStartOf(new Date(2016, 6, 5), "W");
var _calEnd = _calStart.duplicate();
_calEnd.setDate(_calEnd.getDate() + 20);

isc.Timeline.create({
    ID: "timeline", 
    height: 451,
    startDate: _calStart, 
    endDate: _calEnd,
    dataSource: tasks,
    autoFetchData: true,
    lanes: developers,
    headerLevels: [ { unit: "week" }, { unit: "day" } ],
    laneFields: [ { name: "title", title: "Developer", minWidth: 120, autoFitWidth: true } ],
    canEditLane: true,
    showEventDescriptions: false,
    columnsPerPage: 5
});
