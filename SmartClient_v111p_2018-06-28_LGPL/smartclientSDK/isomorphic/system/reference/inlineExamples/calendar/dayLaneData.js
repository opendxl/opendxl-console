var _today = new Date();
var y = _today.getFullYear();
var m = _today.getMonth();
var d = _today.getDate();

var dayLaneData = [
{
	eventId: 1,
	startDate: new Date(y, m, d, 8, 0), 
	endDate: new Date(y, m, d, 12, 0), 
	name: "Development Meeting",
    description: "This canvas is styled and disabled by custom styleName and canEdit settings on the CalendarEvent",
	lane: "charlesMadigen",
    styleName: "testStyle",
    canEdit: false
},
{
	eventId: 2,
	startDate: new Date(y, m, d, 14, 0), 
	endDate: new Date(y, m, d, 18, 0), 
	name: "Mgmt Meeting",
	description: "Management Meeting",
	lane: "charlesMadigen"
},

{
	eventId:3,
	startDate: new Date(y, m, d, 4, 0), 
	endDate: new Date(y, m, d, 12, 0), 
	name: "Data Cleansing",
    description: "This canvas is styled by color settings on the CalendarEvent",
	lane: "tamaraKane",
    // orange header with darkorange headerBorder and black text, on yellow-ish body with darkorange border and darkgreen text 
    headerTextColor: "black",
    headerBackgroundColor: "orange",
    headerBorderColor: "darkorange",
    textColor: "darkgreen",
    borderColor: "darkorange",
    backgroundColor: "#ffffcc"
},
{
	eventId: 4,
	startDate: new Date(y, m, d, 7, 30), 
	endDate: new Date(y, m, d, 12, 0), 
	name: "Data Migration",
    description: "Data Migration",
	lane: "tamaraKane"
},
{
	eventId: 5,
	startDate: new Date(y, m, d, 13, 0), 
	endDate: new Date(y, m, d, 16, 0), 
	name: "Documentation",
    description: "Product documentation",
	lane: "tamaraKane"
},

{
	eventId: 6,
	startDate: new Date(y, m, d, 8, 0), 
	endDate: new Date(y, m, d, 20, 0), 
	name: "Support",
    description: "Telephone Support",
	lane: "darcyFeeney"},
{
	eventId: 7,
	startDate: new Date(y, m, d, 11, 0), 
	endDate: new Date(y, m, d, 11, 30), 
	name: "Break",
    description: "Morning break",
	lane: "darcyFeeney"
},
{
	eventId: 8,
	startDate: new Date(y, m, d, 16, 0), 
	endDate: new Date(y, m, d, 16, 30), 
	name: "Break",
    description: "Afternoon break",
	lane: "darcyFeeney"
},

{
	eventId: 9,
	startDate: new Date(y, m, d, 0, 0), 
	endDate: new Date(y, m, d, 8, 0), 
	name: "Premium Support",
    description: "This canvas is styled by color settings on the CalendarEvent",
	lane: "kaiKong",
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
	startDate: new Date(y, m, d, 20, 0), 
	endDate: new Date(y, m, d, 23, 59), 
	name: "Support",
    description: "Premium Support (overnight response)",
	lane: "kaiKong"
},

{
	eventId: 11,
	startDate: new Date(y, m, d, 8, 0), 
	endDate: new Date(y, m, d, 12, 0), 
	name: "Development Meeting",
    description: "Development Meeting",
	lane: "shellyFewel"
},
{
	eventId: 12,
	startDate: new Date(y, m, d, 13, 30), 
	endDate: new Date(y, m, d, 17, 30), 
	name: "Team Meeting",
    description: "Developer Team Meeting",
	lane: "shellyFewel"
}

];
