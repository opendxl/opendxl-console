isc.defineClass("CustomCheckboxItem", "CheckboxItem").addProperties({
    textBoxStyle: "customCheckboxTitle",

    booleanBaseStyle: "customCheckbox",
    checkedImage: "blank",
    uncheckedImage: "blank",

    // Don't use spriting when printing because browsers typically default to not printing background
    // images.
    printBooleanBaseStyle: "printCustomCheckbox",
    printCheckedImage: "../inlineExamples/forms/details/checkboxImages/checked.png",
    printUncheckedImage: "../inlineExamples/forms/details/checkboxImages/unchecked.png",

    // The sprite tiles are 20px x 20px each.
    valueIconWidth: 20,
    valueIconHeight: 20,

    valueIconLeftPadding: 5,
    valueIconRightPadding: 5,

    // We don't have an "unset" appearance, but there are "Disabled", "Over", and "Down" tiles.
    showUnsetImage: false,
    showValueIconDisabled: true,
    showValueIconOver: true,
    showValueIconDown: true,
    showValueIconFocused: true
});

var form = isc.DynamicForm.create({
    autoDraw: false,
    width: 300,
    items: [{
        name: "shipmentVerified",
        editorType: "CustomCheckboxItem",
        title: "Was the shipment verified?",
        valueMap: {
            "verified": true,
            "unverified": false
        }
    }]
});

var button = isc.IButton.create({
    title: form.isDisabled() ? "Enable Form" : "Disable Form",
    click : function () {
        if (form.isDisabled()) {
            form.enable();
            this.setTitle("Disable Form");
        } else {
            form.disable();
            this.setTitle("Enable Form");
        }
    }
});

isc.HStack.create({
    width: "100%",
    members: [form, button],
    membersMargin: 20
});
