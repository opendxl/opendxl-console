
isc.MenuPalette.create({
    ID:"menuPalette",
    dragType: "Portlet", 
    animateFadeTime: 250,
    showAnimationEffect: "slide",
    dragStart : function () {
        var start = this.Super("dragStart", arguments);
        if (start) {
            this.animateHide("fade", "isc.Menu.hideAllMenus()");
        }
        return start;
    },
    items: [{
        title:"Drag items out to create portlets", 
        disabled:true
    },{
        isSeparator:true
    }].concat(samplePortlets)
});

isc.Window.create({
    ID: "portalWindow", 
    autoDraw:false, 
    title: "Sales Portal",
	
    // add a menu button to the header	
    headerControls: [
        "headerIcon", "headerLabel", 
        isc.MenuButton.create({
            title: "Add Content",
            menu: menuPalette
        })
    ],
    
    items : [
        isc.PortalLayout.create({
            numColumns: 2
        })
    ]
});

isc.VLayout.create({
	width: "100%",
	height: "100%",
    layoutMargin:10,
    members: [ portalWindow ]
})

