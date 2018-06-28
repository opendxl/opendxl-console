isc.Img.create({
    ID:"greenPiece",
    width:48, height:48, src:"pieces/48/pawn_green.png",
    canDrag: true,
    canDrop: true,
    dragAppearance: "tracker",
    setDragTracker: "isc.EventHandler.setDragTracker(isc.Canvas.imgHTML('pieces/24/pawn_green.png',24,24))"
});

isc.Label.create({
    left: 100,
    width: 300,
    height: 300,
    backgroundColor: "lightblue",
    styleName:"blackText",
    align: "center",
    contents: "Show Drop Reticle",
    overflow: "hidden",
    canAcceptDrop: true,
    initWidget : function () {
        this.Super("initWidget", arguments);

        var props = {
            autoDraw: false,
            // oversize so we don't ever show both borders
            width: this.getWidth()+2,
            height: this.getHeight()+2,
            border: "1px solid black",
            visibility: "hidden"
        };
        this.crossHairX = isc.Canvas.create(props);
        this.crossHairY = isc.Canvas.create(props);
        this.addChild(this.crossHairX);
        this.addChild(this.crossHairY);
    },  

    dropOver : function () {
        this.crossHairX.show();
        this.crossHairY.show();
        this.updateCrossHairs();
    },
    dropMove : function () {
        this.updateCrossHairs();
    },
    dropOut : function () {
        this.crossHairX.hide();
        this.crossHairY.hide();
    },
    updateCrossHairs : function () {
        var x = this.getOffsetX();
        var y = this.getOffsetY();
        
        // crossHairX is the -X and +Y axis of the crossHair
        this.crossHairX.setLeft(x-this.getWidth()-1);
        this.crossHairX.setTop(y-this.getHeight()-1);
        
        // crossHairY is +X, -Y
        this.crossHairY.setLeft(x);
        this.crossHairY.setTop(y);
    }

});
