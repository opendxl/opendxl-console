isc.defineClass("HelpCanvas", "Canvas").addProperties({
    autoDraw: false,
    padding: 10,
    overflow:"auto",
    contents: "<b>Severity 1</b> - Critical problem<br>System is unavailable in production or " +
              "is corrupting data, and the error severely impacts the user's operations." +
              "<br><br><b>Severity 2</b> - Major problem<br>An important function of the system " +
              "is not available in production, and the user's operations are restricted." +
              "<br><br><b>Severity 3</b> - Minor problem<br>Inability to use a function of the " +
              "system occurs, but it does not seriously affect the user's operations."

});

isc.SectionStack.create({
    ID: "sectionStack",
    visibilityMode: "multiple",
    width: 300, height: 350,
    border:"1px solid blue",
    sections: [
        {title: "Blue Pawn", expanded: true, resizeable:false, items: [
            isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_blue.png"})
        ]},
        {title: "Help 1", expanded: true, canCollapse: true, items: [ 
            isc.HelpCanvas.create({ ID:"help1", autoDraw:false })
        ]},
        {title: "Help 2", expanded: true, canCollapse: true, items: [ 
            isc.HelpCanvas.create({ ID:"help2", autoDraw:false })
        ]}
    ]
});

isc.IButton.create({
    left: 325,
    width: 150,
    title: "Resize Help 1",
    click: "help1.setHeight(200)"
});
