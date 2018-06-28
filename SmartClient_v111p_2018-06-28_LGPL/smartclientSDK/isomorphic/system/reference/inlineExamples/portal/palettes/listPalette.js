// The ListPalette contains components available
// for use, with default settings.
isc.ListPalette.create({
    ID: "listPalette",
    width: "25%",
  
    // The regular ListGrid property
    fields: [
        {name: "title", title: "Component"}
    ],

    // We are supplying the component data inline for this example.
    // However, ListPalette is a subclass of ListGrid, so you could
    // also use a dataSource.
    data: [{
        // Title as you want it to appear in the list
        title: "Blue Canvas",
        // type indicates the class of object to create for
        // this component
        type: "Canvas",
        // defaults specifies the properties to use when
        // creating the component
        defaults: {
            backgroundColor: "blue",
            // By default, the EditPane will persist coordinates
            // so setting canDrag and canDragResize is enough
            // to allow simple editing of coordinates. You can
            // turn the persistence of coordinates off in EditPane
            // if you want to allow for editing them in a different
            // way.
            canDragReposition: true,
            canDragResize: true,
            keepInParentRect: true,
            dragAppearance: "target"
        }
    },{
        title: "Red Canvas", 
        type: "Canvas", 
        defaults: {
            backgroundColor: "red",
            canDragReposition: true,
            canDragResize: true,
            keepInParentRect: true,
            dragAppearance: "target"
        }
    },{
        title: "Alligator",
        type: "Img",
        defaults: {
            canDragReposition: true,
            canDragResize: true,
            keepInParentRect: true,
            dragAppearance: "target",
            src: "../inlineExamples/tiles/images/Alligator.jpg" 
        }
    },{
        title: "Anteater",
        type: "Img",
        defaults: {
            canDragReposition: true,
            canDragResize: true,
            keepInParentRect: true,
            dragAppearance: "target",
            src: "../inlineExamples/tiles/images/AntEater.jpg" 
        }
    }]
});

// The EditPane is the area in which the components can be placed
isc.EditPane.create({
    ID: "editPane",
    editProxyProperties: {
        autoMaskChildren: true
    }
});

// Make the editPane the default target when double-clicking on
// components in the listPalette
listPalette.setDefaultEditContext(editPane);

// Layout for the example
isc.HLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [
        listPalette,
        editPane
    ]
});
