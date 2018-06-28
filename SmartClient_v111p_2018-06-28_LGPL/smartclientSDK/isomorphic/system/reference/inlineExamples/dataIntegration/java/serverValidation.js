isc.DynamicForm.create({ 
    ID: "dynamicForm",
    dataSource: "supplyItem",
    // pre-fill some values
    values: {
        unitCost: -1.234,
        SKU: "my SKU"
    }
});

isc.IButton.create({
    ID: "saveButton",
    title: "Save",
    click: "dynamicForm.saveData()"
});


isc.IButton.create({
    ID: "clearErrorsButton",
    title: "Clear Errors",
    click: "dynamicForm.clearErrors(true)"
});

isc.IButton.create({
    ID: "disableValidationButton",
    autoFit: true,
    title: "Disable Validation",
    click: function () {
        dynamicForm.disableValidation = !dynamicForm.disableValidation;
        this.setTitle((dynamicForm.disableValidation ? "Enable" : "Disable")+" Validation");
    }
});

isc.HStack.create({
    ID: "buttons",
    height: 24,
    membersMargin: 10,
    members: [saveButton, clearErrorsButton, disableValidationButton]    
});

isc.VLayout.create({
    membersMargin: 10,
    members: [dynamicForm, buttons]
});