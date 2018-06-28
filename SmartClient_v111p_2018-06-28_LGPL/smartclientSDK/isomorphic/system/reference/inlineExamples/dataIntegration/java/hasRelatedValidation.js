isc.DynamicForm.create({
    ID: "boundForm",
    dataSource: "complaint",
    wrapItemTitles: false,
    fields: [
        {type:"header", defaultValue:"Shipment Complaint Form"},
        {name: "trackingNumber", validateOnExit: true},
        {name: "receiptDate", useTextField: true, validateOnExit: true},
        {name: "comment", editorType: "TextAreaItem"},
        {name: "submitBtn", title: "Submit", type: "button", click: "form.validate()"}
    ]
});
