// ---------------------------------------------------------------------------------------
// Local Data Example

isc.DynamicForm.create({
    top: 25,
    width: 500,
    numCols: 4,
    autoDraw: true,
    fields: [
        {name: "division",
         title: "Division",
         type: "select",
         valueMap: ["Marketing", "Sales", "Manufacturing", "Services"],
         changed: "form.getField('department').setValueMap(item.departments[value])",
         departments: {
            Marketing: ["Advertising", "Community Relations"],
            Sales: ["Channel Sales", "Direct Sales"],
            Manufacturing: ["Design", "Development", "QA"],
            Services: ["Support", "Consulting"]
         }
        },
        {name: "department",
         title: "Department",
         type: "select",
         addUnknownValues:false
        }
    ]
});
