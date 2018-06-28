isc.Canvas.create({
    ID: "container", width: "100%", height: "100%"
});

isc.RPCManager.loadScreen("enabledAndVisibilityRules",function (screen) {
    container.addChild(screen);
});

