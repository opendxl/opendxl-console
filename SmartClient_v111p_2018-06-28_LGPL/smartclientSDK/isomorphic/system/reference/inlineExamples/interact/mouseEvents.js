isc.Label.create({
    ID: "mouser",
    contents: "<b>Mouse Me</b>",
    align: "center",
    overflow: "hidden",
    showEdges: "true",
    backgroundColor: "lightblue",
    styleName:"blackText",
    width: 200,
    height: 200,
    top: 40,
    // This setting is required for for opacity support in 
    // Internet Explorer 8 and earlier only 
    useOpacityFilter:true,
    
    minSize: 40,
    maxSize: 400,
    zoomMultiplier: 15,
    mouseWheel : function () {
        var wheelDelta = isc.EventHandler.getWheelDelta();

        // stay within min/maxSize bounds
        var newSize = this.getWidth() + wheelDelta * this.zoomMultiplier;
        if (newSize < this.minSize) newSize = this.minSize;
        else if (newSize > this.maxSize) newSize = this.maxSize;

        this.setWidth(newSize);
        this.setHeight(newSize);
        eventTracker.setLastEvent("mouseWheel");
    },
    mouseStillDown : function () {
        if (this.contains(isc.EventHandler.getTarget(), true)) {
            var opacity = this.opacity == null ? 100 : this.opacity;
            this.setOpacity(Math.max(0, opacity - 5));
            eventTracker.setLastEvent("mouseStillDown");
        }
    },
    mouseUp : function () {
        this.setOpacity(100);
        eventTracker.setLastEvent("mouseUp");
    },
    mouseMove : function () {
        // scale to 1
        var xScale = this.getOffsetX()/this.getWidth();
        var yScale = this.getOffsetY()/this.getHeight();

        // increasing red intensity on the x axis, green on the y axis.  Blue stays at zero.
        this.setBackgroundColor("rgb(0,"+Math.round(255*xScale)+","+Math.round(255*yScale)+")");
        eventTracker.setLastEvent("mouseMove");
    },
    mouseOut : function () {
        // restore settings
        this.setBackgroundColor("lightblue");
        this.setOpacity(100);
        eventTracker.setLastEvent("mouseOut");
    },
    showContextMenu : function () {
        return false;
    }
});

isc.Label.create({
    ID: "eventTracker",
    contents: "<nobr>Last event: (mouse over the canvas below...)</nobr>",
    height: 20,
    setLastEvent : function (event) {
        var localX = mouser.getOffsetX(),
            localY = mouser.getOffsetY();
        this.setContents("<nobr>Last event: <b>"+event+"</b> ("+localX+", "+localY+")</nobr>");
    }
});

