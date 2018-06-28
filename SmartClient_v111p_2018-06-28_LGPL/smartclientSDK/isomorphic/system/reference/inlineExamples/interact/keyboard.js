isc.Label.create({
    ID: "theLabel",
    canFocus: true,
    showEdges: true,
    padding:4,
    contents: "Click me, then move me with arrow keys.",
    keyPress : function () {
        var left = this.getLeft();
        var top = this.getTop();
        switch (isc.EventHandler.getKey()) {
            case "Arrow_Left": 
                left -= 10; break;
            case "Arrow_Right": 
                left += 10; break;
            case "Arrow_Up": 
                top -= 10; break;
            case "Arrow_Down": 
                top += 10; break;
            default : return;
        }
        
        // don't go out of bounds
        if (left < 0) left = 0;
        if (top < 0) top = 0;

        this.setLeft(left);
        this.setTop(top);
    }
});

