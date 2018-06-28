isc.TreeGrid.create({
    dataSource: "hugeTree",
    dataFetchMode: "paged",
    autoFetchData: true,
    showFilterEditor: true,

    // customize appearance
    fields: [{ name: "name", canFilter: true }],
    width: 500,
    height: 400,
    showOpenIcons: false,
    showDropIcons: false,
    nodeIcon: "pieces/16/cube_blue.png",
    folderIcon: "pieces/16/cubes_blue.png",
    closedIconSuffix: "",
    showConnectors: true
});
