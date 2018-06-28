isc.PortalLayout.create({
    ID: "portalLayout",
    
    portlets: [ // Top-level array
        [       // Array for first column
            [   // Array for first row
                isc.Portlet.create({
                    title: "width: 150",
                    width: 150
                }),
                isc.Portlet.create({
                    title: "width: 200",
                    width: 200,
                    bodyProperties: {
                        padding: 10
                    },
                    items: "Notice how the PortalLayout will stretch the last Portlet to fill the available space, if <code>preventRowUnderflow</code> is set."
                })
            ],[  // Array for second row
                isc.Portlet.create({
                    title: 'width: "30%"',
                    width: "30%"
                }),
                isc.Portlet.create({
                    title: 'width: "70%"',
                    width: "70%"
                })
            ]
        ]
    ]
});

isc.DynamicForm.create({
    ID: "form",
    fields: [{
        title: "Prevent Row Underflow",
        type: "checkbox",
        defaultValue: true,
        changed : function (form, item, value) {
            portalLayout.setPreventRowUnderflow(value);
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
