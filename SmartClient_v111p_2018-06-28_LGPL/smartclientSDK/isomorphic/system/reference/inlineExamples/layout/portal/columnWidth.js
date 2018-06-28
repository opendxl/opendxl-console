isc.PortalLayout.create({
    ID: "portalLayout",

    // This shows resize bars for the columns 
    canResizeColumns: true,
    portlets: [
        [ // First column is an array, since it has multiple rows
            // We don't need another array for the first row, since there is only one portlet
            isc.Portlet.create({
                title: "Portlet 1"
            }),
            [ // The second row needs an array, since there are two portlets in it
                isc.Portlet.create({
                    title: "Portlet 2"
                }),
                isc.Portlet.create({
                    title: "Portlet 3"
                })
            ]
        ],
        // The second column doesn't need an array, since it is just one portlet
        isc.Portlet.create({
            title: "Portlet 4"
        })
    ]
});

isc.DynamicForm.create({
    ID: "form",
    fields: [{
        title: "Prevent Underflow",
        type: "checkbox",
        defaultValue: true,
        changed : function (form, item, value) {
            portalLayout.setPreventUnderflow(value);
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
