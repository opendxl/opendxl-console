isc.ListGrid.create({
    ID: "countryList",
    width: 600,
    height: 224,
    dataSource: ormDataSource_country,
    canEdit: true,
    canRemoveRecords: true,
    dataFetchMode: "local",
    autoFetchData: true,
    useAllDataSourceFields: true
});

isc.IButton.create({
    ID: "addButton",
    width: 110, top: 240,
    title: "Create Country",
    click: "countryList.startEditingNew();"
});
