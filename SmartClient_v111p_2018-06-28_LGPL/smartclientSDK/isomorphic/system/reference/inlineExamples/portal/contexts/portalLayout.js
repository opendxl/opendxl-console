// A custom canvas class which has a context menu which
// you can use to change color
isc.defineClass("ColorMenuCanvas", "Canvas").addProperties({
    contextMenu: isc.Menu.create({
        autoDraw: false,
        
        // Generate the menuItems, since there are all similar
        data: ["red", "blue", "green", "black"].map(function (color) {
            return {
                title: color,
                checkIf : function (target) {
                    return target.backgroundColor == color;
                },
                click : function (target) {
                    // We set the background color in the ordinary way,
                    // and then use updateEditNode() (below) to record
                    // the state just-in-time, when serialization occurs
                    target.setBackgroundColor(color);
                }
            };
        })
    }),

    // This method is called just-in-time when serializing an EditContext,
    // so that you can update any properties that you want to
    // automatically persist.
    updateEditNode : function (editContext, editNode) {
        editContext.setNodeProperties(editNode, {
            backgroundColor: this.backgroundColor
        }, true);
    }
});

// A TreePalette contains a tree of components available
// for use, with default settings.
isc.TreePalette.create({
    ID: "treePalette",
    width: "25%",

    fields: [{
        name: "title",
        title: "Component"
    }],

    // We are supplying the component data inline for this example.
    // However, the TreePalette is a subclass of TreeGrid, so you could
    // also use a DataSource.
    data: isc.Tree.create({
        ID: "componentTree",
        root: {
            children: [{
                title: "Canvas",
                canDrag: false,
                isFolder: true,
                children: [{
                    // title is the normal TreeNode property
                    title: "Blue Canvas",
                    // type indicates the class of object to create for
                    // this component
                    type: "ColorMenuCanvas",
                    // defaults specifies the properties to use when
                    // creating the component
                    defaults: {
                        backgroundColor: "blue",
                        width: 60,
                        height: 60,
                        canDragResize: true,
                        keepInParentRect: true,
                        dragAppearance: "target"
                    }
                }, {
                    title: "Red Canvas",
                    type: "ColorMenuCanvas",
                    defaults: {
                        backgroundColor: "red",
                        width: 60,
                        height: 60,
                        canDragResize: true,
                        keepInParentRect: true,
                        dragAppearance: "target"
                    }
                }]
            }, {
                title: "Images",
                canDrag: false,
                isFolder: true,
                children: [{
                    title: "Alligator",
                    type: "Img",
                    defaults: {
                        canDragResize: true,
                        width: 60,
                        height: 60,
                        keepInParentRect: true,
                        dragAppearance: "target",
                        src: "../inlineExamples/tiles/images/Alligator.jpg"
                    }
                }, {
                    title: "Anteater",
                    type: "Img",
                    defaults: {
                        canDragResize: true,
                        width: 60,
                        height: 60,
                        keepInParentRect: true,
                        dragAppearance: "target",
                        src: "../inlineExamples/tiles/images/AntEater.jpg"
                    }
                }]
            }]
        }
    })
});

// Open the folders in the Tree
componentTree.openAll();

isc.EditPane.create({
    ID: "editPane",
    border: "1px solid black",
    editMode: false
});

// Make the new editPane the default Edit Context for the palette,
// to support double-clicking on components.
treePalette.setDefaultEditContext(editPane);
editPane.setDefaultPalette(treePalette);

// Add a PortalLayout to the editPane
var editNode = editPane.addFromPaletteNode({
    type: "PortalLayout",
    defaults: {
        width: "100%",
        height: "100%",
        canResizePortlets: true
    }
});
editPane.getEditContext().defaultParent = editNode;

isc.VLayout.create({
    ID: "vLayout",
    width: "100%",
    height: "100%",
    membersMargin: 10,
    members: [
        isc.HLayout.create({
            ID: "hLayout",
            membersMargin: 20,
            width: "100%",
            height: "100%",
            members: [
                treePalette,
                editPane
            ]
        })
    ]
});


// This button will destroy the Edit Portal and then recreate it from saved state.
isc.IButton.create({
    ID: "destroyAndRecreateButton",
    title: "Destroy and Recreate",
    autoFit: true,
    layoutAlign: "right",

    destroyAndRecreateEditPane : function () {
        // We save the editPane node data in a variable
        var paletteNodes = editPane.serializeAllEditNodes();

        // Animate the disappearance of the editPane, since otherwise
        // everything happens at once.
        editPane.animateFade(0, function () {
            // Once the animation is finished, destroy all the nodes
            editPane.destroyAll();

            // Then add them back from the serialized form
            editPane.addPaletteNodesFromXML(paletteNodes);

            // And make us visible again
            editPane.setOpacity(100);
        }, 2000, "smoothEnd");
    },

    click : function () {
        this.destroyAndRecreateEditPane();
    }
});

// This inserts the button into the overall layout for the example.
vLayout.addMember(destroyAndRecreateButton, 0);
