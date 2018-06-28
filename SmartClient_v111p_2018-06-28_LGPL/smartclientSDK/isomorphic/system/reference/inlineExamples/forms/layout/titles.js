isc.DynamicForm.create({
    ID: "exampleForm",
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
         type: "password"
        },
        {name: "password2",
         required: true,
         title: "Password again",
         type: "password",
         wrapTitle: false
        }
    ]
});

isc.Button.create({
    ID: "swapButton",
    height: 36, margin: 2,
    title: "Swap titles",
    click: function () {
        exampleForm.setTitleOrientation(exampleForm.titleOrientation == "top" ? "left" : "top");
    }
});

isc.HLayout.create({
    members:[exampleForm, swapButton]
});