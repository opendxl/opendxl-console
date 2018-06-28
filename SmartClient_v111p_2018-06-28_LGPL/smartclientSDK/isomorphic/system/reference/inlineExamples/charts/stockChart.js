USE_YAHOO_FINANCE = false;

var stockChart = isc.FacetChart.create({
    ID: "stockChart",
    autoDraw: false,
    showTitle: false,
    showDataAxisLabel: false,
    canZoom: true,

    chartType: "Area",
    facets: [{ id: "date", title: "Day" }],
    valueProperty: "close",
    labelCollapseMode: "time",
    minLabelGap: 4,
    rotateLabels: "never",
    allowedChartTypes: ["Area", "Line"],
    
    _loadingMessage: "Loading data ...",

    _errorMessage:
        (USE_YAHOO_FINANCE
         ? "This test uses sample data provided by Yahoo&trade; Finance, " +
           "but Yahoo data is not currently available.  Refresh the sample to " +
           "try again.  You may need to wait a while for the Yahoo service to " +
           "become available again."
         : "Data is not currently available.  Please make sure that you are connected " +
           "to the Internet and then refresh the sample to try again."),

    _showMessage : function (message, alignCenter) {
        var label = this._label;
        if (label == null) {
            label = this._label = isc.Label.create({
                autoDraw: false,
                contents: "",
                valign: "center",
                wrap: true,
                showEdges: false
            });
            stockChart.addChild(label);
        }

        label.setContents(message);

        var alignment = (alignCenter ? "center" : "left");
        label.setAlign(alignment);

        var widthRatio = 0.6, heightRatio = 0.6;
        var width = this.getWidth(), height = this.getHeight();
        label.setTop(Math.round((1 - heightRatio) / 2 * height));
        label.setLeft(Math.round((1 - widthRatio) / 2 * width));
        label.setHeight(Math.round(heightRatio * height));
        label.setWidth(Math.round(widthRatio * width));
        label.show();
    },

    _hideMessage : function () {
        if (this._label != null) {
            this._label.hide();
        }
    },

    _updateData : function (symbol, name) {
        // Clear the chart and display a loading message.
        this.destroyItems();
        this._showMessage(this._loadingMessage, true);

        var stockDs = isc.DataSource.get(USE_YAHOO_FINANCE ? "stockData" : "staticStockData");
        stockDs.fetchData({ symbol: symbol }, function (dsResponse, data, dsRequest) {
            if (isc.isAn.Array(data) && data.length > 0) {
                stockChart._hideMessage();
                stockChart.title = name;
                stockChart.setData(data.sortByProperty("date", Date.compareDates));
            } else {
                stockChart._showMessage(stockChart._errorMessage, false);
                stockChart.title = null;
                stockChart.setData([]);
            }
        });
    }
});

var symbolForm = isc.DynamicForm.create({
    autoDraw: false,
    items: [{
        name: "symbol",
        title: "Stock Symbol",
        canEdit: false,
        editorType: "ComboBoxItem",
        autoFetchData: false,
        optionDataSource: "nasdaqSymbols",
        pickListWidth: 450,
        pickListFields: [{ name: "symbol"}, { name: "name" }],
        displayField: "name",
        valueField: "symbol",
        sortField: "symbol",
        changeOnKeypress: false,
        changed : function (form, self, symbol) {
            if (!symbol) {
                stockChart.setData([]);
            } else {
                stockChart._updateData(symbol, this.getDisplayValue(symbol));
            }
        }
    }]
});
var symbolItem = symbolForm.getItem("symbol");

isc.VLayout.create({
    width: "100%",
    height: "100%",
    margin: 5,
    membersMargin: 20,
    members: [symbolForm, stockChart]
});

symbolItem.fetchData(function (symbolItem, dsResponse, data, dsRequest) {
    if (!(dsResponse.status < 0) && isc.isAn.Array(data) && data.length > 0) {
        symbolItem.setCanEdit(true);
        var symbol = data[0].symbol;
        symbolItem.setValue(symbol);
        stockChart._updateData(symbol, symbolItem.getDisplayValue(symbol));
    }
});
