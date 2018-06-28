isc.DynamicForm.create({
    ID: "boundForm",
    dataSource: "type"
});

isc.Button.create({
    top: 60,
    title: "Validate",
    click: "boundForm.validate()"
});