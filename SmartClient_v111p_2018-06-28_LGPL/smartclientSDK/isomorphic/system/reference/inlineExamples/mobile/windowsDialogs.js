isc.defineClass("HelpCanvas", "Canvas").addProperties({
    autoDraw: false,
    defaultWidth: 300,
    padding: 10,
    contents: "<b>Severity 1</b> - Critical problem<br>System is unavailable in production or " +
              "is corrupting data, and the error severely impacts the user's operations." +
              "<br><br><b>Severity 2</b> - Major problem<br>An important function of the system " +
              "is not available in production, and the user's operations are restricted." +
              "<br><br><b>Severity 3</b> - Minor problem<br>Inability to use a function of the " +
              "system occurs, but it does not seriously affect the user's operations."

});

isc.HLayout.create({
    width: 300,
    layoutMargin:5,
    membersMargin: 10,
    members: [
        isc.Button.create({
            title: "Show",
            width: 100,
            click : function () {
                if (this.fillScreenWindow == null) {
                    this.fillScreenWindow = isc.Window.create({
                        ID:"fillScreenWindow",
            	    placement: "fillScreen",
            	    title: "Window",
            	    canDragReposition: true,
            	    canDragResize: true,
            	    items: [
            	        isc.HelpCanvas.create()
            	    ]
            	});
                } else {
                    this.fillScreenWindow.show();
                }
                //>FEStrip always bring the fillScreenWindow to front.
                // This is not usually required, but in WWW we show a header bar
                // on the view-examples page which otherwise sits above the window
                // and partially blocks it.
                // It's not implemented as a Canvas so our normal z-index management
                // doesn't realize the window is occluded - but its z-index is set such
                // that a bringToFront() on the fill-screen-window will bring it 
                // above this header bar. //<FEStrip
                this.fillScreenWindow.bringToFront();
            }
        }),
        isc.Button.create({
            title: "Ask for Value",
            width: 100,
            click : function () {
            	isc.askForValue ();
            }
        })
    ]
});

