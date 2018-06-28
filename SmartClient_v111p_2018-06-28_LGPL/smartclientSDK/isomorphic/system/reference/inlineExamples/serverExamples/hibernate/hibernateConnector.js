
isc.ListGrid.create({
    ID: "worldList",
    width:1000,
    height:224,
    alternateRecordStyles:true, 
    dataSource: worldHB,
    autoFetchData: true,
    showFilterEditor: true,
    canEdit: true,
    editEvent: "click",
    canRemoveRecords: true,
    rowEditorExit : function (event, record, newValues, rowNum) {
        return this.validateRow(rowNum);
    }
});

isc.Button.create({
    ID: "newButton",
    top: 230,
    title: "Add New",
    click: "worldList.startEditingNew();"
});
