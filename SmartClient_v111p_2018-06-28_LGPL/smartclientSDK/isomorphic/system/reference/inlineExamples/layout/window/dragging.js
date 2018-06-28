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

isc.Window.create({
    title: "Severity Levels",
    autoSize: true,
    canDragReposition: true,
    canDragResize: true,
    items: [
        isc.HelpCanvas.create()
    ]
});
