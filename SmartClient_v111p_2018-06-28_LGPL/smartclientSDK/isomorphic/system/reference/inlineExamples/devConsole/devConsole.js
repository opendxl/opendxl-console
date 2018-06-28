isc.Canvas.create({
    ID:"outerCanvas",
    width:"100%",
    height:"100%"
});
isc.ListGrid.create({
    ID:"screenshotGrid",
    parentElement:"outerCanvas",
    width:100,
    height:100,
    showHeaderContextMenu:false,
    fields : [ { name:"screen", title:"Screenshot" } ],
    leaveScrollbarGap:false,
    data : [
        { screen:"Results Tab", src: "sc_devConsole_results.png", 
          description:
"The Results pane of the Developer Console contains:\r" +
"<ul>\r" +
"<li>Diagnostics logged by SmartClient or your application code through the SmartClient logging system.  The Logging Preferences menu allows you to enable different levels of diagnostics in over 30 categories, from Layout to Events to Data Binding.\r" +
"<li>SmartClient component statistics. As you move the mouse in the current application, the ID of the current component under the mouse pointer is displayed in this area.\r" +
"<li>A runtime code evaluation area. You may evaluate expressions and execute actions from this area in order to inspect the running state of your application or try out new code.\r" +
"</ul>\r"
        },
        { screen:"Watch Tab", src: "sc_devConsole_watch.png", description:
"The Watch pane allows a developer to quickly grasp the structure of a SmartClient Application.  In the Watch pane, you may:\r" +
"<ul>\r" +
"<li>Click on any item in the tree to highlight the corresponding component in the main application window with a flashing, red-dotted border.\r" +
"<li>Right-click on any item in the tree for a menu of operations, including a direct link to the API reference for that component's class.\r" + 
"<li>Right-click on the column headers of the tree to show or hide columns.\r" +
"</ul>\r"
},
        { screen:"Reference Tab", src: "sc_reference.png", description:
"SmartClient documentation is integrated directly into the Developer Console so it is always at your fingertips.\r" +
"This enormous resource offers both reference and conceptual information, and has integrated search, as well\r" +
"as live, modifiable examples.  In addition, other tools within the Console link to and incorporate reference documentation."

 }
    ],
    recordClick : function (grid, record) { this.showShot(record) },
    showShot : function (record) {
        outerCanvas.addChild(
            isc.Img.create({
                ID: "console_screenshot",
                top : 210,
                width: 750,
                height: 716,
                showShadow:true,
                shadowOffset:10,
                shadowSoftness:5,
                src : "screenshots/" + record.src
            })
        )
        outerCanvas.addChild(
            isc.HTMLPane.create({
                ID: "console_description",
                left:120, width:400, height:210,
                contents:record.description
            })
        )
    }
});
screenshotGrid.showShot(screenshotGrid.data.get(0));

