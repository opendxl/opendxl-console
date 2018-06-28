// The TreePalette contains a tree of components available
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
    // also use a dataSource.
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
                }]
            },{
                title: "Images",
                canDrag: false,
                isFolder: true,
                children: [{
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
            }]
        }
    })
});

// The EditPane is the area in which the components can be placed
isc.EditPane.create({
    ID: "editPane",
    editProxyProperties: {
        autoMaskChildren: true
    }
});

// Make the editPane the default target when double-clicking on
// components in the treePalette
treePalette.setDefaultEditContext(editPane);

// Open the folders in the Tree
componentTree.openAll();

// Layout for the example
isc.HLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 20,
    members: [
        treePalette,
        editPane
    ]
});
