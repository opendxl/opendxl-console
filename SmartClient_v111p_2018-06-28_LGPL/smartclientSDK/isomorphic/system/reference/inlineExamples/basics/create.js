isc.Canvas.create({
    ID: "cubeBin",
    top:40, width:400, height:300,
    showEdges: true
})


isc.IButton.create({
    title:"Create", icon:"pieces/16/cube_blue.png",
    mouseUp: function () {
        isc.Img.create({
            left: isc.Math.random(340),
            top: isc.Math.random(240),
            width:48, height:48,
            parentElement: cubeBin,
            src: "pieces/48/cube_blue.png",
            click: "this.destroy()"
        })
    }
})
