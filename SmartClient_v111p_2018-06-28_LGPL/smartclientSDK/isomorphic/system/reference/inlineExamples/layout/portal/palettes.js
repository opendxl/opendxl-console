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
                        width: 120,
                        height: 120,
                        backgroundColor: "blue",
                        canDragReposition: true,
                        canDragResize: true,
                        keepInParentRect: true,
                        dragAppearance: "target"
                    }
                },{
                    title: "Red Canvas", 
                    type: "Canvas", 
                    defaults: {
                        width: 120,
                        height: 120,
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
                        width: 120,
                        height: 120,
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
                        width: 120,
                        height: 120,
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

// Open the folders in the Tree
componentTree.openAll();

isc.PortalLayout.create({
    ID: "portalLayout"
});

isc.HLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 10,
    members: [
        portalLayout,
        treePalette
    ]
});
