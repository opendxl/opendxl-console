var dataSource = isc.DataSource.create({
    clientOnly: true,
    fields: [
        {name: "name", title: "Name", type: "text"},
        {name: "email", title: "Email", type: "text",
            validators: [
                {type: "regexp", expression: "^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$"}
            ]
        }
    ]
});
                           
isc.DynamicForm.create({
    ID: "registrationForm",
    dataSource: dataSource,
    fields: [
        {name: "name", value: "John Smith", required: true},
        {name: "email", required: true},
        {type: "button", title: "Submit", width:80,
            click: function() {
                var audioIsSupported = isc.Sound.isSupported(),
                    docDir = isc.Page.getIsomorphicDocsDir() + "inlineExamples/audios/";
                if (registrationForm.validate()) {
                    if (audioIsSupported) isc.Sound.play(docDir + "success.mp3")
                    isc.say("Submission accepted");
                } else {
                    if (audioIsSupported) isc.Sound.play(docDir + "error.mp3")
                    isc.warn("Please complete all fields", "registrationForm.focus()", {title:"Submission Error"});
                }
            }
        }
    ]
});
