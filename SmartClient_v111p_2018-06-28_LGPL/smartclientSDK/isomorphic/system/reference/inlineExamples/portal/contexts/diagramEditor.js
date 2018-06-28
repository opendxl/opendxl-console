// The following gradients are shared by various DrawItem shapes and are 
// applied to the empty DrawPane as well as the palette tile DrawPanes
var commonGradients = [
    { id: "oval", direction: 90, startColor: "#ffffff", endColor: "#99ccff" },
    { id: "diamond", direction: 90, startColor: "#d3d3d3", endColor: "#666699" },
    { id: "rect", direction: 90, startColor: "#f5f5f5", endColor: "#a9b3b8" },
    { id: "triangle", direction: 90, startColor: "#f5f5f5", endColor: "#667766" }
];

// Empty DrawPane palette node use when clearing edit canvas
var emptyDrawPanePaletteNode = {
    type: "DrawPane",
    defaults: {
        // The DrawPane must be focusable in order for a keypress to trigger inline editing
        // of a selected draw item whose EditProxy is configured with inlineEditEvent:"dblOrKeypress".
        canFocus: true,
        width: "100%",
        height: "100%",
        gradients: commonGradients
    }
};

var editContext = isc.EditContext.create({
    defaultPalette: tilePalette,
    enableInlineEdit: true,
    canSelectEditNodes: true,

    rootComponent: {
        type: "Canvas",
        liveObject: editCanvas
    },

    init : function () {
        this.Super("init", arguments);
        
        var requestParams = {
            useSimpleHttp:true,
            actionURL:isc.Page.getURL("[ISOMORPHIC]/system/reference/inlineExamples/portal/contexts/sampleDrawingData.xml")
        }
        var _this = this;
        isc.RPCManager.send(null, function (dsRequest, data) {
               _this.setSampleDrawing(data);
            }, requestParams);
    },

    selectedEditNodesUpdated : function (editNode) {
        if (editNode == null || isc.isA.DrawItem(editNode.liveObject)) {
            drawItemProperties.selectedEditNodesUpdated();
        }
    },
    setSampleDrawing : function (componentXml) {
        this.sampleDrawing = componentXml;
        this.showSampleDrawing();
    },
    showSampleDrawing : function () {
        this.destroyAll();
        this.defaultParent = null;

        var _this = this;
        this.addPaletteNodesFromXML(this.sampleDrawing, null, null, function () {
            _this.configureDrawPane();
        });
    },
    
    configureDrawPane : function () {
        // Node drops should be assigned to DrawPane
        var drawPaneEditNode = this.getDrawPaneEditNode();
        this.defaultParent = drawPaneEditNode;
    },

    getDrawPaneEditNode : function () {
        // DrawPane is assumed to be the first node under root.
        var editTree = this.getEditNodeTree(),
            rootNode = this.getRootEditNode(),
            childNodes = editTree.getChildren(rootNode),
            editNode = (childNodes && childNodes.length > 0 ? childNodes[0] : null)
        ;
        return editNode;
    }
});

// Set the defaultEditContext on palette which is used when double-clicking on components.
tilePalette.setDefaultEditContext(editContext);

// Place editCanvas into editMode to allow paletteNode drops
var editCanvasEditNode = editContext.getRootEditNode();
editCanvas.setEditMode(true, editContext, editCanvasEditNode);

// The above use of an edit canvas and edit context can be replaced by
// an EditPane which combines these separate parts into a single component.

drawItemProperties.editContext = editContext;


// Start with an empty drawing until the sample is loaded
editContext.addFromPaletteNode(emptyDrawPanePaletteNode);
editContext.configureDrawPane();

isc.DynamicForm.create({
    autoDraw: false,
    ID: "exportForm",
    width: "100%",
    numCols: 2,
    wrapItemTitles: false,
    items: [{
        name: "format",
        type: "select",
        title: "Export format",
        valueMap: {
            "png": "PNG",
            "pdf": "PDF"
        },
        defaultValue: "png"
    }, {
        title: "Export",
        type: "button",
        startRow: false, endRow: false,

        click : function (form) {
            var drawPaneNode = editContext.getDrawPaneEditNode(),
                drawPane = drawPaneNode.liveObject,
                format = form.getValue("format"),
                requestProperties = {
                    exportDisplay: "download",
                    exportFilename: "Diagram"
                }
            ;
            if (format == "png") isc.RPCManager.exportImage(drawPane.getSvgString(), requestProperties);
            else isc.RPCManager.exportContent(drawPane, requestProperties);
        }
    }]
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
                width: Math.round(vlayout.width / 2),
                defaultHeight: Math.round(vlayout.height * 2/3),
                title: "Component XML",
                autoCenter: true,
                showMinimizeButton: false,
                canDragResize: true,
                isModal: true,
                keepInParentRect: true,
                items: [
                    isc.HTMLFlow.create({
                        canFocus: true,
                        contents: formattedText,
                        canSelectText: true,
                        selectContentOnSelectAll: true
                    })
                ]
            })
        ;

        window.show();
    }
});

isc.IButton.create({
    ID: "reloadSampleButton",
    title: "Reload Sample Drawing",
    autoFit: true,

    click : function () {
        // Recreate sample drawing
        editContext.showSampleDrawing();
    }
});

isc.IButton.create({
    ID: "clearButton",
    title: "Clear Drawing",
    autoFit: true,

    click : function () {
        // Destroy all the nodes
        editContext.destroyAll();

        // Create default DrawPane
        editContext.addFromPaletteNode(emptyDrawPanePaletteNode);
        editContext.configureDrawPane();
    }
});


// This button will destroy the EditDrawPane and then recreate it from saved state.
isc.IButton.create({
    ID: "destroyAndRecreateButton",
    title: "Destroy and Recreate",
    autoFit: true,

    click : function () {
        // We save the editPane node data in a variable
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
                isc.VLayout.create({
                    membersMargin: 5,
                    members: [
                        tilePalette,
                        exportForm
                    ]
                }),
                isc.VLayout.create({
                    width: "100%",
                    membersMargin: 5,
                    members: [
                        editCanvas,
                        drawItemProperties
                    ]
                })
            ]
        })
    ]
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

// This inserts the action buttons into the overall layout for the example.
vlayout.addMember(actionBar, 0);
