// this is needed for users subscribe on unique message channels
var startParameter = isc.timestamp();

isc.ListGrid.create({
 ID:"stockQuotesGrid",
 dataSource:stockQuotes,
 autoFetchData: true,
 height:300,
 // Cell animation - go bright green or red on a change, then fade
 getCellCSSText : function (record, rowNum, colNum) {
     // changeValue column
     if (this.getField(colNum).name == "lastValue" && record.lastUpdated != null) {
         var delta = new Date().getTime() - record.lastUpdated.getTime();
         var blinkPeriod = 2000;
         if (delta < blinkPeriod) {
            // refresh 10x / second
            var grid = this;
            isc.Timer.setTimeout(function () {
               grid.refreshCell(rowNum, colNum);
            }, 100);

            var changeValue = record.changeValue;
            var ratio = (blinkPeriod-delta)/blinkPeriod;
            var color = 255 - Math.round(200*ratio);

            if (changeValue > 0) {
                return "background-color:#"+color.toString(16)+"FF"+color.toString(16);
            } else if(changeValue<0){
            	return "background-color:#FF"+color.toString(16)+color.toString(16);
            }
         }
     }
     // no style override
     return null;
 }
});

isc.Button.create({
    ID:"generateUpdatesButton",
    title: "Generate more updates",
    width: 200,
    click : function () {
		// disable button for 90 seconds - time while server will update stock data
        this.disable();
    	isc.RPCManager.sendRequest({ actionURL: isc.Page.getIsomorphicDir() +
                                     "../examples/StockQuotes/generate?sp="+startParameter});
    	// null check is present in case user has navigated away from this page.
    	isc.Timer.setTimeout("if (window.generateUpdatesButton != null) generateUpdatesButton.enable()", 90000 );
    }
}).click();

isc.Label.create({
    ID: "connectionIndicator",
    height: 20,
    contents: "Connection DOWN",
    initWidget : function () {
        var _this = this;
	    isc.Messaging.addClassMethods({
	        connectionUp: function () {
	            _this.setContents("Connection: UP");
		        _this.setBackgroundColor("lightgreen");
	        },
	        connectionDown: function () {
	            _this.setContents("Connection: DOWN");
		        _this.setBackgroundColor("red");
	        }
	    });
    },
    destroy : function () {
	this.Super("destroy");
        isc.Messaging.addClassMethods({
            connectionUp: function () {},
            connectionDown: function () {}
        })
    }
});

// UI with grid and generate button under the grid
isc.VLayout.create({
    autoDraw:true,
    overflow:"auto",
    width:700,
    height:"100%",
    membersMargin:10,
    members:[
	stockQuotesGrid, 
	isc.HLayout.create({
	    members: [
		generateUpdatesButton,
		isc.LayoutSpacer.create({width: "*"}),
		connectionIndicator
	    ]
	})
    ]
});

// We get id and changeValue only from server - combine it with the record in the grid to get
// the rest of the fields
function updateStockQuotes(data) {

    // If we've navigated away from this example, nothing to do. Unsubscribe from the channel
    // startParameter available via closure
    if (window.stockQuotesGrid == null) {
        isc.Messaging.unsubscribe("stockQuotes"+startParameter);
        return;
    }

	var newStockData = [];
	for (i = 0; i < data.size(); i++) {
		if (data[i][1] != 0) {
			// data[x][0] is id
			var record = stockQuotesGrid.data.find({id:data[i][0]});
			// data[i][1] is changeValue in percent - it can be positive or negative 
			record.changeValue = Math.round(data[i][1]*record.lastValue)/100;
			// we need two digits after dot
			record.lastValue = Math.round((record.changeValue+record.lastValue)*100)/100;
			record.dayHighValue = Math.max(record.dayHighValue, record.lastValue);
			record.dayLowValue = Math.min(record.dayLowValue, record.lastValue);
			record.lastUpdated = new Date();
			newStockData.add(record);
		}
	}
	var dsResponse = {
        data : newStockData,
        startRow : 0,
        endRow : newStockData.size(),
        totalRows : newStockData.size(),
        status : 0
    };
	var dsRequest = {
		operationType:"update"
	};
    // broadcast the change - the grid will notice this automatically (and so would other
    // components showing the same record)
	stockQuotes.updateCaches(dsResponse, dsRequest);
}

// receive messages from the stockQuotes channel and update data grid
isc.Messaging.subscribe("stockQuotes"+startParameter, updateStockQuotes);
