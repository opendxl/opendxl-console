// Palette Node used to create a default portal
var initialPortalPaletteNode = {
    type: "PortalLayout",
    defaults: {
        width: "100%",
        height: "100%",
        canResizePortlets: true
    }
};

// Grid to display the list of available dashboards
isc.ListGrid.create({
    ID: "dashboardList",
    dataSource: "dashboards",
    autoFetchData: true,
    selectionType: "single",
    sortField: "description",
    leaveScrollbarGap: false,

    // Allow edit of portal description (via context menu)
    canEdit: true,
    editEvent: "none",
    // And removal of dashboards
    canRemoveRecords: true,

    fields: [ { name: "description" } ],
   
    cellContextMenuConstructor: "Menu",
    cellContextClick : function (record, rowNum, colNum) {
        // create the cellContextMenu if necessary
        if (!this.cellContextMenu) {
            this.cellContextMenu = this.createAutoChild("cellContextMenu");
        }
        var menuItems = [
            { title : "Rename", rowNum: rowNum, click : "target.startEditing(item.rowNum)" },
            { isSeparator: true },
            { title : "Edit", click : "target.clearCurrentDashboard(); target.editDashboard()" },
            { title : "Clone", click : "target.clearCurrentDashboard(); target.cloneDashboard()" }
        ];
        this.cellContextMenu.setData(menuItems);
        this.cellContextMenu.showContextMenu(this);

        // return false to kill the standard context menu
        return false;
    },

    recordDoubleClick : function (viewer, record, recordNum, field, fieldNum, value, rawValue) {
        viewer.clearCurrentDashboard();
        viewer.viewDashboard();
    },

    clearCurrentDashboard : function () {
        editPane.destroyAll();
        editPane.hide();
        editToolbar.hide();
    },

    editDashboard : function () {
        var record = this.getSelectedRecord();
        if (record) {
            editPane.setPortal(record.layout);
            editPane.show();
            editToolbar.show();
            this.showPalette();
        }
        this._currentRecord = record;
    },

    viewDashboard : function () {
        var record = this.getSelectedRecord();
        if (record) {
            editPane.addPaletteNodesFromXML(record.layout);
            editPane.show();
            editToolbar.hide();
            this.hidePalette();
        }
        this._currentRecord = record;
    },

    newDashboard : function () {
        this.clearCurrentDashboard();
        this._currentRecord = null;

        // Add a PortalLayout to the editPane
        editPane.setInitialPortal(initialPortalPaletteNode);
        editPane.show();
        editToolbar.show();
        this.showPalette();

        this.saveDashboard();
    },

    cloneDashboard : function () {
        var record = this.getSelectedRecord();
        if (record) {
            this.cloneRecord(record);
        }
    },

    showPalette : function () {
        selector.enableTab(1);
        selector.selectTab(1);
    },
    
    hidePalette : function () {
        selector.disableTab(1);
        selector.selectTab(0);
    },
    
    refreshDashboard : function () {
        this.clearCurrentDashboard();
        this.editDashboard();
    },

    saveDashboard : function () {
        var editNodes = editPane.serializeAllEditNodes({ indent: false });

        if (this._currentRecord) {
            this._currentRecord.layout = editNodes;
            this.updateData(this._currentRecord);
        } else {
            var grid = this;
            this.addData({ description: "New dashboard", layout: editNodes }, function (response, data, request) {
                if (data && data.length > 0) {
                    grid.selectSingleRecord(data[0]);
                    grid._currentRecord = data[0];
                }
            });
        }
    },

    cloneRecord : function (record) {
        this.addData({ description: record.description, layout: record.layout});
    }
});

isc.IButton.create({
    ID: "viewButton",
    title: "View",
    autoFit: true,
    click : function () {
        dashboardList.clearCurrentDashboard();
        dashboardList.viewDashboard();
    }
});

isc.IButton.create({
    ID: "editButton",
    title: "Edit",
    autoFit: true,
    click : function () {
        dashboardList.clearCurrentDashboard();
        dashboardList.editDashboard();
    }
});

isc.IButton.create({
    ID: "newButton",
    title: "New",
    autoFit: true,
    click : function () {
        dashboardList.newDashboard();
    }
});

isc.IButton.create({
    ID: "cloneButton",
    title: "Clone",
    autoFit: true,
    click : function () {
        dashboardList.cloneDashboard();
    }
});

isc.HLayout.create({
    ID: "selectToolbar",
    height: 30,
    membersMargin: 10,
    defaultLayoutAlign: "center",

    members: [
        isc.LayoutSpacer.create(),
        viewButton,
        editButton,
        newButton,
        cloneButton
    ]
})

isc.VLayout.create({
    ID: "selectLayout",
    members: [
        dashboardList,
        selectToolbar
    ]
});


// The ListPalette contains components available
// for use, with default settings.
isc.ListPalette.create({
    ID: "listPalette",
    leaveScrollbarGap: false,
  
    // The regular ListGrid property
    fields: [
        {name: "title", title: "Component"}
    ],

    // We are supplying the component data inline for this example.
    // However, ListPalette is a subclass of ListGrid, so you could
    // also use a dataSource.
    data: [{
        title: "Animals", 
        type: "ListGrid", 
        defaults: {
            dataSource: "animals",
            autoFetchData: true,
            showFilterEditor: true
        }
    },{
        title: "Supply Categories", 
        type: "ListGrid", 
        defaults: {
            dataSource: "supplyCategory",
            autoFetchData: true,
            showFilterEditor: true
        }
    },{
        title: "Supply Items", 
        type: "ListGrid", 
        defaults: {
            dataSource: "supplyItem",
            autoFetchData: true,
            showFilterEditor: true
        }
    }]
});

isc.TabSet.create({
    ID: "selector",
    height: "100%",
    tabs: [
        {title: "Dashboards", pane: selectLayout },
        {title: "Palette", pane: listPalette, disabled: true }
    ]
});

isc.EditPane.create({
    ID: "editPane",
    visibility: "hidden",
    extraPalettes: isc.HiddenPalette.create({
        data: [
           { title: "ListGridField", type: "ListGridField" }
        ]
    }),
    setInitialPortal : function (paletteNode) {
        var editNode = this.addFromPaletteNode(paletteNode);
        this.getEditContext().defaultParent = editNode;
    },
    setPortal : function (xml) {
        var editContext = this.getEditContext(),
            editTree = editContext.getEditNodeTree(),
            rootNode = editContext.getRootEditNode()
        ;
        this.addPaletteNodesFromXML(xml, null, null, function (paletteNodes) {
            // PortalLayout is assumed to be the first node under root.
            var childNodes = editTree.getChildren(rootNode),
                editNode = (childNodes && childNodes.length > 0 ? childNodes[0] : null)
            ;
            editContext.defaultParent = editNode;
        });
    }
});

// Make the new editPane the default Edit Context for the palette,
// to support double-clicking on components in the palette to create them
listPalette.setDefaultEditContext(editPane);
editPane.setDefaultPalette(listPalette);

// Add a PortalLayout to the editPane
editPane.setInitialPortal(initialPortalPaletteNode);

isc.IButton.create({
    ID: "saveButton",
    title: "Save",
    autoFit: true,
    click : function () {
        dashboardList.saveDashboard();
    }
});

isc.IButton.create({
    ID: "discardButton",
    title: "Discard changes",
    autoFit: true,
    click : function () {
        dashboardList.refreshDashboard();
    }
});

isc.HLayout.create({
    ID: "editToolbar",
    height: 30,
    membersMargin: 10,
    defaultLayoutAlign: "center",
    visibility: "hidden",

    members: [
        isc.LayoutSpacer.create(),
        saveButton,
        discardButton
    ]
})

isc.VLayout.create({
    ID: "dashboardLayout",
    width: "100%",
    height: "100%",
    members: [
        editPane,
        editToolbar
    ]
});

isc.SplitPane.create({
    ID: "splitPane",
    width: "100%",
    height: "100%",
    showLeftButton:true,
    showRightButton:false,
    detailPane: dashboardLayout,
    navigationPane: selector,
    navigationTitle: "Selector"
});
