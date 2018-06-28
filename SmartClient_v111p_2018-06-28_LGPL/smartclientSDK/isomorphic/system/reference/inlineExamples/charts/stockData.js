isc.defineClass("FinanceDataSource", "DataSource").addProperties({
    canMultiSort: false,
    allowAdvancedCriteria: false,

    fields: [
        { name: "symbol", title: "Symbol" },
        { name: "date", title: "Date", type: "date" },
        { name: "open", title: "Open", type: "float" },
        { name: "high", title: "High", type: "float" },
        { name: "low", title: "Low", type: "float" },
        { name: "close", title: "Close", type: "float" },
        { name: "volume", title: "Volume", type: "float" },
        { name: "adjClose", title: "Adj Close", type: "float" }
    ],

    handleError : function (response, request) {
        // Suppress RPCManager.handleError() from being called.  In the sample,
        // an error label is drawn rather than showing the default warning dialog.
        return false;
    },

    // Parses the CSV formatted data returned from the server into a list of records.
    _parseData : function (data, symbol) {
        var records = [],
            fields = [],
            len = data.length,
            i = -1, j;

        // The line separator is "\n" and the value separator is ",".
        while (true) {
            j = data.indexOf("\n", i + 1);
            if (j == -1) j = len;

            if (j > i + 1) { // Skip consecutive newlines.

                var record = {}, k = i, l, index = 0;
                while (true) {
                    l = Math.min(data.indexOf(",", k + 1), j);
                    if (l == -1) l = j;

                    if (i == -1) {
                        // The first line is a header:
                        // e.g. "Date,Open,High,Low,Close,Volume,Adj Close"
                        fields[index] = this.getFieldByTitle(data.substring(k + 1, l));

                    } else {
                        var field = fields[index];
                        if (field != null) {
                            var fieldName = field.name,
                                fieldType = field.type,
                                value = data.substring(k + 1, l);

                            if (fieldType === "float") {
                                record[fieldName] = parseFloat(value);
                            } else if (fieldType === "date") {
                                // e.g. "2012-07-19" is July 19, 2012
                                var year = parseInt(value.substring(0, 4));
                                var month = 10 * parseInt(value.charAt(5)) + parseInt(value.charAt(6));
                                var day = 10 * parseInt(value.charAt(8)) + parseInt(value.charAt(9));
                                record[fieldName] = isc.DateUtil.createLogicalDate(year, month - 1, day);
                            } else {
                                record[fieldName] = value;
                            }
                        }
                    }

                    if (!(l != -1 && l < j)) break;
                    k = l;
                    ++index;
                }

                if (i != -1) {
                    record.symbol = symbol;
                    records.push(record);
                }
            }

            if (!(j != -1 && j < len)) break;
            i = j;
        }

        return records;
    }
});

var stockData = isc.FinanceDataSource.create({
    ID: "stockData",
    dataURL: "http://ichart.finance.yahoo.com/table.csv",
    dataProtocol: "getParams",
    dataFormat: "custom",

    _months: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"],

    // Options for the query parameter "g":
    _daily: "d",
    _weekly: "w",
    _month: "m",
    _dividendsOnly: "v",
    transformRequest : function (dsRequest) {
        if (dsRequest.operationType === "fetch") {
            var criteria = dsRequest.data,
                symbol = criteria && criteria.symbol;

            if (symbol == null) return;

            var to = new Date(),
                from = new Date(to.getFullYear() - 10, to.getMonth(), to.getDate()),
                startMonth = this._months[from.getMonth()],
                startDay = from.getDate(),
                startYear = from.getFullYear(),
                endMonth = this._months[to.getMonth()],
                endDay = to.getDate(),
                endYear = to.getFullYear();

            dsRequest.clientContext = isc.addProperties({ symbol: symbol }, dsRequest.clientContext);

            return {
                s: symbol,
                a: startMonth,
                b: startDay,
                c: startYear,
                d: endMonth,
                e: endDay,
                f: endYear,
                g: this._daily,
                ignore: ".csv"
            };
        }
    },

    transformResponse : function (dsResponse, dsRequest, data) {
        var status = dsResponse.status,
            success = !(dsResponse.status < 0),
            symbol = dsRequest.clientContext.symbol;

        dsResponse.data = success ? this._parseData(data, symbol) : null;
        dsResponse.status = status;
        delete dsResponse.startRow;
        delete dsResponse.endRow;
        delete dsResponse.totalRows;
        return dsResponse;
    }
});

var staticStockData = isc.FinanceDataSource.create({
    ID: "staticStockData",
    dataProtocol: "clientCustom",

    transformRequest : function (dsRequest) {
        if (dsRequest.operationType === "fetch") {
            var symbol = dsRequest.data.symbol;
            isc.RPCManager.sendRequest({
                actionURL: isc.Page.getURL("[ISOMORPHIC]/system/reference/inlineExamples/charts/" + symbol + ".txt"),
                willHandleError: true,
                callback : function (rpcResponse, rawData, rpcRequest) {
                    var dsResponse = {
                        status: rpcResponse.status
                    };
                    if (!(rpcResponse.status < 0)) {
                        data = dsResponse.data = staticStockData._parseData(rawData, symbol);
                    }
                    staticStockData.processResponse(dsRequest.requestId, dsResponse);
                }
            });
        }
    }
});
