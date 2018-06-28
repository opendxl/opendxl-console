// A serialized sample mockup to show initially 
var sampleMockup = "<VLayout ID=\"VLayout0\" width=\"88\" height=\"65\" left=\"5\" top=\"5\" autoDraw=\"false\"></VLayout><VLayout ID=\"VLayout1\" width=\"88\" height=\"100\" left=\"5\" top=\"5\" autoDraw=\"false\"></VLayout><TabSet ID=\"TabSet0\" width=\"440\" height=\"180\" left=\"20\" top=\"20\" autoDraw=\"false\"><tabs><Tab title=\"View\"><pane ref=\"VLayout0\"/><ID>Tab0</ID></Tab><Tab title=\"Edit\"><pane ref=\"VLayout1\"/><ID>Tab1</ID></Tab></tabs></TabSet><IButton ID=\"IButton0\" width=\"100\" height=\"22\" left=\"360\" top=\"220\" autoDraw=\"false\"><title>Save</title></IButton>";

isc.MockDataSource.create({
    ID: "gridMockDS",
    mockData: "Country,Continent,Area,Population,G8?\n" +
        "United States,North America,9\\,631\\,420,298\\,444\\,215,[x]\n" +
        "China,Asia,9\\,596\\,960,1\\,313\\,973\\,713,[]\n" +
        "Japan,Asia,377\\,835,127\\,463\\,611,[x]\n" +
        "Brazil,South America,8\\,511\\,965,188\\,078\\,227,[]\n" +
        "[50L,50L,30R,0R,0C]"
});

isc.MockDataSource.create({
    ID: "treeMockDS",
    mockData: "F Charles Madigen\n" +
        " _ Rogine Leger\n" +
        " F Gene Porter\n" +
        "  _ Olivier Doucet\n" +
        "  _ Cheryl Pearson\n" +
        "f George Sampson",
    mockDataType: "tree"
});

var chartFacets = [
    { inlinedValues: true, values: [
        { id: "West" },
        { id: "North" },
        { id: "East" },
        { id: "South" }
    ]},
    { id: "series" },
];
var chartData = [
    { series: "Cars", West: 37, North: 29, East: 80, South: 87 },
    { series: "Trucks", West: 23, North: 45, East: 32, South: 67 },
    { series: "Motorcycles", West: 12, North: 4, East: 23, South: 45 }
];

// Palette client-only dataSource
isc.DataSource.create({
    ID:"paletteDS",
    clientOnly:true,
    fields:[
        {name:"id", primaryKey: true},
        {name:"title", title:"Component", type:"text"},
        {name:"isFolder", type:"boolean"}
    ],
    testData:[{
        id: 100,                    title: "Grids",                                                         isFolder: true, canDrag: false
    },{
        id: 101,    parentId: 100,  title: "Grid",          icon: "ListGrid.png",   type: "ListGrid",
        defaults: {
            width: 350,
            height: 115,
            dataSource: "gridMockDS",
            autoFetchData: true,
            headerHeight: 25,
            autoFitFieldWidths: true,
            autoFitWidthApproach: "title",
            leaveScrollbarGap: false
        }
    },{
        id: 102,    parentId: 100,  title: "Tree",          icon: "TreeGrid.png",   type: "TreeGrid",
        defaults: {
            height: 160,
            dataSource: "treeMockDS",
            autoFetchData: true,
            dataProperties: {openProperty: "isOpen"}
        }
    },{
        id: 103,    parentId: 100,  title: "Detail Viewer", icon: "DetailViewer.png",   type: "DetailViewer"
    },{
        id: 150,                    title: "Button",        icon: "button.gif",     type: "IButton",
        defaults: {
            title: "Button"
        }
    },{
        id: 151,                    title: "Label",         icon: "ui-label.png",  type: "Label",
        defaults: {
            contents: "Some text",
            height: 1
        }
    },{
        id: 152,                    title: "Menu",          icon: "text_padding_top.png", type: "MenuButton",
        defaults: {
            title: "File Menu",
            data: [
                {title: "Open", keyTitle: "Ctrl+O", icon: "icons/16/folder_out.png"},
                {title: "Open Recent", icon: "icons/16/folder_document.png", submenu: [
                    {title: "data.xml", checked: true},
                    {title: "Component Guide.doc"},
                    {title: "SmartClient.doc", checked: true},
                    {title: "AJAX.doc"}
                ]},
                {isSeparator: true},
                {title: "Option 1", checked: true},
                {title: "Option 2"},
                {isSeparator: true},
                {title: "Toggle Item", checked: true},
                {title: "Disabled Item", enabled: false},
                {isSeparator: true},
                {title: "Exit", enabled: false, keyTitle: "Ctrl+Q"}
            ]
        }
    },{
        id: 153,                    title: "Menubar",       icon: "shape_align_top.png", type: "MenuBar",
        defaults: {
            width: 200,
            menus: [{
                title: "File",
                data: [
                    {title: "Open", keyTitle: "Ctrl+O", icon: "icons/16/folder_out.png"},
                    {title: "Open Recent", icon: "icons/16/folder_document.png", submenu: [
                        {title: "data.xml", checked: true},
                        {title: "Component Guide.doc"},
                        {title: "SmartClient.doc", checked: true},
                        {title: "AJAX.doc"}
                    ]},
                    {isSeparator: true},
                    {title: "Option 1", checked: true},
                    {title: "Option 2"},
                    {isSeparator: true},
                    {title: "Toggle Item", checked: true},
                    {title: "Disabled Item", enabled: false},
                    {isSeparator: true},
                    {title: "Exit", enabled: false, keyTitle: "Ctrl+Q"}
                ]
            }, {
                title: "Edit"
            }, {
                title: "View"
            }, {
                title: "Help"
            }]      
        }
    },{
        id: 154,                    title: "Progress bar",       icon: "ui-progress-bar.png", type: "Progressbar",
        defaults: {
            percentDone: 70
        }
    },{
        id: 200,                    title: "Containers",                                                    isFolder: true, canDrag: false
    },{
        id: 201,    parentId: 200,  title: "Tabs",          icon: "TabSet.png",     type: "TabSet",
        defaults: {
            width: 200
        }
    },{
        id: 202,    parentId: 200,  title: "Box",           icon: "shape_handles.png", type: "Canvas",
        defaults: {
            border: isc.EditPane.getInstanceProperty("border"),
        },
        editProxyProperties: {
            // Disable inline editing
            supportsInlineEdit: false
        }
    },{
        id: 203,    parentId: 200,  title: "Group",         icon: "ui-group-box.png", type: "Canvas",
        defaults: {
            isGroup: true,
            groupTitle: "Group"
        }
    },{
        id: 204,    parentId: 200,  title: "Window",        icon: "Window.png",     type: "Window",
        defaults: {
            title: "Window"
        }
    },{
        id: 205,    parentId: 200,  title: "H. Resizer",    icon: "ui-splitter-horizontal.png", type: "Snapbar",
        defaults: {
            height: 5,
            vertical: false,
            title: "&nbsp;"
        },
        editProxyProperties: { supportsInlineEdit: false }
    },{
        id: 206,    parentId: 200,  title: "V. Resizer",    icon: "ui-splitter.png", type: "Snapbar",
        defaults: {
            width: 5,
            title: "&nbsp;"
        },
        editProxyProperties: { supportsInlineEdit: false }
    },{
        id: 300,                    title: "Inputs",                                                        isFolder: true, canDrag: false
    },{
        id: 301,    parentId: 300,  title: "Text Box",      icon: "text.gif",       type: "TextItem",
        defaults: { showTitle: false, width: "*" }
    },{
        id: 302,    parentId: 300,  title: "Text Area",     icon: "textArea.gif",   type: "TextAreaItem",
        defaults: { showTitle: false, width: "*" }
    },{
        id: 303,    parentId: 300,  title: "Combo Box",     icon: "comboBox.gif",   type: "ComboBoxItem",
        defaults: {
            showTitle: false, width: "*",
            valueMap: [ "Selected Option", "Option 1", "Option 2" ],
            value: "Selected Option"
        }
    },{
        id: 304,    parentId: 300,  title: "Select List",   icon: "select.gif",     type: "SelectItem",
        defaults: {
            showTitle: false, width: "*",
            valueMap: [ "Selected Option", "Option 1", "Option 2" ],
            value: "Selected Option"
        }
    },{
        id: 305,    parentId: 300,  title: "Check Box",     icon: "checkbox.gif",   type: "CheckboxItem",
        defaults: { width: "*", value: true, title: "Checkbox" }
    },{
        id: 306,    parentId: 300,  title: "Date Input",    icon: "date.gif",       type: "DateItem",
        defaults: { showTitle: false, width: "*"  }
    },{
        id: 307,    parentId: 300,  title: "Spinner",       icon: "textfield_rename.png", type: "SpinnerItem",
        defaults: { showTitle: false, width: "*"  }
    },{
        id: 308,    parentId: 300,  title: "Password",      icon: "password.gif",   type: "PasswordItem",
        defaults: { showTitle: false, width: "*" , value: "password" },
        editProxyProperties: { supportsInlineEdit: false }
    },{
        id: 309,    parentId: 300,  title: "Color",         icon: "color_swatch.png", type: "ColorItem",
        defaults: { showTitle: false, width: "*" , value: "navy" },
        editProxyProperties: { supportsInlineEdit: false }
    },{
        id: 310,    parentId: 300,  title: "Upload Item",   icon: "upload.gif",     type: "UploadItem",
        defaults: { showTitle: false, width: "*" },
        editProxyProperties: { supportsInlineEdit: false }
    },{
        id: 400,                    title: "Charts",                                                        isFolder: true, canDrag: false
    },{
        id: 401,    parentId: 400,  title: "Column Chart",  icon: "shape_align_bottom.png",  type: "FacetChart",
        defaults: {
            backgroundColor: "white",
            facets: chartFacets,
            data: chartData,
            chartType: "Column",
            title: "Sales by Product and Region"
        }
    },{
        id: 402,    parentId: 400,  title: "Bar Chart",     icon: "shape_align_left.png",  type: "FacetChart",
        defaults: {
            backgroundColor: "white",
            facets: chartFacets,
            data: chartData,
            chartType: "Bar",
            title: "Sales by Product and Region"
        }
    },{
        id: 403,    parentId: 400,  title: "Line Chart",    icon: "chart_line.png", type: "FacetChart",
        defaults: {
            backgroundColor: "white",
            facets: chartFacets,
            data: chartData,
            chartType: "Line",
            title: "Sales by Product and Region"
        }
    },{
        id: 404,    parentId: 400,  title: "Pie Chart",     icon: "chart_pie.png",  type: "FacetChart",
        defaults: {
            backgroundColor: "white",
            facets: chartFacets,
            data: chartData,
            chartType: "Pie",
            title: "Sales by Product and Region"
        }
    }]
});


// The TreePalette contains components available
// for use, with default settings.
isc.TreePalette.create({
    ID: "treePalette",
    height: "100%",
    leaveScrollbarGap: false,

    // The regular ListGrid property
    fields: [
        {name: "title"}
    ],

    dataSource: "paletteDS",
    autoFetchData: true,
    loadDataOnDemand: false,
    
    getIcon : function (record) {
        if (record.icon) return "formItemIcons/" + record.icon;
        else if (!record.isFolder) return "blank.gif";

        return this.Super("getIcon", arguments);
    },
    
    dataArrived: function () {
        this.data.openAll();
    }
});

//Create button bar
isc.HLayout.create({
    ID: "actionBar",
    membersMargin: 10,
    width: "100%",
    height: 30,

    duplicateButtonDefaults: {
        _constructor: "IButton",
        title: "Duplicate", autoFit: true,
        click : function () {
            var selection = this.creator.getSelectedNodes();
            editPane.copyEditNodes(selection);
            editPane.pasteEditNodes();
        }
    },
    removeButtonDefaults: {
        _constructor: "IButton",
        title: "Remove", autoFit: true,
        click : function () {
            var selection = this.creator.getSelectedNodes();
            for (var i = 0; i < selection.length; i++) {
                editPane.removeNode(selection[i]);
            }
        }
    },
    sendToBackButtonDefaults: {
        _constructor: "IButton",
        title: "Send to back", autoFit: true,
        click : function () {
            var selection = this.creator.getSelectedNodes();
            for (var i = 0; i < selection.length; i++) {
                selection[i].liveObject.sendToBack();
            }
        }
    },
    bringToFrontButtonDefaults: {
        _constructor: "IButton",
        title: "Bring to front", autoFit: true,
        click : function () {
            var selection = this.creator.getSelectedNodes();
            for (var i = 0; i < selection.length; i++) {
                selection[i].liveObject.bringToFront();
            }
        }
    },

    init : function () {
        this.Super("init", arguments);
        this.addAutoChild("duplicateButton");
        this.addAutoChild("removeButton");
        this.addAutoChild("sendToBackButton");
        this.addAutoChild("bringToFrontButton");

        // Set initial state 
        this.selectedEditNodesUpdated();
    },

    getSelectedNodes : function () {
        return (this.editContext ? this.editContext.getSelectedEditNodes() : []);
    },

    selectedEditNodesUpdated : function () {
        var selection = this.getSelectedNodes();
        if (selection.length == 0) {
            // No selection
            this.duplicateButton.disable();
            this.removeButton.disable();
            this.sendToBackButton.disable();
            this.bringToFrontButton.disable();
            this.enableKeyHandler(false);
        } else {
            this.duplicateButton.enable();
            this.removeButton.enable();
            this.sendToBackButton.enable();
            this.bringToFrontButton.enable();
            this.enableKeyHandler(true);
        }
    },

    enableKeyHandler : function (enable) {
        if (enable) {
            if (!this._keyPressEventID) {
                this._keyPressEventID = isc.Page.setEvent("keyPress", this);
            }
        } else {
            if (this._keyPressEventID) {
                isc.Page.clearEvent("keyPress", this._keyPressEventID);
                delete this._keyPressEventID;
            }
        }
    },
    
    pageKeyPress : function (target, eventInfo) {
        var key = isc.EH.getKeyEventCharacter(),
            selection = this.getSelectedNodes()
        ;
        if (selection.length == 0) return;

        // If editPane (or child) does not have focus, ignore keyPress 
        if (!editPane.containsFocus()) return;

        var key = isc.EH.getKey();
        if (key == "Delete" || key == "Backspace") {
            for (var i = 0; i < selection.length; i++) {
                editPane.removeNode(selection[i]);
            }
            return false;
        }
    }
});

// The editPane is the root component in which the items can be placed.
isc.EditPane.create({
    ID:"editPane",
    canFocus: true,

    defaultPalette: treePalette,

    // We want all selections/drops to be into the EditPane
    allowNestedDrops: false,

    // Enable display of a selectionOutline for the currently
    // selected item
    selectedAppearance: "outlineMask",

    // Don't show the label for current selection
    showSelectedLabel: false,

    // Turn on component inline editing
    editContextProperties: {
        enableInlineEdit: true,
        selectedEditNodesUpdated : function () {
            if (actionBar) actionBar.selectedEditNodesUpdated();
        }
    },

    editProxyProperties: {
        autoMaskChildren: true,
        // Enable snapToGrid for all children.
        // In EditMode this also triggers display of the visual grid when
        // dragging and resizing.
        childrenSnapToGrid: true
    },
    
    extraPalettes: isc.HiddenPalette.create({
        data: [
           { title: "Tab", type: "Tab" }
        ]
    })
});

treePalette.setDefaultEditContext(editPane.getEditContext());
actionBar.editContext = editPane.getEditContext();

// Place sample mockup into editContext
editPane.addPaletteNodesFromXML(sampleMockup);

isc.DynamicForm.create({
    ID: "quickAddForm",
    numCols: 1,
    cellPadding: 0,
    fields: [
        { name: "quickAdd", showTitle: false, width: "*",
            type: "comboBox",
            optionDataSource: "paletteDS", valueField: "id", displayField: "title",
            optionCriteria: {
                _constructor: "AdvancedCriteria", operator: "and",
                criteria: [
                    { fieldName: "isFolder", operator: "notEqual", value: true }
                ]
            },
            completeOnTab: true,
            hint: "Quick Add..", showHintInField: true,

            changed: function (form, item, value) {
                var node = item.getSelectedRecord();
                if (node) {
                    var editNode = editPane.addFromPaletteNode(node);
                    editNode.liveObject.moveTo(20, 20);
                    item.clearValue();
                }
            }
        }
    ]
});

isc.VLayout.create({
    ID: "leftPane",
    width: 200,
    membersMargin: 3,
    members: [
        quickAddForm,
        treePalette
    ]
});

isc.VLayout.create({
    ID: "rightPane",
    width: "100%",
    membersMargin: 10,
    members: [
        editPane,
        actionBar
    ]
});

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
                leftPane,
                rightPane
            ]
        })
    ]
});

