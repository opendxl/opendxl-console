isc.IButton.create({
    ID: "saveButton",
    title: "Save"
});

isc.IButton.create({
    left: 150,
    title: "Disable Save",
    click: function () {
        if (this.title == "Disable Save") {
            this.setTitle("Enable Save");
            saveButton.disable();
        } else {
            this.setTitle("Disable Save");
            saveButton.enable();
        }
    }
});

isc.defineClass("DragLabel", "Label").addProperties({
    align:"center", padding:4, showEdges:true,
    minWidth:70, minHeight:70, maxWidth:300, maxHeight:200,
    keepInParentRect:true,
    canDragReposition:true,
    dragAppearance:"target"
})

isc.DragLabel.create({
    left:80, top:80, 
    contents:"Resize from any side",
    canDragResize:true,
    edgeMarginSize:10 // easier to grab than the default 5px margin
})

isc.DragLabel.create({
    left:280, top:80,
    contents:"Resize from bottom or right",
    canDragResize:true,
    resizeFrom:["B","R","BR"],
    edgeMarginSize:10
})