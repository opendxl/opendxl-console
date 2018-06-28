isc.Canvas.create({
    ID: "container",
    width: "100%",
    height: "100%"
});

isc.RPCManager.loadScreen("demoAppXML",function (screen) {
    container.addChild(pageLayout);
}, isc.RPCManager.ALL_GLOBALS);