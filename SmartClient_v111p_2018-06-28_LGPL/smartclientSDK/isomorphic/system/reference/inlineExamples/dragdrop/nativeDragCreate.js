

var dragTrackerImageURLs = {
    "b": "data:image/png;base64,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",
    "y": "data:image/png;base64,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",
    "g": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEU0lEQVRo3tWawW4bNxCGv1kzie2cWhhI02N7LNB3q9vHaJI3zCloHMBIT3ZkR+Lfw1Ly7ooczio9tAQEaXdJLmf4z/zDGcH/vNnRnXcYqjzbX6n8Xn4zec7k2XIONZ7VVjSfa7y6no+cL/ItA2LAOAOG8om3mlCqqKklfK3P2HL57IDMNflYgDcMQALOgZflO60Swhaa62k2NjYDW4wN4g7YYGz3QozD/sSK1i+BK+A14gq4LPetoZljbfcWFdP4/lqIHcY94hb4CNyW6x1/oDR5wVnR/GvgF+An4HvE8yMBVMF1a1HL33IE0dG1gEfEZ+B9EeoL4qHAiXSYTgwFNlfAz8CvwA/AC4zhyDitIgwNwaxyTyHjzsADxg3CMD4h/iqwNpjvgAEJ4xLxHcYrxI8YF6gIYGVKz2BrLTswwbWNDGzIgPEB8RJ4NrXLtNDDgEjAc8Q5cIG4OAxovVAND9OClQJGPRf9BeJZgblNx6fqJHaA1HCyO2UFH7R8/3g9XYMt+6WqBrLjzxX0JnLuyzHsKVR7a6gKoIqx1RYlZwdywy7kuE0cwZz3pi6Depi2DlwiBq4gQTbeM8y0rMUW54oXmfZf3s8NbebK2NbiVVGCGu+vGnFuaF4d16cKfCLExsq+VQj1MNnaxh4UFIRaBC7Ws4GeFtXBsTX6TsnPHC/X4oncdK+OG127xVEjVYcE185X9UKnbGnLW3kkFiG2wNjU3LpeXINj6C3+sM5u50CfLhOvDZVP9SZrwhBHqWlVEOaFFQq8NArTiMDyvFBNy14oUQsdFAgxrOH11GH1pgC2wiv0YqOIVuVGoe3gDy+Y8yDSihaj3EDgOFlzDA4sU8gw1SCzHDzbRhmbhnLUPgydRmQRz+JxQiQkCaZekhu3WEeQXrjtzdNLDFjMO6buAaSXPSNorL1g0Ts/dCHU8yLq0L6Cu7OWyALQHFytLn97h4uagXPi4uU4klw70OhEaPSwriDLRx1EmAe8THIkVlk6gmgEuhI+HCWsvG9VItHswGu55S1Y5gAkHWilbkirgOeIJnS/hXMac6Tw+dUCyS1946Fn7cGoagO54UaXyV0aY6a7mANaXr5PDU5wYyGt37owfE456yo+v09kHkN63iOaNrF2tiHaUiPNIVQKayLPtrcVo3tpFTVg4oXTTwCbfuQdKVUWvAUegQ3wZZLi/lfSIKFagmYCbIAH4CtjWUktIxawBe6Bv0s5x1iWmHrpFTqxUcQ4n65zWfwN8BnjDvEVI++NPx20b0XasRr4vkzxgbFaY930u6fVFgRrkJrfE8YjHIp8t4hNgbWWENph3AEfyySfGMuu8zJrhPK1gh/8sWOZFe4xbhE3wB2w2/d7WtjvpdCtUug2zku9bOimUCIEuOYwNIflaJfGpix+A2x5My1079v1oRZ1dqhNeX8ZiDQ55+b4/flfDd7W/mqwb7/NqrqntWjovK7f2PPdWqb4j7d/AFA10363l8saAAAAAElFTkSuQmCC"
};

var preloadedImagesContainer = document.getElementById("preloadedImagesContainer");
if (preloadedImagesContainer == null) {
    preloadedImagesContainer = document.createElement("div");
    preloadedImagesContainer.id = "preloadedImagesContainer";
    document.body.appendChild(preloadedImagesContainer);
}
var innerHTML = "";
for (var dragType in dragTrackerImageURLs) {
    if (!dragTrackerImageURLs.hasOwnProperty(dragType)) continue;
    innerHTML += "<img src='" + dragTrackerImageURLs[dragType] + "'>";
}
preloadedImagesContainer.innerHTML = innerHTML;
preloadedImagesContainer.style.position = "absolute";
preloadedImagesContainer.style.top = "-50px";

isc.defineClass("DragPiece", "Img").addProperties({
    width:48, height:48,
    cursor: "move",
    appImgDir: "pieces/48/",
    canDrag: true,
    useNativeDrag: true,
    canFocus: false,
    showFocusOutline: false,
    canDrop: true,
    dragAppearance: "tracker",

    setDragTracker : function () {
        isc.EventHandler.setDragTracker(isc.Canvas.imgHTML("pieces/24/" + this.src, 24, 24), 24, 24, 15, 15);
    },

    dragStart : function () {
        isc.EventHandler.setNativeDragData(this.src, this.src);

        var pageTop = this.getPageTop(),
            pageLeft = this.getPageLeft(),
            x = isc.EventHandler.getX(),
            y = isc.EventHandler.getY();
        isc.EventHandler.setDragTrackerImage(dragTrackerImageURLs[this.dragType],
                                             5 + (x - pageLeft) / this.getWidth() * 38,
                                             5 + (y - pageTop) / this.getHeight() * 38);
    }
})

isc.defineClass("DroppedPiece", "Img").addProperties({
    width:24, height:24,
    appImgDir: "pieces/24/",
    canDragReposition: true,
    keepInParentRect: true,
    dragAppearance: "target",
    showContextMenu : "this.destroy(); return false;"
})

isc.defineClass("PieceBin", "Canvas").addProperties({
    width:100, height:100, overflow:"hidden",
    showEdges: true,
    edgeSize: 6,
    showContextMenu: "return false",
    canAcceptDrop: true,

    dropOver : function () {
        if (this.willAcceptDrop()) this.setBackgroundColor("LightGray");
    },
    dropOut : function () {
        this.setBackgroundColor("White");
    },
    drop : function () {
        var src = isc.EventHandler.getNativeDragData();
        if (src == null) {
            // The native drag data might be null because the browser does not support
            // HTML5 drag and drop.
            var dragTarget = isc.EventHandler.getDragTarget();
            if (dragTarget == null) return false;
            src = dragTarget.src;
        }

        this.addChild(isc.DroppedPiece.create({
            src: src,
            left: this.getOffsetX()-15-this.edgeSize,
            top: this.getOffsetY()-15-this.edgeSize
        }));
    }
});

var mainLayout = isc.VStack.create({members:[
    isc.HStack.create({layoutMargin:20, membersMargin:40, layoutAlign:"center", members:[
        isc.DragPiece.create({
            src: "cube_blue.png",
            dragType: "b"
        }),
        isc.DragPiece.create({
            src: "cube_yellow.png",
            dragType: "y"
        }),
        isc.DragPiece.create({
            src: "cube_green.png",
            dragType: "g"
        })
    ]}),
    isc.HStack.create({membersMargin:20, members:[
        isc.PieceBin.create({edgeImage:"edges/blue/6.png", dropTypes:"b"}),
        isc.PieceBin.create({edgeImage:"edges/yellow/6.png", dropTypes:"y"}),
        isc.PieceBin.create({edgeImage:"edges/green/6.png", dropTypes:"g"}),
        isc.PieceBin.create({edgeImage:"edges/gray/6.png", dropTypes:["b","y","g"]})
    ]})
]});

if (!isc.Browser.hasNativeDrag) {
    mainLayout.addMember(isc.Label.create({
        layoutAlign: "center",
        width: 400,
        height: 100,
        border: "1px solid Black",
        padding: 10,
        backgroundColor: "LightYellow",
        icon: "[SKINIMG]/Dialog/warn.png",
        contents: "Sorry, your browser does not support native drag and drop.<br>" +
                  "Please try this sample in " +
                  
                  "Chrome, Firefox, Opera&nbsp;12+, or Safari." +
                  "<p>" +
                  "You won't be able to drag and drop between browser tabs or windows, but " +
                  "the sample will still work within the same window."
    }), 0);
}
