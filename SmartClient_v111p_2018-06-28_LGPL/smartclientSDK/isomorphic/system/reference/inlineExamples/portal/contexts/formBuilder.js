// Empty DynamicForm palette node use when clearing edit canvas
var emptyDynamicFormPaletteNode = {
    type: "DynamicForm",
    defaults: {
        width: "100%",
        height: "100%"
    },
    editProxyProperties: {
        // By default a FormItem is selectable only by clicking the item
        // itself. This setting allows selection by clicking the title as well.
        selectItemsMode: "itemOrTitle",
        // Don't allow the Form to be selected
        canSelect: false
    }
};

// The ListPalette contains components available
// for use, with default settings.
var listPalette = isc.ListPalette.create({
    autoDraw: false,
    ID: "listPalette",
    width: 125,
    height: 100,    // Minimum height
    autoFitData: "vertical",
    leaveScrollbarGap: false,

    // The regular ListGrid property
    fields: [
        {name: "title", title: "Form Component"}
    ],

    // We are supplying the component data inline for this example.
    // However, ListPalette is a subclass of ListGrid, so you could
    // also use a dataSource.
    data: [{
        // Title as you want it to appear in the list
        title: "Text",
        icon: "text.gif",
        // type indicates the class of object to create for
        // this component
        type: "TextItem",
        // defaults specifies the properties to use when
        // creating the component
        defaults: {
        }
    },{
        title: "Static Text", 
        icon: "staticText.gif",
        type: "StaticTextItem", 
        defaults: {
        }
    },{
        title: "Blurb",
        icon: "blurb.gif",
        type: "BlurbItem", 
        defaults: {
            defaultValue: "This is a blurb"
        }
    },{
        title: "Checkbox", 
        icon: "checkbox.gif",
        type: "CheckboxItem", 
        defaults: {
        }
    },{
        title: "Select", 
        icon: "select.gif",
        type: "SelectItem", 
        defaults: {
        }
    },{
        title: "ComboBox", 
        icon: "comboBox.gif",
        type: "ComboBoxItem", 
        defaults: {
        }
    },{
        title: "Radio", 
        icon: "radioGroup.gif",
        type: "RadioGroupItem", 
        defaults: {
            valueMap: ["Yes", "No"]
        }
    },{
        title: "Date", 
        icon: "date.gif",
        type: "DateItem", 
        defaults: {
            useTextField: true
        }
    },{
        title: "Time", 
        icon: "time.gif",
        type: "TimeItem", 
        defaults: {
        }
    }],
    
    getValueIcon : function (field, value, record) {
        return (record.icon ? "formItemIcons/" + record.icon : null);
    }
});


// The editCanvas is the root component in which the items can be placed.
var editCanvas = isc.Canvas.create({
    autoDraw: false,
    ID: "editCanvas",
    width: "100%",
    height: "100%",
    border: isc.EditPane.getInstanceProperty("border"),
    editProxyProperties: {
        allowNestedDrops: false
    }
});

var editContext = isc.EditContext.create({
    defaultPalette: listPalette,

    // Enable display of a selectionOutline for the currently
    // selected item
    selectedAppearance: "outlineEdges",

    enableInlineEdit: true,
    
    // Customize the outline and the associated label
    selectedBorder: "1px dashed teal",
    selectedLabelBackgroundColor: "yellow",

    rootComponent: {
        type: "Canvas",
        liveObject: editCanvas
    },

    // When an item is selection a label is shown above it.
    // By default that label comes from the item's toString() method.
    // As a simplification we show just the FormItem name value.
    getSelectedLabelText : function (component) {
        if (isc.isA.BlurbItem(component)) {
            return "Blurb"; // Blurb has no title
        } else if (isc.isA.FormItem(component)) {
            return component.title;
        }
        return null;
    },

    configureForm : function () {
        var formEditNode = this.getFormEditNode();
        if (formEditNode) {
            // Node drops should be assigned to Form
            this.defaultParent = formEditNode;
        }
    },

    getFormEditNode : function () {
        // Form is assumed to be the first node under root.
        var editTree = this.getEditNodeTree(),
            rootNode = this.getRootEditNode(),
            childNodes = editTree.getChildren(rootNode),
            editNode = (childNodes && childNodes.length > 0 ? childNodes[0] : null)
        ;
        return editNode;
    }
});

// Set the defaultEditContext on palette which is used when double-clicking on components.
listPalette.setDefaultEditContext(editContext);

// Place editCanvas into editMode to allow paletteNode drops
var editCanvasEditNode = editContext.getRootEditNode();
editCanvas.setEditMode(true, editContext, editCanvasEditNode);


//The above use of an edit canvas and edit context can be replaced by
//an EditPane which combines these separate parts into a single component.


// Place base component (DynamicForm) into editContext. All paletteNodes are
// FormItems that will be added to this form
editContext.addFromPaletteNode(emptyDynamicFormPaletteNode);
editContext.configureForm();


var showComponentXMLButton = isc.IButton.create({
    autoDraw: false,
    ID: "showComponentXMLButton",
    title: "Show Component XML",
    autoFit: true,

    click : function () {
        var paletteNodes = editContext.serializeAllEditNodes();

        var syntaxHiliter = isc.XMLSyntaxHiliter.create(),
            formattedText = syntaxHiliter.hilite(paletteNodes),
            window = isc.Window.create({
                width: Math.round(vLayout.width / 2),
                defaultHeight: Math.round(vLayout.height * 2/3),
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

var clearButton = isc.IButton.create({
    autoDraw: false,
    ID: "clearButton",
    title: "Clear Form",
    autoFit: true,

    click : function () {
        // Destroy all the nodes
        editContext.destroyAll();

        // Create default DynamicForm
        editContext.addFromPaletteNode(emptyDynamicFormPaletteNode);
        editContext.configureForm();
    }
});


// This button will destroy the Edit Portal and then recreate it from saved state.
var destroyAndRecreateButton = isc.IButton.create({
    autoDraw: false,
    ID: "destroyAndRecreateButton",
    title: "Destroy and Recreate",
    autoFit: true,

    destroyAndRecreateEditPane : function () {
        // We save the editPane node data in a variable
        var paletteNodes = editContext.serializeAllEditNodes();

        // Animate the disappearance of the editCanvas, since otherwise
        // everything happens at once.
        editCanvas.animateFade(0, function () {
            // Once the animation is finished, destroy all the nodes
            editContext.destroyAll();

            // Then add them back from the serialized form
            editContext.addPaletteNodesFromXML(paletteNodes, null, null, function () {
                editContext.configureForm();
            });

            // And make us visible again
            editCanvas.setOpacity(100);
        }, 2000, "smoothEnd");
    },

    click : function () {
        this.destroyAndRecreateEditPane();
    }
});

// Create button bar
var actionBar = isc.HLayout.create({
    autoDraw: false,
    ID: "actionBar",
    membersMargin: 10,
    width: "100%",
    height: 30,
    members: [
        isc.LayoutSpacer.create({ width: "*" }),
        showComponentXMLButton,
        isc.LayoutSpacer.create({ width: 20 }),
        clearButton,
        isc.LayoutSpacer.create({ width: 20 }),
        destroyAndRecreateButton
    ]
});


var vLayout = isc.VLayout.create({
    ID: "vLayout",
    width: "100%",
    height: "100%",
    membersMargin: 10,
    members: [
        actionBar,
        isc.HLayout.create({
            ID: "hLayout",
            membersMargin: 20,
            width: "100%",
            height: "100%",
            members: [
                listPalette,
                editCanvas
            ]
        })
    ]
});
