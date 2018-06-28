isc.HLayout.create({
    membersMargin:20,
    members: [
        isc.IButton.create({
            ID: "findButton",
            width: 120,
            title: "Find Related",
            icon: "icons/16/find.png"
        }),
        isc.Button.create({
            ID: "saveButton",
            title: "Save",
            icon: "icons/16/icon_add_files.png",
            iconOrientation: "right",
            showDownIcon: true
        })
    ]
});

isc.Button.create({
    title: "Disable Save",
    width: 120,
    left: 60,
    top: 45,
    click : function () {
        if (saveButton.isDisabled()) {
            saveButton.enable();
            this.setTitle("Disable Save");
        } else {
            saveButton.disable();
            this.setTitle("Enable Save");
        }
    }
});
    
