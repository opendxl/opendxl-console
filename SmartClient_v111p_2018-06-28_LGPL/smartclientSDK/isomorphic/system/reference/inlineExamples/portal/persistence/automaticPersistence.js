// The next tab shows the code for setting up the EditPane and the TilePalette.
// This code shows how to use a variable to save the state of the EditPane
// and then recreate it.

// This button will destroy the Edit Pane and then recreate it from saved state.
isc.IButton.create({
    ID: "destroyAndRecreateButton",
    title: "Destroy and Recreate",
    autoFit: true,
    layoutAlign: "right",

    destroyAndRecreateEditPane : function () {
        // We save the editPane node data in a variable
        var paletteNodes = editPane.getSaveData();
        
        // Animate the disappearnce of the pane, since otherwise
        // everything happens at once.
        editPane.animateFade(0, function () {
            // Once the animation is finished, remove the editPane
            // and destroy it.
            hlayout.removeMember(editPane);
            editPane.destroy();

            // Then recreate it ...
            editPane = isc.EditPane.create({
                ID: "editPane",
                editProxyProperties: {
                    autoMaskChildren: true
                }
            });
            hlayout.addMember(editPane);

            // Make the new editPane the default Edit Context for the palette,
            // to support double-clicking on components.
            tilePalette.setDefaultEditContext(editPane);

            // And recreate the nodes that we saved earlier
            paletteNodes.map (function (node) {
                editPane.addFromPaletteNode(node);
            });
        }, 2000, "smoothEnd");
    },

    click : function () {
        this.destroyAndRecreateEditPane();
    }
});

// This inserts the button into the overall layout for the example ... see next tab
vlayout.addMember(destroyAndRecreateButton, 0);
