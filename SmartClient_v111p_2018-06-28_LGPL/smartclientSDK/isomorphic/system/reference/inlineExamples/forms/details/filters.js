isc.DynamicForm.create({
    width: 500,
    fields: [
        {name: "name",
         title: "Name",
         type: "text",
         hint: "Mapped to uppercase",
         width: 200,
         characterCasing: "upper"
        },
        {name: "commission",
         title: "Commission",
         type: "text",
         hint: "Numeric only [0-9.]",
         width: 100,
         keyPressFilter: "[0-9.]"
        }
    ]
});
