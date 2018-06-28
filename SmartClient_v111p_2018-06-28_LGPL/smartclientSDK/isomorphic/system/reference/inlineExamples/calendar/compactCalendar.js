isc.DataSource.create({
        ID: "eventDS",
        fields:[
            {name:"eventId", primaryKey: true, type: "sequence"},
            {name:"name"},
            {name:"description"},
            {name:"startDate"},
            {name:"endDate"}
        ],
        clientOnly: true,
        testData: eventData
        
});     

isc.Calendar.create({
        ID: "eventCalendar", 
        width: 500,
        height: 220,
        showDayView: false,
        showWeekView: false,
        showOtherDays: false,
        showDayHeaders: false,
        showDateChooser: false,
        showDatePickerButton: false,
        showAddEventButton: false,
        disableWeekends: false,
        dataSource: eventDS,
        autoFetchData: true,
        canCreateEvents : false,
        getDayBodyHTML : function (date, events, calendar, rowNum, colNum) {
            returnStr = date.getDate() + " ";
            if (events && events.length > 0) {
                returnStr += this.imgHTML("icons/16/approved.png", 16, 16, "image");
            }
            return returnStr;
        },
        dayBodyClick : function (date, events, calendar, rowNum, colNum) {
            var nameStr="";
            if (events.length == 0) nameStr = "No events"; 
            for (var i=0; i<events.length; i++) {
                nameStr += isc.Time.toShortTime(events[i].startDate) + " " + events[i].name + "<BR/>";   
            }
            isc.say(nameStr, {title:date.toUSShortDate()});    
        }
});
