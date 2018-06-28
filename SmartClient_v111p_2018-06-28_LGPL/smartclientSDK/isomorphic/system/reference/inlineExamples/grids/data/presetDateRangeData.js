
var _today = new Date();

var _start = _today.getDate();

var _month = _today.getMonth();

var _year = _today.getFullYear();

var presetDateRangeData = [
    {
        customerID:"C000001",
        customerName:"Bobs Tools Inc",
        orderID:"1108776",
        orderDate: new Date(_year, _month, _start),
        orderDescription:"Self Adhesive A4 address labels",
        orderQty:"10000"
    },
    {
        customerID:"C000001",
        customerName:"Bobs Tools Inc",
        orderID:"1108777",
        orderDate: new Date(_year, _month, _start - 1),
        orderDescription:"A3/A4/A5 stationary pack",
        orderQty:"2000"
    },
    {
        customerID:"C000001",
        customerName:"Bobs Tools Inc",
        orderID:"1108778",
        orderDate: new Date(_year, _month, _start - 3),
        orderDescription:"multi-coloured ringbinder pack",
        orderQty:"150"
    },
    {
        customerID:"C000002",
        customerName:"The Finance Shop",
        orderID:"1108779",
        orderDate: new Date(_year, _month, _start - 6),
        orderDescription:"5 X standard black A4 binder pack",
        orderQty:"250"
    },
    {
        customerID:"C000002",
        customerName:"The Finance Shop",
        orderID:"1108780",
        orderDate: new Date(_year, _month, _start - 9),
        orderDescription:"100 page A4 lined pads",
        orderQty:"500"
    },
    {
        customerID:"C000002",
        customerName:"The Finance Shop",
        orderID:"1108781",
        orderDate: new Date(_year, _month, _start - 16),
        orderDescription:"Magenta Printer cartridges for HPO230",
        orderQty:"50"
    },
    {
        customerID:"C000003",
        customerName:"The Office at Home Ltd",
        orderID:"1108782",
        orderDate: new Date(_year, _month, _start - 21),
        orderDescription:"Yellow Printer cartridges for HPO230",
        orderQty:"50"
    },
    {
        customerID:"C000003",
        customerName:"The Office at Home Ltd",
        orderID:"1108783",
        orderDate: new Date(_year, _month, _start - 60),
        orderDescription:"Black Printer cartridges for HPO230",
        orderQty:"50000"
    }
];
