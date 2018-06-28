isc.Tree.create({
    ID: "menuTree",
    root: {name: "root", children: [
        {name: "Marketing", children: [
            {name: "Advertising"},
            {name: "Community Relations"}
        ]},
        {name: "Sales", children: [
            {name: "Channel Sales"},
            {name: "Direct Sales"}
        ]},
        {name: "Manufacturing", children: [
            {name: "Design"},
            {name: "Development"},
            {name: "QA"}
        ]},
        {name: "Services", children: [
            {name: "Support"},
            {name: "Consulting"}
        ]}
    ]}
});

var departmentButton = isc.MenuButton.create({
    autoDraw: false,
    title: "Go to department",
    width: 160,
    menu: isc.Menu.create({
        data: menuTree,
        canSelectParentItems: true,
        itemClick: function (item) {
            isc.say("You picked the \""+item.name+"\" department.");
        }
    })
});

var categoryButton = isc.MenuButton.create({
    autoDraw: false,
    title: "Go to category",
    width: 160,
    menu: isc.Menu.create({
        dataSource: "supplyCategory",
        canSelectParentItems: true,
        itemClick: function (item) { 
            isc.say("You picked the \""+item.categoryName+"\" category.");
        }
    })
});

isc.HStack.create({
    width: "100%",
    members: [
        isc.VStack.create({
            autoDraw: false,
            membersMargin: 10,
            members: [departmentButton, categoryButton]
        })
    ]
});
