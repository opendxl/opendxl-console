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
        { screen:"Javabean Wizard", src: "vb_JavabeanWizard.png", description: 
          "The Javabean Wizard allows you to generate a basic DataSource definition from any " +
          "Javabean or POJO with Javabean-like semantics.  The generated DataSources are not " +
          "functional out of the box; they requires a custom DataSource implementation on the " +
          "server-side.  Once that is done, however, you typically only need to set the " +
          "<code>serverConstructor</code> property to make the generated DataSource functional."
        },
        { screen:"DataSource Editor", src: "vb_JavabeanWizard2.png", description:
          "This image shows the details of the DataSource that Visual Builder created from the " +
          "Javabean we entered on the previous screen.  You can change any aspect of the DataSource " +
          "here, but the only thing that is actually required is the <code>serverConstructor</code>."
        }
    ],
    recordClick : function (grid, record) { this.showShot(record) },
    showShot : function (record) {
        outerCanvas.addChild(
            isc.Img.create({
                ID: "vb_beanWizard1",
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
                ID: "vb_beanWizard2",
                left:140, width:500, height:210,
                contents:record.description
            })
        )
    }
});
screenshotGrid.showShot(screenshotGrid.data.get(0));
