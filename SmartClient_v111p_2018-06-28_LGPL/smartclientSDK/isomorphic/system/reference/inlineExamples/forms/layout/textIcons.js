var form = isc.DynamicForm.create({
    autoDraw: false,
    items: [{
        name: "havePhoneNumber",
        title: "Have Phone Number?",
        wrapTitle: false,
        editorType: "RadioGroupItem",
        vertical: false,
        valueMap: {
            "true": "Yes",
            "false": "No"
        },
        defaultValue: true,
        changed : function (form, item, value) {
            var phoneNumberItem = form.getItem("phoneNumber");
            var enabled = value == true || value == "true";
            phoneNumberItem.setDisabled(!enabled);
            if (enabled) {
                phoneNumberItem.setValue(this.previousPhoneNumber);
            } else {
                // Save the current phone number, to be restored if the user selects "Yes" again.
                this.previousPhoneNumber = phoneNumberItem.getValue();
                phoneNumberItem.clearValue();
            }
        }
    }, {
        name: "phoneNumber",
        title: "Phone Number",
        wrapTitle: false,
        width: 200,
        icons: [{
            name: "tel",
            src: "blank", // if inline icons are not supported by the browser, revert to a blank icon
            inline: true,
            text: "&#x2706;",
            baseStyle: "telIcon"
        }],
        iconWidth: 16,
        iconHeight: 16,
        keyPressFilter: "[-+(),./#0-9 Xx]"
    }]
});

isc.VStack.create({
    width: "100%",
    members: [form]
});
