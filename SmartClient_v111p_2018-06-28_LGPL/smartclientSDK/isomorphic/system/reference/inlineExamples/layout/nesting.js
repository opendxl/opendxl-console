isc.HLayout.create({
    width: "100%",
    height: "100%",
    members: [
        isc.Label.create({
            contents: "Navigation",
            align: "center",
            overflow: "hidden",
            width: "30%",
            showResizeBar: true,
            border: "1px solid blue"
        }),
        isc.VLayout.create({
            width: "70%",
            members: [
                isc.Label.create({
                    contents: "Listing",
                    align: "center",
                    overflow: "hidden",
                    height: "30%",
                    showResizeBar: true,
                    border: "1px solid blue"
                }),
                isc.Label.create({
                    contents: "Details",
                    align: "center",
                    overflow: "hidden",
                    height: "70%",
                    border: "1px solid blue"
                })
            ]
        })
    ]
});
