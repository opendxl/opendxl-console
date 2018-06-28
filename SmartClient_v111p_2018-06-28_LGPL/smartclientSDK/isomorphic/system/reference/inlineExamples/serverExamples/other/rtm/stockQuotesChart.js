// this is needed for users subscribe on unique message channels
var startParameter = isc.timestamp();

// get chart component that draws our data
function getChart(data, initialData) {
	return isc.FacetChart.create({
	    ID: "stockQuotesChart",
	    facets: [{
	        id: "time",
	        title: "Time"
	    }, {
	        id: "name",
	        title: "Name"
	    }],
	    data:data,
	    initialData:initialData,
	    valueProperty: "lastValue",
	    chartType: "Area",
	    title: "Portfolio Value"
	});
}

// we get id and changeValue only from server - so we take all rest data from the grid and compute new values for rest fields.
function updateStockQuotes(data) {

    // If we've navigated away from this example, nothing to do. Unsubscribe from the channel
    // startParameter available via closure
    if (window.stockQuotesChart == null) {
        isc.Messaging.unsubscribe("stockQuotes" + startParameter);
        return;
    }
	var newData = stockQuotesChart.data.duplicate();
	var initialData = stockQuotesChart.initialData;
	var d = new Date();
	var t = isc.Time.toShortTime(d, "toShort24HourTime")+":"+d.getSeconds()+"."+d.getMilliseconds();
	for (var i = 0; i < initialData.size(); i++) {
		var record = {id:initialData[i].id, name: initialData[i].name, time: t, lastValue: initialData[i].lastValue};
		for (j = 0; j < data.size(); j++){
			if (data[j][0] == initialData[i].id) {
				if (data[j][1] != 0) {
					// data[j][1] contains change in percents
					record.lastValue += (data[j][1]*record.lastValue)/100 * 20;
				}				
				break;
			}
		}
		newData.add(record);
	}
	if (newData.size()>20*initialData.size()) {
		for (var i = 0; i < initialData.size(); i++) {
			newData.removeAt(0);	
		}
	}
	stockQuotesChart.setData(newData);
}

isc.Button.create({
    ID:'generateUpdatesButton',
    title: "Generate more updates",
    width: 200,
    click : function () {
		// disable button for 90 seconds - time while server will update stock data
        this.disable();
    	isc.RPCManager.sendRequest({ actionURL: isc.Page.getIsomorphicDir() +
                                     "../examples/StockQuotes/generate?sp="+startParameter});
    	// null check is present in case user has navigated away from this page.
    	isc.Timer.setTimeout(
    	    "if (window.generateUpdatesButton != null) generateUpdatesButton.enable()",
    	    90000 
    	);
    }
}).click();

// Overall layout
isc.VLayout.create({
	ID: "container",
    width: "100%",
    height: "100%",
    members: [generateUpdatesButton, getChart([],[])]
});

// receive messages from the stockQuotes channel and update data grid
isc.Messaging.subscribe("stockQuotes"+startParameter, updateStockQuotes);

isc.DataSource.get("stockQuotes").fetchData(null, 
	function (dsResponse, data) {
		var stockData = [];
		var d = new Date();
		var t = isc.Time.toShortTime(d, "toShort24HourTime")+":"+d.getSeconds()+"."+d.getMilliseconds();
		for (var i = 0; i < data.size(); i++) {
			stockData.add({id:data[i].id, name: data[i].name, time: t, lastValue: data[i].lastValue});
		}
		stockQuotesChart.initialData = stockData;
		stockQuotesChart.setData(stockData.duplicate());
	}
);
