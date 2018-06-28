isc.ListGrid.create({
    ID: "countryList",
    width: 530,
    height: 224,
    dataSource: countryTransactions,
    autoFetchData: true,
    canEdit: true,
    autoSaveEdits: false,
    fields: [
        {name:"countryName"},
        {name:"capital"}, 
        {name:"continent"},
        {name:"gdp"}
    ],
    editComplete: function () {
        lastUpdated.fetchData({}, function (resp, data) {
            lastUpdatedLabel.setContents(data[0].lastUpdatedTime);
        });
    },
    editFailed: function () {
        this.editComplete();
    }
});

lastUpdatedLabel = isc.Label.create({
    backgroundColor: "#aabbff",
    left: 600, top: 102,
    height: 20, width: 300
});

lastUpdated.fetchData({}, function (resp, data) {
    lastUpdatedLabel.setContents(data[0].lastUpdatedTime);
});

isc.IButton.create({
    ID: "countrySave",
    top: 240, width: 80,
    title: "Good Save",
    click: function () {
        isc.RPCManager.startQueue();
        countryList.saveAllEdits();
        lastUpdated.updateData({pk: 1}, null, {operationId: "goodJDBCUpdate"});
        isc.RPCManager.sendQueue();
    }
});

isc.IButton.create({
    ID: "countryBadSave",
    top: 240, left: 90, width: 80,
    title: "Bad Save",
    click: function () {
        isc.RPCManager.startQueue();
        countryList.saveAllEdits();
        lastUpdated.updateData({pk: 1}, null, {operationId: "badJDBCUpdate"});
        isc.RPCManager.sendQueue();
    }
});