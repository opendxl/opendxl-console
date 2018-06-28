isc.DynamicForm.create({
    ID: "boundForm",
    dataSource: "valueTransform"
});

isc.Button.create({
    top: 60,
    title: "Validate",
    click: "boundForm.validate()"
});