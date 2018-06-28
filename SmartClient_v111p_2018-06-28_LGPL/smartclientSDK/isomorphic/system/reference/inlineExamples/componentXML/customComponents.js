isc.ClassFactory.defineClass("MyListGrid", "ListGrid");
isc.MyListGrid.addProperties({
    hilitePricesOverTen: false,
    
    setHilitePricesOverTen : function (hilitePricesOverTenNewValue) {
        this.hilitePricesOverTen = hilitePricesOverTenNewValue;
    },
    
    getCellCSSText : function (record, rowNum, colNum) {
        if (this.hilitePricesOverTen && record.unitCost > 10) {
            return "color:red;";
        }
    }
});
isc.Canvas.create({
    ID: "container"
});

isc.RPCManager.loadScreen("customComponents",function (screen) {
    container.addChild(screen);
});