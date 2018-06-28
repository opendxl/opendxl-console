isc.Calendar.create({
    ID: "eventCalendar", 
    data: eventOverlapData,
    eventAutoArrange: true,
    eventOverlap: false
});

// Once we have drawn the Calendar, scroll to the start of the working day
eventCalendar.scrollToTime("07:00");
