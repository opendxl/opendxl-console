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
        {title: "Yellow Piece", expanded: false, items: [
            isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/piece_yellow.png"})
        ]}
    ]
});

isc.VLayout.create({
    left: 325,
    membersMargin: 8,
    members: [
        isc.IButton.create({
            width: 150,
            title: "Expand Blue",
            click: "sectionStack.expandSection(0)"
        }),
        isc.IButton.create({
            width: 150,
            title: "Collapse Blue",
            click: "sectionStack.collapseSection(0)"
        })
    ]
});
