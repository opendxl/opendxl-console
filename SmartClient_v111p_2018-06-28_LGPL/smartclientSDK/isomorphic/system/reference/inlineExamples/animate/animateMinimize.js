isc.Window.create({
    ID: "exampleWindow",
    width: 360,
    height: 100,
    title: "System status - all systems: <span style='color:lightgreen;font-weight:bold'>Normal</span>",
    canDragReposition: true,
    animateMinimize: true,
    items: [
        isc.HTMLFlow.create({
            padding:5,
            width: "100%",
            height: "100%",
            contents: "Staging: <span style='color:green;font-weight:bold'>Normal</span><br>"+
                      "Production: <span style='color:green;font-weight:bold'>Normal</span><br>"+
                      "Development: <span style='color:green;font-weight:bold'>Normal</span><br>"
        })
    ]
});
