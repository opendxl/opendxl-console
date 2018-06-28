isc.Img.create({
    src:"other/earth.png", width:48, height:48,
    top:0, left:100,
    animateOrbit : function () {
        isc.Animation.registerAnimation(this.animateOrbitStep, 2000, null, this);
    },
    animateOrbitStep : function (ratio) {
        var angle = (Math.PI*2)*ratio-(Math.PI/2);
        this.moveTo(Math.cos(angle)*100+100, Math.sin(angle)*100+100);
    },
    click: "this.animateOrbit()"
})
