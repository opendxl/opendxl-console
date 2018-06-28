// The next tab contains the code for setting up the TilePalette and EditPane.
// This code shows how to persist the EditPane's state to a DataSource.

// This button will save the state of the EditPane to a DataSource
isc.IButton.create({
    ID: "saveButton",
    title: "Save",

    saveEditPane : function () {
        // editPane.getSaveData returns the state of the editPane
        // as an array of EditNodes.
        var paletteNodes = editPane.getSaveData();
        var ds = isc.DataSource.get("editNodes");

        // First we delete the existing data on the server. This
        // example is set up with a table where each row represents
        // one EditNode in this EditPane. In an application, you would
        // likely use criteria to filter fetchData, to delete only
        // the relevant EditNodes.
        ds.fetchData(null, function (dsResponse, data, dsRequest) {

            // Use the transaction queue feature of RPCManager to combine the
            // DataSource operations into a single HTTP request.
            isc.RPCManager.startQueue();

            data.map(function (record) {
                ds.removeData(record);
            });

            // Then we insert our new data. The "defaults" field in
            // the node is an object with properties, so we serialize
            // it to a string (to be stored in a text field on the server).
            // Depending on how you set up your DataSource, another strategy
            // would be to serialize the entire EditNode to a string, or
            // serialize the entire array of EditNodes to a string.
            paletteNodes.map(function (node) {
                node.defaults = isc.JSON.encode(node.defaults);
                ds.addData(node);
            });

            // Send the queued DataSource requests to the server.
            isc.RPCManager.sendQueue();
        });
    },

    click : function () {
        this.saveEditPane();
    }
});

// This button restores the state of the EditPane from the DataSource.
isc.IButton.create({
    ID: "restoreButton",
    title: "Restore",

    restoreEditPane : function () {
        // Remove the editPane and destroy it
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
        
        // And restore it as the default context
        tilePalette.setDefaultEditContext(editPane);

        // And recreate the nodes that we saved earlier. In a real
        // application, you would use criteria to filter the relevant
        // EditNodes.
        var ds = isc.DataSource.get("editNodes");
        ds.fetchData(null, function (dsResponse, data, dsRequest) {
            // See the note above concerning the structure of the DataSource.
            // This DataSource has one row for each EditNode, so we
            // serialize the "defaults" property into a text field.
            // You could also set up the DataSource so that the whole
            // EditNode was serialized to a string, or the whole
            // array of EditNodes.
            data.map(function (node) {
                node.defaults = isc.JSON.decode(node.defaults);
                editPane.addFromPaletteNode(node);
            });
        });
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

// Automatically do a restore, to apply any previously saved content.
restoreButton.click();
