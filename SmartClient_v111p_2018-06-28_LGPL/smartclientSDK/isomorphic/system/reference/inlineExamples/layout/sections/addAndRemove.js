isc.SectionStack.create({
    ID: "sectionStack",
    visibilityMode: "multiple",
    width: 300,
    height: 500,
    sections: [
        {title: "Blue Pawn", expanded: true, items: [
            isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/pawn_blue.png"})
        ]},
        {title: "Green Cube", expanded: true, canCollapse: false, items: [
            isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/cube_green.png"})
        ]},
        {title: "Blue Cube", expanded: false, items: [
            isc.Img.create({autoDraw: false, width: 48, height: 48, src: "pieces/48/cube_blue.png"})
        ]}
    ]
});

isc.IButton.create({
    width: 150,
    ID: "addButton",
    title: "Add Section",
    click: function () {
        // alternate adding yellow piece and blue cube
        if (sectionStack.sections.length % 2 == 1) {
            sectionStack.addSection({
                title: "Yellow Piece", 
                expanded: true, items: [
                    isc.Img.create({autoDraw: false, width: 48, height: 48, 
                                    src: "pieces/48/piece_yellow.png"})
                ]
            });
        } else {
            sectionStack.addSection({
                title: "Blue Cube", expanded: false, items: [
                    isc.Img.create({autoDraw: false, width: 48, height: 48, 
                                    src: "pieces/48/cube_blue.png"})
                ]
            });
        }
    }
});

isc.IButton.create({
    width: 150,
    ID: "removeButton",
    title: "Remove Section",
    click: function () {
        // remove last section
        sectionStack.removeSection(sectionStack.sections.length-1);
    }
});

isc.VLayout.create({
     left: 325,
     membersMargin: 10,
     members: [ addButton, removeButton ]
});
