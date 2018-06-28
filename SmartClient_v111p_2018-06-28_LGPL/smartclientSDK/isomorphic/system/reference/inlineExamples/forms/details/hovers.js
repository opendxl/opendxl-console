isc.DynamicForm.create({
    ID: "severityForm",
    width: 200,
    itemHoverWidth: 200,
    fields: [
        {name: "severityLevel",
         title: "Severity Level",
         type: "select",wrapTitle:false,
         valueMap: ["Severity 1", "Severity 2", "Severity 3"],
         defaultValue: "Severity 2",
         itemHoverHTML : function () {
             // help text is keyed by the value of the select
             if (this.isDisabled()) {
                 return "The severity level cannot be changed when the field is disabled.";
             }
             return this.hoverText[this.getValue()];
         },
         hoverText: {
             "Severity 1": "<b>Severity 1</b><p>Critical problem.  System is unavailable in production or "
                          +"is corrupting data, and the error severely impacts the user's operations.",
             "Severity 2": "<b>Severity 2</b><p> Major problem.  An important function of the system "
                          +"is not available in production, and the user's operations are restricted.",
             "Severity 3": "<b>Severity 3</b><p> Minor problem.  Inability to use a function of the "
                          +"system occurs, but it does not seriously affect the user's operations."
         }
        }
    ]
});

isc.Button.create({
    top: 40,
    width: 150,
    title: "Enable/disable field",
    click: function () {
        var item = severityForm.getItem("severityLevel");
        item.setDisabled(!item.isDisabled());
    }
});
