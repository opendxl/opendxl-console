isc.PortalLayout.create({
    ID: "portalLayout",
    width: "100%",
    height: 350,
    portlets: [
        [ // Array for left column
            isc.Portlet.create({
                title: "Large Portlet",
                height: 200
            }),
            isc.Portlet.create({
                title: "Large Portlet",
                height: 200
            }) 
        ],[ // Array for right column
            isc.Portlet.create({
                title: "Small Portlet",
                height: 100
            }),
            isc.Portlet.create({
                title: "Small Portlet",
                height: 100
            })
        ]
    ]
});

isc.DynamicForm.create({
    ID: "form",
    fields: [{
        title: "columnOverflow",
        type: "select",
        valueMap: ["auto", "visible", "hidden"],
        defaultValue: "auto",
        changed : function (form, item, value) {
            portalLayout.setColumnOverflow(value);
        }
    },{
        title: "overflow",
        type: "select",
        valueMap: ["auto", "visible", "hidden"],
        defaultValue: "auto",
        changed : function (form, item, value) {
            portalLayout.setOverflow(value);
        }
    }]
});

isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 10,
    members: [
        form,
        portalLayout
    ]
});
