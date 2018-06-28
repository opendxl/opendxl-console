isc.Canvas.create({
    ID: "container"
});

isc.RPCManager.loadScreen("helloWorld",function (screen) {
    container.addChild(screen);
});