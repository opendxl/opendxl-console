isc.NavigationBar.create({
    ID : "navBar",
    width : 296,
    autoDraw : false,
    leftButtonTitle : "Employees",
    rightButtonTitle : "Action",
    showRightButton : true,
    title : "Fa Bai"
});

isc.FlowLayout.create({
    ID : "flowLayout",
    autoDraw : false,
    width : "100%",
    overflow:"visible",
    tileMargin : 5,
    tiles : [
        isc.IButton.create({
            title: "Fa Bai",
            width : 150,
            click : function () {
                navBar.setTitle(this.getTitle());
            }
        }),
        isc.IButton.create({
            title: "Abe Jacobs",
            width : 150,
            click : function () {
                navBar.setTitle(this.getTitle());
            }
        }),
        isc.IButton.create({
            title: "Izabella Chernyak F.",
            width : 150,
            click : function () {
                navBar.setTitle(this.getTitle());
            }
        }),
        isc.IButton.create({
            title: "Christine Bergeron Fewell",
            autoFit: true,           
            click : function () {
                navBar.setTitle(this.getTitle());
            }
        })
    ]
});

isc.VLayout.create({
	width : "100%",
	members : [navBar, flowLayout]
});
