isc.DynamicForm.create({
    ID: "boundForm",
    dataSource: "regularExpression"
});

isc.Button.create({
    top: 60,
    title: "Validate",
    click: "boundForm.validate()"
});