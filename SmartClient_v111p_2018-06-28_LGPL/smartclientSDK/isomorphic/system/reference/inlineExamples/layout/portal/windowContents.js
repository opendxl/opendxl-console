isc.DataSource.create({
    ID: "newsFeed",
    dataURL: "http://rss.slashdot.org/Slashdot/slashdot",
    recordXPath: "//item | //default:item",
    fields: [
        { name: "title" },
        { name: "link", type: "link" }
    ]
});

isc.PortalLayout.create({
    width: "100%",
    height: "100%",
    portlets: [
        [ // Array for left column
            isc.Portlet.create({
                title: "src: 'http://www.wikipedia.com'",
                src: "http://en.wikipedia.org/wiki/Ajax_(mythology)"
            }),
            isc.Portlet.create({
                title: "src: 'http://www.smartclient.com'",
                src: "http://www.smartclient.com/"
            })
        ],
        [ // Array for right column
            isc.Portlet.create({
                title: "items",
                items: [
                    isc.ListGrid.create({
                        ID: "newsViewer",
                        dataSource: "newsFeed",
                        autoFetchData: "true"
                    })
                ]
            })
        ]
    ]
});
