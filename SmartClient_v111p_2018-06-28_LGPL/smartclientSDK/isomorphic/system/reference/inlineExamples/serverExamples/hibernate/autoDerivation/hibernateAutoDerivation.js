var grid = isc.ListGrid.create({
    ID: "supplyItemList",
    width:1000,
    height:224,
    alternateRecordStyles:true,
    dataSource: supplyItemHBAutoDerive,
    autoFetchData: true,
    showFilterEditor: true,
    canEdit: true,
    editEvent: "click",
    canRemoveRecords: true,
    rowEditorExit : function (event, record, newValues, rowNum) {
        return this.validateRow(rowNum);
    }
});

var button = isc.Button.create({
    ID: "newButton",
    top: 230,
    title: "Add New",
    click: "supplyItemList.startEditingNew();"
});

