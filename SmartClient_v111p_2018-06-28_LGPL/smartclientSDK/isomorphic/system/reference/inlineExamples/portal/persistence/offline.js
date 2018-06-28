// The next tab contains the code for setting up the TilePalette and EditPane.
// This code shows how to persist the EditPane's state to Offline storage.

// This button will save the state of the EditPane to Offline storage.
isc.IButton.create({
    ID: "saveButton",
    title: "Save",

    saveEditPane : function () {
        var paletteNodes = editPane.getSaveData();
        isc.Offline.put("exampleEditPaneNodes", isc.JSON.encode(paletteNodes));
    },

    click : function () {
        this.saveEditPane();
    }
});

// This button will restore the state of the EditPane from Offline storage.
isc.IButton.create({
    ID: "restoreButton",
    title: "Restore",

    restoreEditPane : function () {
        // First, destroy the editPane
        hlayout.removeMember(editPane);
        editPane.destroy();

        // Then recreate it ...
        editPane = isc.EditPane.create({
            ID: "editPane"
        });
        hlayout.addMember(editPane);
        
        // And restore it as the default context
        tilePalette.setDefaultEditContext(editPane);

        // And recreate the saved EditNodes
        var paletteNodes = isc.Offline.get("exampleEditPaneNodes");
        if (paletteNodes) {
            isc.JSON.decode(paletteNodes).map(function (node) {
                editPane.addFromPaletteNode(node);
            });
        }
    },

    click: function () {
        this.restoreEditPane();
    }
});

// Insert the buttons into the example layout
isc.HLayout.create({
    ID: "buttons",
    membersMargin: 10,
    members: [
        isc.LayoutSpacer.create(),
        saveButton, 
        restoreButton
    ]
});

vlayout.addMember(buttons, 0);

// Automatically do a restore, to apply any previous offline content.
restoreButton.click();
