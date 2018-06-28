isc.DynamicForm.create({
    ID: "exampleForm",
    width: 250,
    titleOrientation: "top",
    fields: [
        {name: "willAttend",
         type: "radioGroup",
         colSpan: "*",
         required: true,
         vertical: false,
         valueMap: ["Yes", "No"],
         redrawOnChange:true,
         title: "Will you be attending the meeting on April 4th? If no, please provide a reason"
        },
        {name: "reason",
         type: "text",
         title: "Reason",
         validators : [{
            type: "requiredIf",
            expression: "exampleForm.getValue('willAttend') == 'No'",
            errorMessage: "Please provide a reason"
         }]
        },
        {name: "validate",
         title: "Validate",
         type: "button",
         click: "form.validate()"
        }
    ]
});
