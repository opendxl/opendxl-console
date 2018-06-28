isc.PortalLayout.create({
    ID: "portalLayout",
    
    portlets: [
        [ // Array for left column
            isc.Portlet.create({
                title: "height: 100",
                height: 100
            }),
            isc.Portlet.create({
                title: "height: 100",
                height: 100,
                bodyProperties: {
                    padding: 10
                },
                items: "Notice how the PortalLayout will stretch the last Portlet to fill the vertical space, if <code>preventColumnUnderflow</code> is set."
            }) 
        ],[ // Array for right column
            isc.Portlet.create({
                title: 'height: "30%"',
                height: "30%"
            }),
            isc.Portlet.create({
                title: 'height: "70%"',
                height: "70%"
            })
        ]
    ]
});

isc.DynamicForm.create({
    ID: "form",
    fields: [{
        title: "Prevent Column Underflow",
        type: "checkbox",
        defaultValue: true,
        changed : function (form, item, value) {
            portalLayout.setPreventColumnUnderflow(value);
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
