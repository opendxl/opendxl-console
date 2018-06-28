isc.DynamicForm.create({
    width: 300,
    fields: [
        {name: "fullName",
         type: "text",
         title: "Full Name",
         defaultValue: "Billy Bob"
        },
        {name: "licenseAccept",
         type: "checkbox",
         title: "I accept the agreement",
         change: "form.getField('proceed').setDisabled(!value)"
        },
        {name: "proceed",
         type: "button",
         title: "Proceed",
		 width:100,
         click: "isc.say('OK')",
         disabled: true
        }
    ]
});
