var developers = [
    { name: "charlesMadigen", title: "Charles Madigen", height: 80 },
    { name: "tamaraKane", title: "Tamara Kane", height: 80 },
    { name: "kaiKong", title: "Kai Kong", height: 100 },
    { name: "shellyFewel", title: "Shelly Fewel", height: 80 }
];

var _calStart = isc.DateUtil.getStartOf(new Date(2016, 6, 5), "W");
var _calEnd = _calStart.duplicate();
_calEnd.setDate(_calEnd.getDate() + 20);

isc.ToolStrip.create({
    ID: "toolstrip",
    width: "100%",
    members: [ 
        isc.ToolStripButton.create({
            ID: "minuteDay",
            title: "Minutes (12 hours, every 15 minute)",
            autoFit: true,
            click : function () {
                timeline.setResolution([ {unit:"hour"}, {unit:"minute"} ], "hour", 12, 15);
            }
        }),
        isc.ToolStripButton.create({
            ID: "hourDay",
            title: "Hours (1 day)",
            autoFit: true,
            click : function () {
                timeline.setResolution([ {unit:"day"}, {unit:"hour"} ], "hour", 24);
            }
        }),
        isc.ToolStripButton.create({
            ID: "dayWeek",
            title: "Days (3 weeks)",
            autoFit: true,
            click : function () {
                timeline.setResolution([ {unit:"week"}, {unit:"day"} ], "day", 21);
            }
        }),
        isc.ToolStripButton.create({
            ID: "week6Month",
            title: "Weeks (6 months)",
            autoFit: true,
            click : function () {
                timeline.setResolution([ {unit:"month"}, {unit:"week"} ], "month", 6);
            }
        }),
        isc.ToolStripButton.create({
            ID: "monthYear",
            title: "Months (1 year)",
            autoFit: true,
            click : function () {
                timeline.setResolution([ {unit:"year"}, {unit:"month"} ], "month", 12);
            }
        }),
        isc.ToolStripButton.create({
            ID: "monthQuarterYear",
            title: "Months (2 year, with quarters)",
            autoFit: true,
            click : function () {
                timeline.setResolution([ {unit:"year"}, {unit:"quarter"}, {unit:"month"} ], "month", 24);
            }
        })
    ]
});

isc.Timeline.create({
    ID: "timeline", 
    top: 60,
    height: 451,
    startDate: _calStart, 
    endDate: _calEnd,
    data: events,
    lanes: developers,
    headerLevels: [ { unit: "week" }, { unit: "day" } ],
    laneFields: [ { name: "title", title: "Developer", minWidth: 120, autoFitWidth: true } ],
    canEditLane: true,
    showEventDescriptions: true,
    laneEventPadding: 2,
    disableWeekends: false,
    showCellHovers: true
});
