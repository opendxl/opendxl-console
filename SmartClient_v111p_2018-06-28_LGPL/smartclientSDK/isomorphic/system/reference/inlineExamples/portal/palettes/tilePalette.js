// The TilePalette contains components available
// for use, with default settings.
isc.TilePalette.create({
    ID: "tilePalette",
    width: 300,
    tileWidth: 125,
    tileHeight: 135,
    canDragTilesOut: true,

    // The usual TileGrid property, specifying how to draw the fields
    // for the tiles. We use a custom formatCellValue function to
    // draw the tiles in a way that reflects some of their default
    // values ... you would customize depending on which default values
    // are useful to present in this way. Note that formatCellValue() only affects
    // the appearance of the components in the TilePalette itself ... it
    // has no effect on how the components appear in the EditPane once
    // instantiated there (that is controlled by the "defaults" specified
    // below).
    fields: [{
        name: "type",
        formatCellValue : function (value, record, rowNum, colNum, grid) {
            if (value == "Canvas") {
                return "<div style='background-color: " +
                       record.defaults.backgroundColor + 
                       "; width: 100px; height: 100px; margin-left: auto; margin-right: auto;'>";
            } else if (value == "Img") {
                return "<img src='" + 
                         record.defaults.src + 
                         "' width='100' height='100'>";
            }
        }
    },{
        name: "title",
        title: "Component"
    }],

    // We are supplying the component data inline for this example.
    // However, the TilePalette is a subclass of TileGrid, so you could
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
            src: "/isomorphic/system/reference/inlineExamples/tiles/images/Alligator.jpg" 
        }
    },{
        title: "Anteater",
        type: "Img",
        defaults: {
            canDragReposition: true,
            canDragResize: true,
            keepInParentRect: true,
            dragAppearance: "target",
            src: "/isomorphic/system/reference/inlineExamples/tiles/images/AntEater.jpg" 
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
tilePalette.setDefaultEditContext(editPane);

// Layout for the example. The layouts are nested because this
// is used as a basis for other examples, in which some
// user interface elements are added.
isc.VLayout.create({
    ID: "vlayout",
    width: "100%",
    height: "100%",
    membersMargin: 10,
    members: [
        isc.HLayout.create({
            ID: "hlayout",
            membersMargin: 20,
            width: "100%",
            height: "100%",
            members: [
                tilePalette,
                editPane
            ]
        })
    ]
});
