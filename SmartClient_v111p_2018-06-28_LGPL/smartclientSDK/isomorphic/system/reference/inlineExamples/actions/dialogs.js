isc.Button.create({
    title: "Confirm",
    click : function () {
        isc.confirm("Proceed with Operation get AJAX?",
                    "answer.setContents(value ? 'OK' : 'Cancel')");
    }
});

isc.Button.create({
    title: "Ask",
    left: 150,
    click : function () {
        isc.ask("Are you going to stop writing great code?",
                "answer.setContents(value ? 'Yes' : 'No')");
    }
});

isc.Button.create({
    title: "Ask For Value",
    left: 300,
    click : function () {
        isc.askForValue("What is your name?",
                    "answer.setContents('Your name is ' + value)");
    }
});

isc.Label.create({
    ID: "answer",
    contents: "Your answer here...",
    top: 50,
    width: 300
});
