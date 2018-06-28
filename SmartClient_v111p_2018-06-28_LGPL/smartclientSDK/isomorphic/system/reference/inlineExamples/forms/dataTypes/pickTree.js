var departmentTree = isc.Tree.create({
    modelType: "children",
    root: { name:"root", children: [
        { name: "Marketing", children: [
            { name: "Advertising"},
            { name: "Community Relations"}
        ]},
        { name: "Sales", children: [
            { name: "Channel Sales"},
            { name: "Direct Sales"}
        ]},
        { name: "Manufacturing", children: [
            { name: "Design"},
            { name: "Development"},
            { name: "QA"}
        ]},
        { name: "Services", children: [
            { name: "Support"},
            { name: "Consulting"}
        ]}
    ]}
});

var form = isc.DynamicForm.create({
    autoDraw: false,
    fields: [
        { name:"department", title:"Department", type:"pickTree",
          valueField:"name", valueTree: departmentTree
        },
        { name:"category", title:"Category", type:"pickTree",
          dataSource:"supplyCategory", emptyMenuMessage:"No Sub Categories",
          canSelectParentItems:true
        }
    ]
});

isc.HStack.create({
    width: "100%",
    members: [form]
});
