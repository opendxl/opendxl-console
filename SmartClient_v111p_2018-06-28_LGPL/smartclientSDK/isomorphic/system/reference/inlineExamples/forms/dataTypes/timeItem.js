isc.DynamicForm.create({
    ID: "timeForm",
    wrapItemTitles: false,
    fields: [
        {name: "textTime", title: "Time #1", type: "time"},
        {name: "pickTime", title: "Time #2", type: "time",
         minuteIncrement: 15,
         useTextField: false}
    ]
});

isc.Button.create({
    ID: "showButton",
    width: 125,
    title: "Show Time Values",
    getTime: function (itemName) {
        var item = timeForm.getItem(itemName);
        var inputTime = item.getValue();
        return isc.Time.toTime(inputTime);
    },
    click: function () {
        isc.say("Time #1: " + this.getTime("textTime") + "<br>" + 
                "Time #2: " + this.getTime("pickTime"));
    }
});

isc.VStack.create({
    membersMargin: 10,
    members: [ timeForm, showButton]
    });
