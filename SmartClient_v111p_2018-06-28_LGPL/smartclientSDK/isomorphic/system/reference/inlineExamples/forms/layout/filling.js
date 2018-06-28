isc.VLayout.create({
    width: 230,
    height: 300,
    border:"1px solid blue", layoutMargin:5,
    members: [
        isc.HTMLFlow.create({
            ID: "textCanvas",
            prefix: "<b>Message from Rob:</b><BR>",
            padding:5,
            height: 1
        }),
        isc.DynamicForm.create({
            numCols: 2,
            height: "*",
            colWidths: [60, "*"],            
            fields: [
                {name: "subject",
                 title: "Subject",
                 type: "text",
                 width: "*",
                 defaultValue: "Re: your message"
                },
                {name: "message",
                 type: "text",
                 length: 5000,
                 showTitle: false,
                 colSpan: 2,
                 height: "*",
                 width: "*"
                }                
            ]
        })
    ]
});

isc.VStack.create({
    membersMargin: 10,
    left: 250,
    members: [
        isc.Button.create({
            width: 150,
            title: "Short message",
            message: "I'll be in town Saturday.  Give me a call on my cell and we'll get a bite to eat.",
            click: function () { textCanvas.setContents(textCanvas.prefix+this.message) }
        }),
        isc.Button.create({
            ID: "longMessageButton",
            width: 150,
            title: "Long message",
            message: "I'll be in town Saturday.  Give me a call on my cell and we'll check out the new Thai"
                    +" restaurant on Polk Street.  Jamie said it's great but too spicy for him, shouldn't be"
                    +" a problem for you :)",
            click: function () { textCanvas.setContents(textCanvas.prefix+this.message) }
        })
    ]
});


longMessageButton.click();
