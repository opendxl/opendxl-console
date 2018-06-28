isc.ListGrid.create({
    ID: "countryList",
    width: 530,
    height: 224,
    dataSource: rbCountryTransactions,
    autoFetchData: true,
    canEdit: true,
    autoSaveEdits: false,
    fields: [
        {name:"countryName"},
        {name:"capital"}, 
        {name:"continent"},
        {name:"gdp"}
    ]
});

isc.IButton.create({
    ID: "countrySave",
    top: 240, width: 80,
    title: "Save",
    click: "countryList.saveAllEdits();"
});
