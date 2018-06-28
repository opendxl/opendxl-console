isc.PortalLayout.create({
    width: "100%",
    height: "100%",
    // You can create the PortalLayout first and then use addPortlet to populate it.
    // Alternatively, you can initialize the PortalLayout with portlets as a multi-level
    // array, specifying columns, rows and portlets. You don't have to put single items
    // in an array (for instance, in the common case where there is a single Portlet
    // in a row).
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
