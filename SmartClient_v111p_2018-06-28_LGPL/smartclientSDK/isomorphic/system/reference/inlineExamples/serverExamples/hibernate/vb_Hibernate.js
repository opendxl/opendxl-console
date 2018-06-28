isc.Canvas.create({
    ID:"outerCanvas",
    width:"100%",
    height:"100%"
});
isc.ListGrid.create({
    ID:"screenshotGrid",
    parentElement:"outerCanvas",
    width:120,
    height:100,
    showHeaderContextMenu:false,
    fields : [ { name:"screen", title:"Screenshot" } ],
    leaveScrollbarGap:false,
    data : [
        { screen:"Hibernate Browser", src: "vb_HibernateBrowser.png", description: 
          "The Hibernate Browser connects to Hibernate and allows you to browse through " +
          "your mapped entities and the data in corresponding tables.  Once you have located the " +
          "entity you wish to connect to, simply click it and then click Next; Visual Builder " +
          "will instantly create a DataSource and put you in the DataSource Editor for fine " +
          "tuning (see the other screenshot)" 
        },
        { screen:"DataSource Editor", src: "vb_HibernateDSEditor.png", description:
          "This image shows the details of the DataSource that Visual Builder created from the " +
          "entity selected on the Hibernate Browser tab.  You can change any aspect of the DataSource " +
          "here, but you don't need to: DataSources created by Visual Builder from Hibernate beans " +
          "are ready to go immediately"
        }
    ],
    recordClick : function (grid, record) { this.showShot(record) },
    showShot : function (record) {
        outerCanvas.addChild(
            isc.Img.create({
                ID: "vb_screenshot",
                top : 120,
                width: 1015,
                height: 625,
                showShadow:true,
                shadowOffset:10,
                shadowSoftness:5,
                src : "screenshots/" + record.src
            })
        )
        outerCanvas.addChild(
            isc.HTMLPane.create({
                ID: "vb_description",
                left:140, width:400, height:210,
                contents:record.description
            })
        )
    }
});
screenshotGrid.showShot(screenshotGrid.data.get(0));

