isc.defineClass("GameBoard", "DrawRect").addMethods({

    lineOpacity: 0,
    eventOpaque: true,

    drawStart : function () {
        var context = this.drawPane.getBitmap().getContext("2d");
        
        // grab the bounding box, and compute width and height
        var boundingBox = this.getResizeBoundingBox();
        var x1 = boundingBox[0], y1 = boundingBox[1];
        var x2 = boundingBox[2], y2 = boundingBox[3];

        var width  = x2 - x1;
        var height = y2 - y1;

        context.lineWidth = 3;
        context.strokeStyle = this.cssColor;

        // draw the board lines
        for (var i = 1; i < 3; i++) {
            context.beginPath();

            var xOffsetLocal = i * width/3;
            context.moveTo(x1 + xOffsetLocal, y1);
            context.lineTo(x1 + xOffsetLocal, y2);

            var  yOffsetLocal = i * height/3;
            context.moveTo(x1, y1 + yOffsetLocal);
            context.lineTo(x2, y1 + yOffsetLocal);

            context.stroke();
        }

        var radius = (width < height ? width : height) / 10;
            
        // draw the board pieces
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                context.beginPath();

                var xOffsetLocal = (i + 0.5) * width/3;
                var yOffsetLocal = (j + 0.5) * height/3;
                    
                if ( (i - j) % 2 == 0) {
                    context.moveTo(x1 + xOffsetLocal - radius, y1 + yOffsetLocal - radius);
                    context.lineTo(x1 + xOffsetLocal + radius, y1 + yOffsetLocal + radius);
                    context.moveTo(x1 + xOffsetLocal - radius, y1 + yOffsetLocal + radius);
                    context.lineTo(x1 + xOffsetLocal + radius, y1 + yOffsetLocal - radius);
                } else {
                    context.arc(x1 + xOffsetLocal, y1 + yOffsetLocal,radius, 0, Math.PI*2);
                }

                context.stroke();
            }
        }
    }

});

var mainPane = isc.DrawPane.create({
    autoDraw: true,
    showEdges: true,
    width: 462,
    height: 462
});

var commonProps = {
    autoDraw: true,
    canDrag: true,
    drawPane: mainPane,
    titleRotationMode: "neverRotate"
};

isc.DrawTriangle.create({
    points: [[125, 50], [200, 200], [50, 200]],
    title: "Triangle"
}, commonProps);

isc.GameBoard.create({
    left: 250, top: 50,
    width: 150, height: 150,
    cssColor: "rgba(0, 0, 255, 0.75)"
}, commonProps);

isc.GameBoard.create({
    left: 50, top: 250,
    width: 150, height: 150,
    cssColor: "rgba(255, 0, 0, 0.75)"
}, commonProps);

isc.DrawOval.create({
    left: 250, top: 250,
    width: 150, height: 150,
    title: "Oval"
}, commonProps);

var toggleKnobs = isc.Button.create({
    title: "Show Knobs",
    click : function () {
        var mainItems = mainPane.drawItems.duplicate(),
            showKnobs = this.showKnobs = !this.showKnobs;
        for (var i = 0; i < mainItems.length; i++) {
            var item = mainItems[i];
            if (item.masterElement) continue;
            if (showKnobs) item.showKnobs(["move", "resize"]);
            else           item.hideAllKnobs();
        }
        toggleKnobs.setTitle(showKnobs ? "Hide Knobs" : "Show Knobs");
    }
});

isc.VStack.create({
    width: "100%",
    membersMargin: 10,
    members: [mainPane, toggleKnobs]
});
