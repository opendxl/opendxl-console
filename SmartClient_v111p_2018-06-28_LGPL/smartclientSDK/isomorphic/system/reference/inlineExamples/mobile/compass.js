window.eventListener = isc.Class.create({
    deviceorientation : function (event) {
        this.lastDeviceOrientationEvent = event;
    }
});

isc.DetailViewer.create({
    ID: "orientationDV",
    width: 100,
    fields: [
      {name: "alpha"}
    ],
    data: [{alpha: "N/A"}],
    updateOrientation : function () {
       var dataPoint = {
           alpha: eventListener.lastDeviceOrientationEvent.alpha
       }
       this.setData(dataPoint);
    }
});
orientationDV.observe(eventListener, "deviceorientation", "observer.updateOrientation()");


isc.DrawPane.create({
    showEdges: true,
    autoDraw:  true,
    ID:        "mainPane",
    width:     300,
    height:    300,
    top:       100,
    overflow:  "hidden"
});


isc.DrawLine.create({
    ID: "compassNeedle",
    autoDraw:    true,
    drawPane:    mainPane,
    lineWidth:   5,
    linePattern: "solid", 
    lineCap:     "round",
    endArrow: "open",
    startPoint:    [150, 150],
    endPoint:  [150, 50],
    updateOrientation : function () {
        var alpha = eventListener.lastDeviceOrientationEvent.alpha;
        this.rotateTo(alpha);
    }
});
compassNeedle.observe(eventListener, "deviceorientation", "observer.updateOrientation()");


window.addEventListener("deviceorientation", function(event) {
    eventListener.deviceorientation(event);
}, true);
