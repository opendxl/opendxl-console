
isc.ToolStrip.create({
    ID: "gridEditControls",
    width: "100%", height:24, 
    members: [
        isc.Label.create({
            padding:5,
            ID:"totalsLabel"
        }),
        isc.LayoutSpacer.create({ width:"*" }),
        isc.ToolStripButton.create({
            icon: "[SKIN]/actions/edit.png",
            prompt: "Edit selected record",
            click: function () {
                var record = countryList.getSelectedRecord();
                if (record == null) return;
                countryList.startEditing(countryList.data.indexOf(record));
            }
        }),
        isc.ToolStripButton.create({
            icon: "[SKIN]/actions/remove.png", 
            prompt: "Remove selected record",
            click: "countryList.removeSelectedData()"
        })
    ]
});

isc.ListGrid.create({
    ID: "countryList",
    width:500, height:425, alternateRecordStyles:true,
    dataSource: countryDS,
    fields:[
        {name:"countryCode", title:"Code", width:50},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    autoFetchData: true,
    showFilterEditor: true,
    canEdit:true,
    editEvent:"none",
    gridComponents:["header", "filterEditor", "body", gridEditControls],
    dataChanged : function () {
        this.Super("dataChanged", arguments);
        var totalRows = this.data.getLength();
        if (totalRows > 0 && this.data.lengthIsKnown()) {
            totalsLabel.setContents(totalRows + " Records");
        } else {
            totalsLabel.setContents("&nbsp;");
        }
    }
})

