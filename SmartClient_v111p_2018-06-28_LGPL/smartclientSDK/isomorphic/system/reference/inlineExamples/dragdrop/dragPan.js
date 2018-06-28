var imgContainer = isc.Canvas.create({
    autoDraw: false,
    left: 50,
    top: 50,
    width: 200,
    height: 200,
    overflow: "hidden",
    showEdges: true,
    canDrag: true,
    dragAppearance: "none",
    dragStart : function () {
        this.startScrollLeft = this.getScrollLeft();
        this.startScrollTop = this.getScrollTop();
    },
    dragMove : function () {
        var newScrollLeft = Math.max(0, this.startScrollLeft - isc.EventHandler.lastEvent.x + isc.EventHandler.mouseDownEvent.x),
            newScrollTop = Math.max(0, this.startScrollTop - isc.EventHandler.lastEvent.y + isc.EventHandler.mouseDownEvent.y);
        this.scrollTo(
            newScrollLeft,
            newScrollTop
        )
    },
    dragStop : function () {
        // Implement "bounce back" - if the user has dragged the image outside of the intended
        // view box, then animateScroll() back within the intended view box.
        var innerContentWidth = this.getInnerContentWidth(),
            scrollLeft = this.getScrollLeft(),
            clampedScrollLeft = Math.max(innerContentWidth, Math.min(scrollLeft, this.getScrollWidth() - 2 * innerContentWidth + img.padding));
            scrollTop = this.getScrollTop(),
            clampedScrollTop = Math.max(innerContentWidth, Math.min(scrollTop, this.getScrollHeight() - 2 * innerContentWidth));
        if (scrollLeft != clampedScrollLeft || scrollTop != clampedScrollTop) {
            this.animateScroll(clampedScrollLeft, clampedScrollTop);
        }
    }
});

var img = isc.Img.create({
    autoDraw: false,
    cursor: "all-scroll",
    // We want the left and right borders of the image to be the imgContainer's inner content
    // width, and the top and bottom borders of the image to be the imgContainer's inner content
    // height. In this case, because the imgContainer is square, the inner content width equals
    // the inner content height. Parenthetically, if the imgContainer were non-square, we could
    // use the max of the inner content width and height.
    border: imgContainer.getInnerContentWidth() + "px solid transparent",
    padding: 20,
    imageType: "normal"
});
imgContainer.addChild(img);

// Load the image so that the Img class has the intrinsic size available to it.
var imgURL = img.getImgURL("other/cpu.jpg");
var domImage = new Image();
domImage.onload = function () {
    img.setSrc(imgURL);

    imgContainer.draw();

    var innerContentWidth = imgContainer.getInnerContentWidth();
    imgContainer.scrollTo(innerContentWidth, innerContentWidth);
};
domImage.src = imgURL;
