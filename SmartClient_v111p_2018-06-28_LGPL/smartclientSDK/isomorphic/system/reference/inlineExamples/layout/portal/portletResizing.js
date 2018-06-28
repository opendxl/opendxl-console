isc.PortalLayout.create({
    width: "100%",
    height: "100%",
    canResizePortlets: true,
    portlets: [
        [ // Array for left column
            isc.Portlet.create({
                title: "Portlet 1"
            }),
            [ // Array for a row
                isc.Portlet.create({
                    title: "Portlet 2"
                }),
                isc.Portlet.create({
                    title: "Portlet 3"
                })
            ]
        ],[ // Array for right column
            [
                isc.Portlet.create({
                    title: 'Portlet 4'
                }),
                isc.Portlet.create({
                    title: 'Portlet 5'
                })
            ],
            isc.Portlet.create({
                title: 'Portlet 6'
            })
        ]
    ]
});
