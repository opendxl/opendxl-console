/*---------->    SimpleSlider_2.js    <----------*/

// Step 2
//	* make slider thumb draggable
//	* calculate and set constrained thumb position when dragging

ClassFactory.defineClass("SimpleSlider", Canvas);


SimpleSlider.addProperties({
	length:200,
	vertical:true,
	
	thumbThickWidth:30,
	thumbThinWidth:10,
	trackWidth:4,

    initWidget : function () {
    
        this.Super("initWidget",	arguments);
        
        var width, height;
    
        if (this.vertical) {
            width = Math.max(this.thumbThickWidth, this.trackWidth);
            height = this.length;
        } else {
            width = this.length;
            height = Math.max(this.thumbThickWidth, this.trackWidth);
        }
        
        this.setWidth(width);
        this.setHeight(height);
        
        this._usableLength = this.length-this.thumbThinWidth;
        
        this._track = this.addChild(this._createTrack());
        this._thumb = this.addChild(this._createThumb());
    },
    
    
    _createTrack : function () {
        return Canvas.create({
            autoDraw:false,
            left:(this.vertical ? Math.floor((this.getWidth() - this.trackWidth)/2) : 0),
            top:(this.vertical ? 0 : Math.floor((this.getHeight() - this.trackWidth)/2)),
            width:(this.vertical ? this.trackWidth : this.getWidth()),
            height:(this.vertical ? this.getHeight() : this.trackWidth),
            vertical:this.vertical,
            backgroundColor:"#666666",
            overflow:Canvas.HIDDEN
        });
    },
    
    
    _createThumb : function () {
        return Canvas.create({
            autoDraw:false,
            left:(this.vertical ? Math.floor((this.getWidth() - this.thumbThickWidth)/2) : 0),
            top:(this.vertical ? 0 : Math.floor((this.getHeight() - this.thumbThickWidth)/2)),
            width:(this.vertical ? this.thumbThickWidth : this.thumbThinWidth),
            height:(this.vertical ? this.thumbThinWidth : this.thumbThickWidth),
            canDrag:true,
            dragAppearance:EventHandler.NONE,
            dragMove:"this.parentElement._thumbMove(); return false",
            dragStart:EventHandler.stopBubbling,
            backgroundColor:"#AAAAAA"
        });
    },
    
    
    _thumbMove : function () {
        var thumbPosition;
        
        if (this.vertical) {
            thumbPosition = EventHandler.getY() - this.getPageTop();
            thumbPosition = Math.max(0, Math.min(this._usableLength, thumbPosition));
            if (thumbPosition == this._thumb.getTop()) return;
            this._thumb.setTop(thumbPosition);
        } else {
            thumbPosition = EventHandler.getX() - this.getPageLeft();
            thumbPosition = Math.max(0, Math.min(this._usableLength, thumbPosition));
            if (thumbPosition == this._thumb.getLeft()) return;
            this._thumb.setLeft(thumbPosition);
        }
    }

});
