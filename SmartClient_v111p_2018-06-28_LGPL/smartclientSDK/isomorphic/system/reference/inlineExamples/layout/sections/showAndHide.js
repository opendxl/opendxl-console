isc.HTMLFlow.create({
    ID: "htmlFlow",
    overflow: "auto",
    padding:10,
    contents: "<b>Severity 1</b> - Critical problem<br>System is unavailable in production or " +
              "is corrupting data, and the error severely impacts the user's operations." +
              "<br><br><b>Severity 2</b> - Major problem<br>An important function of the system " +
              "is not available in production, and the user's operations are restricted." +
              "<br><br><b>Severity 3</b> - Minor problem<br>Inability to use a function of the " +
              "system occurs, but it does not seriously affect the user's operations."
})

isc.SectionStack.create({
    ID: "sectionStack",
    visibilityMode: "multiple",
    width: 300, height: 350,
    border:"1px solid blue",
    sections: [
        {title: "Blue Pawn", expanded: true, items: [
            isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_blue.png"})
        ]},
        {title: "HTMLFlow", expanded: true, canCollapse: true, items: [ htmlFlow ]},
        {title: "Green Cube", expanded: true, canCollapse: false, items: [
            isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/cube_green.png"})
        ]},
        {title: "Yellow Piece", hidden: true, items: [
            isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/piece_yellow.png"})
        ]}
    ]
});

isc.VLayout.create({
    ID:"layoutButtons",
    left:320,
    membersMargin:10,
    members:[
        isc.IButton.create({
            left: 325,
            width: 150,
            title: "Show Section",
            click: "sectionStack.showSection(3)"
        }),
        isc.IButton.create({
            left: 325,
            top: 30,
            width: 150,
            title: "Hide Section",
            click: "sectionStack.hideSection(3)"
        })
    ]
});

