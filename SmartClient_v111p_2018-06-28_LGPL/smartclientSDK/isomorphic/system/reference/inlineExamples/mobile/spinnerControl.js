isc.DynamicForm.create({
    width: 400,
    fields: [
        {title: "Unstacked Spinner", editorType: "SpinnerItem", writeStackedIcons: false,
         defaultValue: 5, min: 0, max: 10, step: 0.5},
    ]
});