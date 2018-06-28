isc.Label.create({
    ID: "pickerLabel",
    border: "1px grey solid",
    width: 300, height: 30
});

isc.IButton.create({
    ID: "pickerButton",
    title: "Pick a Color",
    click : function () {
        isc.ColorPicker.getSharedColorPicker({
            colorSelected:"pickerLabel.setBackgroundColor(color);pickerLabel.setOpacity(opacity);"
        }).show();
    }
});

isc.DynamicForm.create({
    ID: "pickerForm",
    values: {startMode: "simple", position: "auto"},
    numCols: 2,
    titleOrientation: "top",
    width: 400,
    fields: [{
        name: "startMode",
        title: "Initially show ColorPicker as",
        width: 200,
        type: "radioGroup",
        valueMap: {
            "simple": "Simple",
            "complex": "Complex"
        },
        changed : function (form, item, value) {
            isc.ColorPicker.getSharedColorPicker({
                defaultPickMode: value
            }).setCurrentPickMode(value);
        }
    }, {
        name: "position", title: "Position ColorPicker", type: "radioGroup",
        width: 200, valueMap: {"auto": "Near mouse", "center": "Centered"},
        changed: function () {
            isc.ColorPicker.getSharedColorPicker().setProperties({ 
                autoPosition: this.getValue() == "auto" ? true : false,
                autoCenterOnShow: this.getValue() == "auto" ? false : true
            });
        }
    }]
});

isc.VLayout.create({
    width: 400,
    membersMargin: 10,
    members: [
        isc.Label.create({contents: "Selected color:", height: 20}),
        pickerLabel,
        pickerForm,
        pickerButton
    ]
});
