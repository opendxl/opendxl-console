isc.HLayout.create({
    width: "80%",
    showEdges: true,
    edgeImage:"edges/custom/sharpframe_10.png",
    dragAppearance: "target",
    overflow: "hidden",
    canDragResize: true,
	resizeFrom: [ "L", "R" ],
    layoutMargin: 10,
    membersMargin: 10,
    minWidth: 100,
    minHeight: 50,
    members : [
        isc.Label.create({
            overflow: "hidden",
            showEdges: true,
            canDragResize: true,
			resizeFrom: [ "L", "R" ],
            contents: "Member 1",
            align: "center"
        }),
        isc.Label.create({
            overflow: "hidden",
            showEdges: true,
            canDragResize: true,
			resizeFrom: [ "L", "R" ],
            contents: "Member 2",
            align: "center"
        })
    ]
});