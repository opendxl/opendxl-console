isc.PortalLayout.create({
    width: "100%",
    height: "100%",
    portlets: [
        [ // Array for left column
            isc.Portlet.create({
                title: "Portlet 1"
            }),
            isc.Portlet.create({
                title: "Portlet 2"
            }) 
        ],[ // Array for right column
            isc.Portlet.create({
                title: "Portlet 3"
            }),
            isc.Portlet.create({
                title: "Portlet 4"
            })
        ]
    ]
});
