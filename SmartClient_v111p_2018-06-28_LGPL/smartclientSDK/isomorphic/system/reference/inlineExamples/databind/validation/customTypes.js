// Define custom zip-code type - referred to in the customTypes dataSource.
isc.SimpleType.create({
    name:"zipCodeUS",
    inheritsFrom:"text",
    validators:[
        {type:"regexp", expression:"^\\d{5}(-\\d{4})?$", 
            errorMessage:"Zip Codes should be in the format ##### or #####-####."}
    ]
});

isc.DynamicForm.create({
    ID: "boundForm",
    width: 300,
    dataSource: "customTypes"
});

isc.Button.create({
    top: 60,
    title: "Validate",
    click: "boundForm.validate()"
});