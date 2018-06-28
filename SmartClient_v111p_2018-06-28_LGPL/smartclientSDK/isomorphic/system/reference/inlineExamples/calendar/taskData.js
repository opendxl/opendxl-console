var _today = isc.DateUtil.getStartOf(new Date(2016, 6, 5), "W");

var _start = _today.getDate() - _today.getDay();
var _month = _today.getMonth();
var _year = _today.getFullYear();

var events = [

{
    eventId: 1, 
    name: "Add new Timeline view",
    description: "Add a new calendar Timeline component",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 2), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 8), "D"),
    lane: "darcyFeeney"
},
{
    eventId: 2,
    name: "ListGrid field autoSize",
    description: "Complex field-autosizing in ListGrid",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start), "D"),
    lane: "kaiKong"
},
{
    eventId: 3,
    name: "PDF Import/Export",
    description: "Implement native PDF import/export",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 1), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 6), "D"),
    lane: "garretMonroe"
},
{
    eventId: 4, 
    name: "Calculated Fields",
    description: "Formula and Summary fields for ListGrid",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 4), "D"),
    lane: "charlesMadigen"
},
{
    eventId: 5,
    name: "ListGrid cell-level selection",
    description: "Implement spreadsheet-like selection in ListGrid",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 7), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 14), "D"),
    lane: "charlesMadigen"
},
{
    eventId: 6,
    name: "Text import",
    description: "Server text-import",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 16), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 20), "D"),
    lane: "charlesMadigen"
},
{
    eventId: 7,
    name: "TabIndex enhancements",
    description: "Enhance formItem tabindex handling",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 9), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 11), "D"),
    lane: "kaiKong"
},
{
    eventId: 8,
    name: "Visual Builder skin",
    description: "Skinning changes",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 3), "D"),
    lane: "shellyFewel"
},
{
    eventId: 9,
    name: "DataSource Transaction-handling",
    description: "This canvas is styled by color settings on the CalendarEvent",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 2), "D"),
    lane: "tamaraKane",
    // green header (and headerBorder) with white text, on lighgreen body with darkgreen text and border
    headerTextColor: "white",
    headerBackgroundColor: "green",
    headerBorderColor: "green",
    textColor: "darkgreen",
    borderColor: "darkgreen",
    backgroundColor: "lightgreen"
},
{
    eventId: 10,
    name: "New Samples",
    description: "Add 20 samples for the following new features: ...",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 4), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 20), "D"),
    lane: "tamaraKane"
},
{
    eventId: 11,
    name: "Localization",
    description: "Extend i18n support",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 9), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 14), "D"),
    lane: "darcyFeeney"
},
{
    eventId: 12,
    name: "New Language Packs",
    description: "Add these 4 new language packs: ...",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 16), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 18), "D"),
    lane: "darcyFeeney"
},
{
    eventId: 13,
    name: "ComponentXML",
    description: "Add the following features and update documentation: ...",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 5), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 11), "D"),
    lane: "shellyFewel"
},
{
    eventId: 14,
    name: "TileGrid",
    description: "This canvas is styled by color settings on the CalendarEvent",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 14), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 19), "D"),
    lane: "shellyFewel",
    // orange header with darkorange headerBorder and black text, on yellow-ish body with darkorange border and darkgreen text 
    headerTextColor: "black",
    headerBackgroundColor: "orange",
    headerBorderColor: "darkorange",
    textColor: "darkgreen",
    borderColor: "darkorange",
    backgroundColor: "#ffffcc"
},
{
    eventId: 15,
    name: "Dev Meeting",
    description: "This canvas is styled by a custom CalendarEvent.styleName",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 1), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 1), "D"),
    lane: "charlesMadigen",
    styleName: "testStyle",
    canEdit: false
},
{
    eventId: 16,
    name: "Dev Meeting",
    description: "This canvas is styled by a custom CalendarEvent.styleName",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 8), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 8), "D"),
    lane: "charlesMadigen",
    styleName: "testStyle",
    canEdit: false
},
{
    eventId: 17,
    name: "Dev Meeting",
    description: "This canvas is styled by a custom CalendarEvent.styleName",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 15), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 15), "D"),
    lane: "charlesMadigen",
    styleName: "testStyle",
    canEdit: false
},
{
    eventId: 18,
    name: "Oracle enhancements",
    description: "Add the following 11g-specific enhancements: ...",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 7), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 9), "D"),
    lane: "garretMonroe"
},
{
    eventId: 19,
    name: "Client export",
    description: "Excel export alterations",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 11), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 14), "D"),
    lane: "garretMonroe"
},
{
    eventId: 20,
    name: "Record Components",
    description: "New ListGrid recordComponent modes: ...",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 16), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 20), "D"),
    lane: "garretMonroe"
},
{
    eventId: 21,
    name: "SQLDataSource",
    description: "Enhancements to customSQL support",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 2), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 4), "D"),
    lane: "kaiKong"
},
{
    eventId: 22,
    name: "includeFrom",
    description: "Update support via includeFrom",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 6), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 8), "D"),
    lane: "kaiKong"
},
{
    eventId: 23,
    name: "FileItem",
    description: "Add milti-file upload support",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 14), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 16), "D"),
    lane: "kaiKong"
},
{
    eventId: 24,
    name: "Doc viewer",
    description: "Enhance documentation viewer with these additional syntax-hilites: ...",
    startDate: isc.DateUtil.getStartOf(new Date(_year, _month, _start + 18), "D"),
    endDate: isc.DateUtil.getEndOf(new Date(_year, _month, _start + 19), "D"),
    lane: "kaiKong"
}

];

