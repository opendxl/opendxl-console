isc.Calendar.create({
    ID: "eventCalendar", 
    data: eventOverlapData,
// the following are the Calendar's defaults and would still have been set without this code
    eventAutoArrange: true,
    eventOverlap: true,
    eventOverlapPercent: "10",             
    eventOverlapIdenticalStartTimes: false
});
// Once we have drawn the Calendar, scroll to the start of the working day
eventCalendar.scrollToTime("07:00");
