isc.DynamicForm.create({
    width: 200,
    fields : [
        {name: "severityLevel",
         title: "Severity Level",
         wrapTitle: false,
         editorType: "StaticTextItem",
         defaultValue: "Severity 2",
         helpText: "<br><b>Severity 1</b> - Critical problem<br>System is unavailable in production or " +
                   "is corrupting data, and the error severely impacts the user's operations." +
                   "<br><br><b>Severity 2</b> - Major problem<br>An important function of the system " +
                   "is not available in production, and the user's operations are restricted." +
                   "<br><br><b>Severity 3</b> - Minor problem<br>Inability to use a function of the " +
                   "system occurs, but it does not seriously affect the user's operations.",
         icons: [{
            src: "other/help.png",
            click: "isc.say(item.helpText)"
         }]
        }
    ]
});
