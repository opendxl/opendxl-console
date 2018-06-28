
//===========================================================================
// PORTLET LIST
//===========================================================================

isc.ListGrid.create({
    ID: "portletList",
    autoDraw: false,
    height: 20,
    width: 120,
    
    // autosize to fit the list, instead of scrolling
    overflow: "visible",
    bodyOverflow: "visible",
    leaveScrollbarGap: false,
    
    // hide the column headers
    showHeader:false,
    
    // disable normal row selection behaviors
    selectionType: "none",
    
    fields: [ {name:"portletName", formatCellValue:"return grid.gViewIconHTML + ' ' + value"} ],
    
    gViewIconHTML: isc.Canvas.imgHTML("[SKIN]actions/view.png"),
    // global for convenient single setting of multiple animation times in this example
    // default 750
    animatePortletTime: 750,
    
    // fake portlet list for self-contained example
    // The real list could be included inline, or loaded on the fly from the server.
    // This data can include whatever attributes you want to use for these portlet,
    // e.g. feed URLs, icons, update frequency...
    data: [
        {portletName:"Portlet 1"},
        {portletName:"Portlet 2"},
        {portletName:"Portlet 3"},
        {portletName:"Portlet 4"},
        {portletName:"Portlet 5"},
        {portletName:"Portlet 6"},
        {portletName:"Portlet 7"},
        {portletName:"Portlet 8"},
        {portletName:"Portlet 9"},
        {portletName:"Portlet 10"}
    ],

    
    //------------------------------------------------------------
    // OPEN PORTLET logic -
    //  Called whenever you click on an enabled row in this list.
    //------------------------------------------------------------
    rowClick: function (record, rowNum) {
        // disable the row -- this will prevent subsequent clicks, and will also change the
        //  row style, to indicate that this portlet is already in the viewing area
        record.enabled = false;
        this.refreshRow(rowNum);
        
        // create a new portlet
        var newPortlet = isc.Portlet.create({
            title: record.portletName,
            showShadow:false,            
            // enable predefined component animation
            animateMinimize:true,            
            // Window is draggable with "outline" appearance by default.
            // "target" is the solid appearance.
            dragAppearance:"outline",
            // customize the appearance and order of the controls in the window header
            // (could do this in load_skin.js instead)
            headerControls:["headerIcon", "headerLabel", "minimizeButton", "closeButton"],
            // show either a shadow, or translucency, when dragging a portlet
            // (could do both at the same time, but these are not visually compatible effects)
            dragOpacity:30,                
            // these settings enable the portlet to autosize its height only to fit its contents
            // (since width is determined from the containing layout, not the portlet contents)
            height:145,
            overflow:"visible",
            bodyProperties:{overflow:"visible"},
            items:[
                // simple fake portlet contents - could put anything here
                isc.Label.create({
                    autoDraw:false, align:"center", layoutAlign:"center",
                    contents: record.portletName+" contents"
                })
            ],
            portletRecord: record,
            portletList: this,
            // callback to the portletList when this portlet is closed (see closePortlet below)
            closeClick: function () {this.portletList.closePortlet(this, this.portletRecord)}
        });
        // insert the portlet in the content area, but keep it hidden for now
        newPortlet.hide();
        var fewestPortlets = 999999,
            fewestPortletsColumn;
        // find the column with the fewest portlets
        var portletArray = portalContentArea.getPortletArray();
        for (var i=0; i < portletArray.length; i++) {
            var numPortlets = portletArray[i].length;
            if (numPortlets < fewestPortlets) {
                fewestPortlets = numPortlets;
                fewestPortletsColumn = i;
            }
        }
        portalContentArea.addPortlet(newPortlet, fewestPortletsColumn);

        // create an outline around the clicked row
        var outline = isc.Canvas.create({ 
            left:this.getPageLeft(), top:this.getRowPageTop(rowNum),
            width:this.getVisibleWidth(), height:this.getRowSize(rowNum),
            border:"2px solid #8289A6"
        });
        outline.bringToFront();
        // animate the outline from the clicked row, to the desired position of the new portlet
        // (this will execute in parallel with the placeHolder animation)
        outline.animateRect(
            newPortlet.getPageLeft(), newPortlet.getPageTop(),
            portalContentArea.getColumnWidth(fewestPortletsColumn), newPortlet.getVisibleHeight(),
            function () {
                // callback at end of animation - destroy placeholder and outline; show the new portlet 
                outline.destroy();
                newPortlet.body.hPolicy = "fill";
                newPortlet.show();
            },
            this.animatePortletTime
        );
        
    },
    
    //------------------------------------------------------------
    // CLOSE PORTLET logic -
    //  Called when you click the close control in the top-right
    //  corner of a portlet (see closeClick above).
    //------------------------------------------------------------
    closePortlet: function (portlet, portletRecord) {
        var rowNum = portletList.data.indexOf(portletRecord);

        // create an outline around the portlet
        var outline = isc.Canvas.create({autoDraw:false, border:"2px solid #8289A6"});
        outline.setRect(portlet.getPageRect());
        outline.bringToFront();

        portlet.hide();

        // simultaneously animate the portlet outline down to the row in this portletList
        outline.draw();
        outline.animateRect(
            this.getPageLeft(),
            this.getRowPageTop(rowNum),
            this.getVisibleWidth(),
            this.getRowSize(rowNum),
            function () {
            // callback at end of animation - destroy outline and portlet;
            // also enable and refresh the row in the portletList so it does not show the special
            // style (and so it can be clicked again)
                outline.destroy();
                portlet.destroy();
                portletRecord.enabled = true;
                portletList.refreshRow(rowNum);
            },
            this.animatePortletTime
        );
    }
});

//===========================================================================
// PAGE LAYOUT
//===========================================================================

isc.HLayout.create({ 
    ID: "portalExamplePage",
    width: "100%",
    height: "100%",
    layoutMargin: 10,
    membersMargin: 10,
    members: [
        portletList,
        isc.PortalLayout.create({
            ID: "portalContentArea",
            overflow: "visible",
            columnOverflow: "visible",
            preventColumnUnderflow: false,
            numColumns: 3,
            showColumnMenus: true,
            columnBorder: "0"
        })
    ]
});

