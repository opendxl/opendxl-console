window.eventListener = isc.Class.create({
    devicemotion : function (event) {
        this.lastDeviceMotionEvent = event;
    }
});


isc.DetailViewer.create({
    ID: "accelerometerDV",
    width: 100,
    fields: [
      {name: "accelX"},
      {name: "accelY"}
    ],
    data: [{accelX: "N/A", accelY: "N/A"}],
    updatePosition : function () {
       var dataPoint = {
           accelX: eventListener.lastDeviceMotionEvent.accelerationIncludingGravity.x,
           accelY: eventListener.lastDeviceMotionEvent.accelerationIncludingGravity.y
       }
       this.setData(dataPoint);
    }
});
accelerometerDV.observe(eventListener, "devicemotion", "observer.updatePosition()");

isc.Canvas.create({
   ID: "ball",
   backgroundColor: "#FF0000",
   width: 20,
   height: 20,
   updatePosition : function () {  
       var accelX = eventListener.lastDeviceMotionEvent.accelerationIncludingGravity.x;
       var accelY = -eventListener.lastDeviceMotionEvent.accelerationIncludingGravity.y;

       var orientation = isc.Page.getOrientation();


       var leftOffset = orientation == "portrait" ? accelX : accelY
       var topOffset = orientation == "portrait" ? accelY : accelX;
       
       // XXX need API to detect orientation
       var newX = isc.Math.clamp(Math.round(ball.getLeft()+leftOffset), 0, playpen.getWidth()-ball.getWidth()-1);
       var newY = isc.Math.clamp(Math.round(ball.getTop()+topOffset), 0, playpen.getHeight()-ball.getHeight()-1);
       
       this.setLeft(newX);
       this.setTop(newY);
   },
   keepInParentRect: true
});
ball.observe(eventListener, "devicemotion", "observer.updatePosition()");

isc.Canvas.create({
   ID: "playpen",
   border: "1px solid black",
   children: [ball]
});

isc.VLayout.create({
   width: "100%",
   height: "100%",
   members: [
       accelerometerDV, 
//       eventLabel, 
       playpen]
});


window.addEventListener("devicemotion", function(event) {
    eventListener.devicemotion(event);
}, true);
