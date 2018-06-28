isc.ListGrid.create({
    ID: "listGrid",
    autoDraw: false,
    dataSource: supplyItem,
    autoFitDateFields: "both",
    width: "80%",
    useAllDataSourceFields: true,
    autoFetchData: true
});

isc.TabSet.create({
    ID: "tabSet",
    autoDraw: false,
    tabs: [
        {title: "View"},
        {title: "Edit"}
    ]
});

isc.TreeGrid.create({
    ID: "treeGrid",
    width: "20%",
    showConnectors: true,
    showResizeBar: true,
    data: isc.Tree.create({
        modelType: "children",
        root: {name: "root", children: [
            {name: "File"},
            {name: "Edit"},
            {name: "Search"},
            {name: "Project"},
            {name: "Tools"},
            {name: "Window"},
            {name: "Favorites"}
        ]}
    }),
    fields: [
        {name: "Navigation", formatCellValue: "record.name"}
    ]    
});

isc.HLayout.create({
    ID: "navLayout",
    members: [
        treeGrid, listGrid
    ]
});

isc.SectionStack.create({
    height: 400, width: 850,
    visibilityMode: "multiple",
    border:"1px solid blue",
    animateSections: true,
    overflow: "hidden",
    sections: [
        {title: "Summary", expanded: true, items: [navLayout]},
        {title: "Details", expanded: true, items: [tabSet]}
    ]
});
