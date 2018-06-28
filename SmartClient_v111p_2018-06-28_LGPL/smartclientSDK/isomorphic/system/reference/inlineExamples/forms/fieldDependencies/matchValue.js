isc.DynamicForm.create({
    width: 250,
    fields: [
        {name: "username",
         title: "Username",
         type: "text",
         required: true,
         defaultValue: "bob"
        },
        {name: "email",
         title: "Email",
         required: true,
         type: "text",
         defaultValue: "bob@isomorphic.com"
        },
        {name: "password",
         title: "Password",
         required: true,
         type: "password",
         validators: [{
            type: "matchesField",
            otherField: "password2",
            errorMessage: "Passwords do not match"
         }]
        },
        {name: "password2",
         required: true,
         wrapTitle: false,
         title: "Password again",
         type: "password"
        },
        {name: "createAccount",
         title: "Create Account",
         type: "button",
         click: "form.validate()"
        }
    ]
});
