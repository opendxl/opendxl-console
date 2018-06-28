isc.VLayout.create({
    members: [
        isc.DynamicForm.create({
            ID: "boundForm",
            dataSource: "countries"
        }),
        isc.Button.create({
            title: "Save New",
            click: "boundForm.saveData()"
        })
    ]
});


isc.ListGrid.create({
    ID: "boundGrid",
    left: 300,
    width: 350,
    height: 200,
    dataSource: "countries"
});

boundGrid.filterData({gdp: 500});