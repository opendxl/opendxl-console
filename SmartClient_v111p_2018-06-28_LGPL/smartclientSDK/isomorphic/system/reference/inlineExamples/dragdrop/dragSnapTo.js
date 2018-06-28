isc.Canvas.create({
    ID: "gridCanvas",
    autoDraw: false,
    border: "1px solid blue",
    width: 400,
    height: 300,
    showSnapGrid:true,
    childrenSnapToGrid: true,
    childrenSnapResizeToGrid: true,
    overflow: "hidden",
    children: [
        isc.Label.create({
            width: 80, height: 40, align: "center",
            contents: "Drag or Resize me",
            backgroundColor: "white",
            showEdges: true,
            canDragReposition: true,
            canDragResize: true,
            dragAppearance: "target",
            keepInParentRect: true
        })
    ]
});

isc.DynamicForm.create({
    ID: "gridForm",
    width: 400,
    values: {snapDrag: true, snapResize: true, hgap: 20, vgap: 20},
    numCols: 4,
    fields: [{
        name: "snapDrag", title: "Enable Snap-To-Grid Move", type: "checkbox", 
        changed: "gridCanvas.setProperty('childrenSnapToGrid', !gridCanvas.childrenSnapToGrid)"
        }, {
        name: "snapResize", title: "Enable Snap To Grid Resize", type: "checkbox", 
        changed: "gridCanvas.setProperty('childrenSnapResizeToGrid', !gridCanvas.childrenSnapResizeToGrid)"
        }, {
        name: "hgap", title: "Horizontal snap-to gap", type: "radioGroup",
        valueMap: {10: "10 pixels", 20: "20 pixels", 50: "50 pixels"},
        changed: "gridCanvas.setProperty('snapHGap', Number(this.getValue()))"
        }, {
        name: "vgap", title: "Vertical snap-to gap", type: "radioGroup",
        valueMap: {10: "10 pixels", 20: "20 pixels", 50: "50 pixels"},
        changed: "gridCanvas.setProperty('snapVGap', Number(this.getValue()))"
        }
    ]
});

isc.VLayout.create({
    membersMargin: 10,
    members: [
        gridCanvas, gridForm
    ]
})


