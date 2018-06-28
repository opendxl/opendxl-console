isc.FacetChart.create({
    ID: "bodePlot",
    showTitle: false,
    width: "100%",
    height: "100%",
    margin: 5,

    chartType: "Line",
    rotateLabels: "never",
    minLabelGap: 5,
    labelCollapseMode: "numeric",
    allowedChartTypes: ["Area", "Line"],
    
    facets: [{
        id: "frequency", title: "Frequency / Cutoff Frequency"
    }, {
        id: "rippleFactor"
    }],
    valueTitle: "Gain (in decibels)",
    valueProperty: "gain",
    decimalPrecision: 6,

    canZoom: true,
    zoomLogScale: false,
    zoomShowSelection: false,

    initWidget : function () {
        // Units
        var kHz = 1000;

        // Equation parameters
        var n = 4,                  // 4th order Chebyshev polynomial
            f = 10 * kHz,           // cutoff frequency = 10 kHz
            w0 = 2.0 * Math.PI * f;

        // The x-axis will show the range from (angular) frequency of zero
        // to twice the cutoff frequency.
        var wdw0Min = 0.0, wdw0Max = 2.0;

        // Generate the data
        var data = [];
        for (var i = 0, len = 800; i < len; ++i) {
            var lambda = i / (len - 1),
                wdw0 = (1.0 - lambda) * wdw0Min + lambda * wdw0Max,
                w = wdw0 * w0;

            data.push({
                frequency: wdw0,
                rippleFactor: "Ripple Factor 2.0",
                gain: this._dB(this._gain(n, 2.0, w0, w))
            });
            data.push({
                frequency: wdw0,
                rippleFactor: "Ripple Factor 10.0",
                gain: this._dB(this._gain(n, 10.0, w0, w))
            });
        }

        this.data = data;
        return this.Super("initWidget", arguments);
    },

    _dB : function (x) {
        return 20.0 * Math.log(x) / Math.LN10;
    },

    _gain : function (n, e, w0, w) {
        var tn = this._createChebyshevPolynomial(n);
            e2 = e * e,
            wdw0 = w / w0,
            tnwdw0 = tn(wdw0),
            tnwdw02 = tnwdw0 * tnwdw0;

        return 1.0 / Math.sqrt(1.0 + e2 * tnwdw02);
    },

    _createChebyshevPolynomial: (function () {
        var expMemo = [], fnMemo = [];

        var expression = function (n) {
            if (expMemo[n] != null) {
                return expMemo[n];
            } else {
                var exp;
                if (n == 0) {
                    exp = "1.0";
                } else if (n == 1) {
                    exp = "x";
                } else {
                    exp = "2.0*x*(" + expression(n-1) + ")-(" + expression(n-2) + ")";
                }
                expMemo[n] = exp;
                return exp;
            }
        };

        return function (n) {
            if (fnMemo[n] != null) {
                return fnMemo[n];
            } else {
                return (fnMemo[n] = eval("0, (function (x) { return " + expression(n) + "; })"));
            };
        };
    })()
});
