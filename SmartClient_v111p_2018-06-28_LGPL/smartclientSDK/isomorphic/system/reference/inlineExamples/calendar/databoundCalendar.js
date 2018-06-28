// using a client-only dataSource so that test data is always relative to the current date
isc.DataSource.create({
    ID: "eventDS",
    fields:[
        {name:"eventId", primaryKey: true, type: "sequence"},
        {name:"name"},
        {name:"description"},
        {name:"startDate", type: "datetime"},
        {name:"endDate", type: "datetime"}
    ],
    clientOnly: true,
    testData: eventData
        
});     

isc.Calendar.create({
    ID: "eventCalendar", 
    dataSource: eventDS, autoFetchData: true
});
