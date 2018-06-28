isc.ListGrid.create({
    ID: "supplyList",
    width:500, height:300, alternateRecordStyles:true,
    dataSource: supplyItem,
    fields:[
        {name:"SKU"},
        {name:"itemName"},
        {name:"description"},
        {name:"category"}
    ],
    autoFetchData: true,
    showFilterEditor: true,
    filterOnKeypress: true,
    fetchDelay: 500
});

// ---------------------------------------------------------------------------------------
// The code that follows is just to illustrate when SmartClient has needed to contact the
// server. It is not part of the example.
var origBGColor,
    restoreBGColorTimerID;
supplyItem.addProperties({

    transformResponse: function (dsResponse) {
        if (this.dataFormat == "iscServer") this.updateRowCountLabel(dsResponse);
    },
    // This approach logs simulated server trips for SmartClient LGPL, where all DataSources
    // in the Feature Explorer are converted to clientOnly:true so that no server is required.
    getClientOnlyResponse : function (dsRequest) {
        var dsResponse = this.Super("getClientOnlyResponse", arguments);
        this.updateRowCountLabel(dsResponse);
        return dsResponse;
    },
    updateRowCountLabel : function (dsResponse) {
        serverCount.incrementAndUpdate(dsResponse.totalRows, 
                                       dsResponse.startRow, 
                                       dsResponse.endRow);
        // Flash the label
        if (restoreBGColorTimerID == null) origBGColor = serverCount.backgroundColor;
        else isc.Timer.clear(restoreBGColorTimerID);
        serverCount.setBackgroundColor("#ffff77");
        restoreBGColorTimerID = isc.Timer.setTimeout(function () {
            restoreBGColorTimerID = null;
            serverCount.setBackgroundColor(origBGColor);
        }, 500);
    }
})
var serverCount = isc.Label.create({
    top: 320, padding: 10,
    width: 500, height: 40,
    border: "1px solid grey",
    contents: "<b>Number of server trips: 0</b>",
    count: 0,
    incrementAndUpdate: function (totalRows, startRow, endRow) {
        this.count++;
        this.setContents("<b>Number of server trips: " + this.count + 
                         "<br/>Total rows in this filter set: " + totalRows +
                         "<br/>Last range of records returned: " + 
                         startRow + " to " + endRow + "</b>");
    }
});
