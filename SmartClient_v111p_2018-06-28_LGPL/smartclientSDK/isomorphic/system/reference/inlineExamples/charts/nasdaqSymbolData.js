isc.DataSource.create({
    ID: "nasdaqSymbols",
    clientOnly: true,

    cacheData: [{
        symbol: "AAPL",
        name: "Apple Inc.",
        sector: "Technology",
        industry: "Computer Manufacturing",
        summaryQuote: "http://www.nasdaq.com/symbol/aapl"
    }, {
        symbol: "XOM",
        name: "Exxon Mobil Corporation",
        sector: "Energy",
        industry: "Integrated oil Companies",
        summaryQuote: "http://www.nasdaq.com/symbol/xom"
    }, {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        sector: "Technology",
        industry: "Computer Software: Prepackaged Software",
        summaryQuote: "http://www.nasdaq.com/symbol/msft"
    }, {
        symbol: "WMT",
        name: "Wal-Mart Stores, Inc.",
        sector: "Consumer Services",
        industry: "Department/Specialty Retail Stores",
        summaryQuote: "http://www.nasdaq.com/symbol/wmt"
    }, {
        symbol: "IBM",
        name: "International Business Machines Corporation",
        sector: "Technology",
        industry: "Computer Manufacturing",
        summaryQuote: "http://www.nasdaq.com/symbol/ibm"
    }, {
        symbol: "GE",
        name: "General Electric Company",
        sector: "Energy",
        industry: "Consumer Electronics/Appliances",
        summaryQuote: "http://www.nasdaq.com/symbol/ge"
    }, {
        symbol: "T",
        name: "AT&T Inc.",
        sector: "Public Utilities",
        industry: "Telecommunications Equipment",
        summaryQuote: "http://www.nasdaq.com/symbol/t"
    }, {
        symbol: "CVX",
        name: "Chevron Corporation",
        sector: "Energy",
        industry: "Integrated oil Companies",
        summaryQuote: "http://www.nasdaq.com/symbol/cvx"
    }, {
        symbol: "JNJ",
        name: "Johnson & Johnson",
        sector: "Consumer Durables",
        industry: "Major Pharmaceuticals",
        summaryQuote: "http://www.nasdaq.com/symbol/jnj"
    }, {
        symbol: "KO",
        name: "Coca-Cola Company (The)",
        sector: "Consumer Non-Durables",
        industry: "Beverages (Production/Distribution)",
        summaryQuote: "http://www.nasdaq.com/symbol/ko"
    }],

    fields: [
        { name: "symbol", title: "Symbol", primaryKey: true },
        { name: "name", title: "Name" },
        { name: "sector", title: "Sector" },
        { name: "industry", title: "industry" },
        { name: "summaryQuote", title: "Summary Quote", type: "link" }
    ]
});