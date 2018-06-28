var zoomedObject = null;

isc.defineClass("ZoomImg", "Img").addProperties({
    width:48, height:48, appImgDir: "pieces/48/",
    zoomTime: 1000,
    shrinkTime: 300,
    click: function () {
        // remember original position
        if (this.originalLeft==null) this.originalLeft = this.left;
        if (!zoomedObject) { // nothing expanded, so just expand
            this.zoom();
        } else if (zoomedObject == this) { // already expanded, so just shrink
            this.shrink();
            zoomedObject = null;
        } else { // another object is expanded; shrink it and then expand this object
            zoomedObject.shrink(this.getID()+".zoom()");
        }
    },
    zoom: function () {
        this.animateRect(25, 100, 200, 200, null, this.zoomTime);
        zoomedObject = this;
    },
    shrink: function (postShrinkScript) {
        this.animateRect(this.originalLeft, 0, 48, 48, postShrinkScript, this.shrinkTime);
    }
})

isc.ZoomImg.create({left:0, src:"cube_blue.png"})

isc.ZoomImg.create({left:100, src:"pawn_yellow.png"})

isc.ZoomImg.create({left:200, src:"piece_green.png"})
