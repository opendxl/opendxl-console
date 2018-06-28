
isc.Label.create({
    ID: "countryListLabel",
    contents: "Country list",
    width: "90%",
    height: 25,
    autoDraw: true,
    baseStyle: "exampleSeparator"
});

isc.ListGrid.create({
    ID:"countryList",
    dataSource:countryOneToManyHB,
    top: 40,
    width:700,
    height:150,
    alternateRecordStyles:true,
    autoFetchData:true,
    dataPageSize: 50,
    canRemoveRecords:true,
    selectionChanged: function(record, state) {
        if (state) {
            countryEditLayout.setDisabled(false);
            countryForm.editRecord(record);
            cityList.setData(record.cities);
        } else {
            countryEditLayout.setDisabled(true);
        }
    }
});

isc.Button.create({
    ID: "newCountryButton",
    top: 200,
    autoFit: true,
    title: "Add New Country",
    click: "countryEditLayout.setDisabled(false);cityList.setData([]);countryForm.editNewRecord();"
});

isc.Label.create({
    ID: "countryLabel",
    contents: "Country edit",
    top: 230,
    width: "90%",
    height: 25,
    autoDraw: true,
    baseStyle: "exampleSeparator"
});

isc.DynamicForm.create({
    ID: "countryForm",
    dataSource: "countryOneToManyHB",
    autoDraw: false
});

isc.ListGrid.create({
    ID:"cityList",
    dataSource:cityOneToManyHB,
    autoDraw: false,
    width:700,
    height:150,
    alternateRecordStyles:true,
    saveLocally: true,
    saveByCell: true,
    canEdit:true,
    editEvent:"click",
    canRemoveRecords:true
});

isc.Button.create({
    ID: "newCityButton",
    autoDraw: false,
    title: "Add New City",
    state: "Disabled",
    click: "cityList.startEditingNew();"
});

isc.VLayout.create({
    ID: "countryEditLayout",
    top: 270,
    width: 500,
    autoDraw: true,
    membersMargin: 5,
    members: [ 
        countryForm, 
        cityList,
        newCityButton,
        isc.IButton.create({
            title: "Save",
            click: function() {
                cityList.saveAllEdits();
                countryForm.setValue("cities", cityList.data);
                countryForm.saveData();
            }
        })
    ]
});

countryEditLayout.setDisabled(true);

