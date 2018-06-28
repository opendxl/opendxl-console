isc.DynamicForm.create({
    ID: "boundForm",
    dataSource: "complaint",
    wrapItemTitles: false,
    fields: [
        {type:"header", defaultValue:"Shipment Complaint Form"},
        {name: "trackingNumber", stopOnError: true},
        {name: "receiptDate", useTextField: true},
        {name: "comment", editorType: "TextAreaItem"},
	{name: "submitBtn", title: "Submit", type: "button", click: "form.validate()"}
    ]
});
