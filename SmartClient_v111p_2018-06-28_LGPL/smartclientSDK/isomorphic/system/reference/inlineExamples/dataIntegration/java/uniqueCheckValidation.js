isc.DynamicForm.create({
    ID: "boundForm",
    dataSource: "queuing_userHB",
    wrapItemTitles: false,
    fields: [
        {type:"header", defaultValue:"Registration Form"},
        {name: "email", required: true, validateOnExit: true},
        {name: "firstName", title: "First name"},
        {name: "surname", title: "Last name"},
        {name: "department", title: "Department"},
        {name: "validateBtn", title: "Validate", type: "button", click: "form.validate()"}
    ]
});
