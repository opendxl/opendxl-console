isc.DynamicForm.create({
    ID: "boundForm",
    colWidths: [100, 200],
    dataSource: "users",
    useAllDataSourceFields: true,
    fields: [
        {type:"header", defaultValue:"Registration Form"},
        {name: "password"},
        {name: "password2", title: "Password Again", type: "password", required: true, 
         wrapTitle: false, length: 20, validators: [{
             type: "matchesField",
             otherField: "password",
             errorMessage: "Passwords do not match"
         }]
        },
        {name: "acceptTerms", title: "I accept the terms of use.", type: "checkbox", width:150,
         defaultValue:false,
         validators:[{
            type:"custom",
            condition:"return value == true",
            errorMessage:"You must accept the terms of use to continue"
         }]
        },
        {name: "validateBtn", title: "Validate", type: "button", click: "form.validate()"}
    ],
    values : {
        firstName: "Bob",
        email: "bob@.com",
        password: "sekrit",
        password2: "fatfinger"
    }
});
