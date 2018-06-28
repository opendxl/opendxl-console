isc.DynamicForm.create({
    ID: "boundForm",
    dataSource: "builtins"
});

isc.Button.create({
    ID: "validateButton",
    height: 36, margin: 2,
    title: "Validate",
    click: "boundForm.validate()"
});

isc.HLayout.create({
    members:[boundForm, validateButton]
});