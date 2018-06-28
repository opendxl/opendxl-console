// The MenuPalette contains a menu of components available
// for use, with default settings.
isc.MenuPalette.create({
    ID: "menuPalette",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
   
    // We are supplying the component data inline for this example.
    // However, the MenuPalette is a DataBoundComponent, so you could
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

// The MenuButton for the menu
isc.MenuButton.create({
    ID: "menuButton",
    title: "Components",
    autoFit: true,
    menu: menuPalette
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
menuPalette.setDefaultEditContext(editPane);

// Layout for the example
isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [
        menuButton,
        editPane
    ]
});
