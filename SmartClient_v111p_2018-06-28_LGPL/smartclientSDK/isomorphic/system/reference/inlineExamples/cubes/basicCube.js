isc.VStack.create({
    width: "100%",
    membersMargin: 10,
    members: [
        isc.CubeGrid.create({
            ID: "basicCubeGrid",
            data: productData,
            width: "100%",
            hideEmptyFacetValues: true,

            valueFormat: "\u00A4,0.00",

            columnFacets: ["quarter", "month", "metric"],
            rowFacets: ["region", "product"],

            // configure export colors
            exportFacetTextColor: "blue",
            exportFacetBGColor: "yellow",

            exportColumnFacetTextColor: "red",
            exportColumnFacetBGColor: "#44FF44",

            exportDefaultBGColor: "#FFDDAA",
        }),
        isc.Button.create({
            title: "Export",
            click: function (){
                basicCubeGrid.exportClientData({exportAs: "xls"});
            }
        })
    ]
});