// A serialized sample collage to show initially 
var sampleCollage = "<Img ID=\"Img0\" width=\"480\" height=\"280\" left=\"60\" top=\"60\" autoDraw=\"false\">\r\n <src>stockPhotos\/shutterstock_104226131.jpg<\/src>\r\n    <title>Photo 2<\/title>\r\n<\/Img>\r\n\r\n<Img ID=\"Img1\" width=\"480\" height=\"280\" left=\"540\" top=\"60\" autoDraw=\"false\">\r\n <src>stockPhotos\/shutterstock_107225813.jpg<\/src>\r\n <title>Photo 3<\/title>\r\n<\/Img>\r\n\r\n<Img ID=\"Img2\" width=\"440\" height=\"280\" left=\"180\" top=\"280\" autoDraw=\"false\">\r\n <src>stockPhotos\/shutterstock_113330455.jpg<\/src>\r\n <title>Photo 4<\/title>\r\n<\/Img>\r\n\r\n<Img ID=\"Img3\" width=\"480\" height=\"260\" left=\"540\" top=\"340\" autoDraw=\"false\">\r\n <src>stockPhotos\/shutterstock_102554147.jpg<\/src>\r\n <title>Photo 1<\/title>\r\n<\/Img>\r\n";


// The TilePalette contains components available
// for use, with default settings.
isc.TilePalette.create({
    ID: "tilePalette",
    width: 300,
    tileWidth: 125,
    tileHeight: 125,
    canDragTilesOut: true,

    // List of photos that will be placed on palette node tiles for selection
    photos: [
        "shutterstock_102554147.jpg",
        "shutterstock_104226131.jpg",
        "shutterstock_107225813.jpg",
        "shutterstock_113330455.jpg",
        "shutterstock_115306546.jpg",
        "shutterstock_115736281.jpg",
        "shutterstock_127886615.jpg",
        "shutterstock_127992746.jpg",
        "shutterstock_68247031.jpg",
        "shutterstock_69642121.jpg",
        "shutterstock_69642124.jpg",
        "shutterstock_94938694.jpg",
        "shutterstock_97530329.jpg",
        "shutterstock_98725502.jpg"
    ],

    // customize TileGrid fields so that images from paletteNodes are shown right in the tiles
    fields: [{
        name: "type",
        formatCellValue : function (value, record, rowNum, colNum, grid) {
            var docsDir = isc.Page.getIsomorphicDocsDir();
            return "<img src='" + docsDir + "exampleImages/" + 
                     record.defaults.src + 
                     "' width='100' height='100'>";
        }
    },{
        name: "title",
        title: "Component"
    }],

    
    initWidget : function () {
        this.Super("initWidget", arguments);
        this.setData(this.generateData());
    },
    
    // We are supplying the component data inline for this example.
    // However, the TilePalette is a subclass of TileGrid, so you could
    // also use a dataSource.
    generateData : function () {
        var data = [];

        for (var i = 0; i < this.photos.length; i++) {
            var title = "Photo " + (i+1);
            data[i] = {
                title: title,
                type: "Img",
                defaults: {
                    title: title,
                    src: "stockPhotos/" + this.photos[i]
                }
            };
        }
        return data;
    }
});



// The editCanvas is the root component in which the items can be placed.
// This canvas will not be serialized - only the child nodes.
isc.Canvas.create({
    ID: "editCanvas",
    border: isc.EditPane.getInstanceProperty("border"),
    width: "100%",
    height: "100%",

    editProxyProperties: {
        // Mask contained components for editing
        autoMaskChildren: true,
        // Enable snapToGrid for all children.
        // In EditMode this also triggers display of the visual grid when
        // dragging and resizing.
        childrenSnapToGrid: true
    }
});

var editContext = isc.EditContext.create({
    defaultPalette: tilePalette,

    // Enable Canvas-based component selection, positioning and resizing support
    canSelectEditNodes: true,

    rootComponent: {
        type: "Canvas",
        liveObject: editCanvas
    }
});

// Set the defaultEditContext on palette which is used when double-clicking on components.
tilePalette.setDefaultEditContext(editContext);

// Place editCanvas into editMode to allow paletteNode drops
var editCanvasEditNode = editContext.getRootEditNode();
editCanvas.setEditMode(true, editContext, editCanvasEditNode);

// Place sample collage into editContext
editContext.addPaletteNodesFromXML(sampleCollage);

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
                editCanvas
            ]
        })
    ]
});

isc.IButton.create({
    ID: "showComponentXMLButton",
    title: "Show Component XML",
    autoFit: true,

    click : function () {
        var paletteNodes = editContext.serializeAllEditNodes();

        var syntaxHiliter = isc.XMLSyntaxHiliter.create(),
            formattedText = syntaxHiliter.hilite(paletteNodes),
            window = isc.Window.create({
                width: Math.round(vlayout.getWidth() / 2),
                defaultHeight: Math.round(vlayout.getHeight() * 2/3),
                title: "Component XML",
                autoCenter: true,
                showMinimizeButton: false,
                canDragResize: true,
                isModal: true,
                keepInParentRect: true,
                items: [
                    isc.Canvas.create({
                        contents: formattedText,
                        canSelectText: true
                    })
                ]
            })
        ;

        window.show();
    }
});

isc.IButton.create({
    ID: "reloadSampleButton",
    title: "Reload Sample Collage",
    autoFit: true,

    click : function () {
        // Destroy all the nodes
        editContext.destroyAll();

        // Recreate sample drawing
        editContext.addPaletteNodesFromXML(sampleCollage);
    }
});

isc.IButton.create({
    ID: "clearButton",
    title: "Clear Collage",
    autoFit: true,

    click : function () {
        // Destroy all the nodes
        editContext.destroyAll();
    }
});

// This button will clear the editContext and then recreate it from saved state.
isc.IButton.create({
    ID: "destroyAndRecreateButton",
    title: "Destroy and Recreate",
    autoFit: true,

    click : function () {
        // We save the context node data in a variable
        var paletteNodes = editContext.serializeAllEditNodes();

        // Animate the disappearance of the editCanvas, since otherwise
        // everything happens at once.
        editCanvas.animateFade(0, function () {
            // Once the animation is finished, destroy all the nodes
            editContext.destroyAll();

            // Then add them back from the serialized form
            editContext.addPaletteNodesFromXML(paletteNodes);

            // And make us visible again
            editCanvas.setOpacity(100);
        }, 2000, "smoothEnd");
    }
});

// Create button bar
isc.HLayout.create({
    ID: "actionBar",
    membersMargin: 10,
    width: "100%",
    height: 30,
    members: [
        isc.LayoutSpacer.create({ width: "*" }),
        showComponentXMLButton,
        isc.LayoutSpacer.create({ width: 20 }),
        reloadSampleButton,
        clearButton,
        isc.LayoutSpacer.create({ width: 20 }),
        destroyAndRecreateButton
    ]
});

// inserts the action buttons into the overall layout for the example
vlayout.addMember(actionBar, 0);
