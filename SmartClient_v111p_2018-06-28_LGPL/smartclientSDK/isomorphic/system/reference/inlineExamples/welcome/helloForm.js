isc.DynamicForm.create({
    autoFocus: true,
    numCols: 3,
    items:[
        {
            type: "text",
            name: "you",
            title: "Enter your name",
            selectOnFocus: true,
            wrapTitle: false,
            defaultValue: "my friend"
        },
        {
            type: "button",
            title: "Hello",
            width: 80,
            startRow: false,
            icon: "icons/16/message.png",
            click: "isc.say('Hello ' + form.getValue('you') + '!')"
        }
    ]
})
