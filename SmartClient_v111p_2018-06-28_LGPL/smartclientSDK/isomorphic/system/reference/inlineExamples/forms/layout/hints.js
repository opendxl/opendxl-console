isc.DynamicForm.create({
    fields: [
        {name: "fromDate",
         title: "From",
         type: "text",
         hint: "MM/YYYY",
         width: 100
        },
        {name: "toDate",
         title: "To",
         type: "text",
         hint: "MM/YYYY",
         showHintInField: true,
         width: 100
        }
    ]
});
