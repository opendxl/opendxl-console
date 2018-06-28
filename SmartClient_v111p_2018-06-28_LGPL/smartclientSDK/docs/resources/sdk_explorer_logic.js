// SmartClient SDK Explorer logic
// Copyright 2005 Isomorphic Software, Inc.



//===================================================================
// openSDKResource()
//===================================================================
// Open various types of SDK resources:
// - internal (SmartClient) windows
// - external (browser) windows
// - email links
// - executable code
//===================================================================

function openSDKResource(node, resource) {
    // if running in client-only mode and this resource requires the server, abort
    if (isc.clientOnly && node.needServer) return;
    if (resource && resource.resourceDisabled) return;

    // internal window, already handled by icons but not in the TreeGrid
    if (node.loadHTML || node.loadPage) {
        window["sdk_window_"+node.id].show();

    // external window link
    } else if (node.link) {
        // TODO could name browser windows for reuse (eg isc_examples, isc_docs...)
        var new_win;
        var link = node.link;
        if (node.noSCServerLink && !isc.hasOptionalModule("SCServer")) link = node.noSCServerLink;

        if (link.startsWith("/") || 
            link.startsWith("http://")) {
                new_win = window.open(link);
        // links are assumed to be relative to webroot
        } else new_win = window.open("../../"+link);

        // When IE blocks the pop-up, window.open() returns null.
        if (new_win != null) {
            new_win.focus();
        }

    // email link
    } else if (node.email) {
        window.location.href = "mailto:" + node.email;

    // script to execute
    } else if (node.exec) {
        eval(node.exec)
    }
}



//===================================================================
// SDKIcon class
//===================================================================
// - icon implementation specific to this SDK explorer
// - VStack containing Img and Label members
// - assumes a 'node' property pointing to a SmartClient SDK resource
// - adapts to isc.clientOnly mode (disabled images, links, click actions)
// - implements label and click behaviors for various SDK resource properties
//===================================================================

isc.ClassFactory.defineClass("SDKIcon", VStack);

isc.SDKIcon.addProperties({
    width:75,
    height:10, // will overflow
    membersMargin:2,
    iconSrc:"other/document.png",
    iconSize:40,
    title:"untitled",
    titleStyle:"iconTitle",
    rootPath: "../../"
});

isc.SDKIcon.addMethods({

initWidget: function () {
    this.Super("initWidget", arguments);

    if (this.node.iconSrc) this.iconSrc = this.node.iconSrc;

    // generate JS, XML, DS sourceviewer links to append to title
    // in client-only mode, display the JS/XML/DS text in disabled style and w/o links
    // (the source viewer is server based, so even client-only examples will have source
    // links disabled in this mode)
    // NOTE: the HTML for these links is generated and saved separately from the title for this
    //  resource, so underline styling can be applied to just the title on rollover
    var sourceLinksHTML = "",
        sourceViewURL = "/isomorphic/Source.Viewer?file=",
        hasRequiredModules = isc.hasOptionalModules(this.node.requiresModules),
        hasSCServer = isc.hasOptionalModule("SCServer")
    ;
    
    // if running in client-only mode and this resource requires the server,
    // set disabled icon, style, and description
    if (isc.clientOnly && this.node.needServer ) {
        this.resourceDisabled = true;
        this.cursor = "arrow";
        this.iconSrc = isc.Img.urlForState(this.iconSrc, null, null, "disabled");
        this.titleStyle = this.titleStyle + "Disabled";
        var description = this.node.disabledDescription ? this.node.disabledDescription : this.node.description;
        this.node.description = Canvas.imgHTML('warning.png',16,16,null,'align=absmiddle') +
                                "&nbsp;&nbsp;<b>Disabled (Needs server)</b><br><br>" + description;
    } else if (!hasRequiredModules) {
        this.resourceDisabled = true;
        this.cursor = "arrow";
        this.iconSrc = isc.Img.urlForState(this.iconSrc, null, null, "disabled");
        this.titleStyle = this.titleStyle + "Disabled";
        var missingModules = isc.getMissingModules(this.node.requiresModules).getProperty("name").join(", ");
        var description = this.node.disabledDescription ? this.node.disabledDescription : this.node.description;
        this.node.description = Canvas.imgHTML('warning.png',16,16,null,'align=absmiddle') +
                                "&nbsp;&nbsp;<b>Disabled (Requires: "+missingModules+")</b><br><br>" + description;
    } else if (this.node.needXML && !isc.XMLTools.nativeXMLAvailable()) {
        this.resourceDisabled = true;
        this.cursor = "arrow";
        this.iconSrc = isc.Img.urlForState(this.iconSrc, null, null, "disabled");
        this.titleStyle = this.titleStyle + "Disabled";
        var description = this.node.disabledDescription ? this.node.disabledDescription : this.node.description;
        this.node.description = Canvas.imgHTML('warning.png',16,16,null,'align=absmiddle') +
                                "&nbsp;&nbsp;<b>Disabled (requires Safari 3.0+)</b><br><br>" +
                                description;
    } else {
        this.cursor = "hand";
    }
    if (hasRequiredModules && !this.resourceDisabled) {
        if (this.node.jssrc || this.node.xmlsrc || this.node.codesrc) sourceLinksHTML += "<br><br>";
        if (this.node.jssrc) { // view JS code
            sourceLinksHTML += (isc.clientOnly) ? "<span class=iconTitleDisabled>JS</span>" :
                "<a target='_blank' href='" + sourceViewURL + this.rootPath + this.node.jssrc + "'>JS</a>";
            if (this.node.xmlsrc || this.node.dssrc) {sourceLinksHTML += "&nbsp;&nbsp;";}
        }
        if (this.node.xmlsrc && hasSCServer) { // view XML code
            sourceLinksHTML += (isc.clientOnly) ? "<span class=iconTitleDisabled>XML</span>" :
                "<a target='_blank' href='" + sourceViewURL + this.rootPath + this.node.xmlsrc + "'>XML</a>";
            if (this.node.dssrc) {sourceLinksHTML += "&nbsp;&nbsp;";}
        }
        if (this.node.dssrc && hasSCServer) { // view DataSource descriptors
            sourceLinksHTML += (isc.clientOnly) ? "<span class=iconTitleDisabled>DS</span>" :
                "<a target='_blank' href='" + sourceViewURL + this.rootPath + this.node.dssrc + "'>DS</a>";
        }
        if (this.node.codesrc && !this.node.noSCServerLink) { // view any code
            sourceLinksHTML += (isc.clientOnly) ? "<span class=iconTitleDisabled>view source</span>" :
                "<a target='_blank' href='" + sourceViewURL + this.rootPath + this.node.codesrc + "'>view source</a>";
        }
    }
    this.sourceLinksHTML = sourceLinksHTML;


    // create Img and Label members (except for the 'node' references, this is generic icon code)
    this._iconImage = isc.Img.create({
        ID:this.getID()+"_"+"image",
        width:this.node.iconWidth || this.iconSize,
        height:this.node.iconHeight || this.iconSize,
        layoutAlign:"center",
        imgDir:this.imgDir,
        skinImgDir:this.skinImgDir,
        src:this.iconSrc,
        cursor:this.resourceDisabled ? "arrow" : "hand"
    });
    this._iconLabel = isc.Label.create({
        ID:this.getID()+"_"+"label",
        width:this.width,
        height:10, // will overflow
        layoutAlign:"center",
        align:"center",
        className:this.titleStyle,
        contents:this.node.title + this.sourceLinksHTML,
        cursor:this.resourceDisabled ? "arrow" : "hand"
    });
    this.addMembers([this._iconImage, this._iconLabel]);

}, // end initWidget()

// click an SDKIcon to open an SDK resource, treating SmartClient windows as a special case
click: function () {
    isc.Hover.clear();
    if (this.window) {
        var node = this.node;
        if (node) {
            // if running in client-only mode and this resource requires the server, abort
            if (isc.clientOnly && node.needServer) return;
            if (this.resourceDisabled) return;            
        }
        this.window.bringToFront();
        if (!this.window.isDrawn() || !this.window.isVisible()) {
            // show open state of icon if available
            if (this.node.openIconSrc) this._iconImage.setSrc(this.node.openIconSrc);
            // animate window open from icon image
            this.window.animateOpen(this._iconImage.getPageRect());
        } else {
            this.window.flash();
        }
    } else {
        // hand off to a function that opens different types of resources
        openSDKResource(this.node, this);
    }
},

// rollover underlines title; hover shows full descriptions
mouseOver: function () {
    isc.Hover.setAction(this, this.showDescription);
    // The hackery below is necessary because text-decoration:none will not remove
    // underlining for parts of a text-decoration:underline styled element. We do not want
    // to underline the space between source links, and we do not want to underline the source
    // link text when these links are disabled (eg for the Hello World example in client-only mode.)
    // So we apply underline styling just to the title text.
    if (!this.resourceDisabled) this._iconLabel.setContents(
        "<span style='text-decoration:underline'>" + this.node.title + "</span>" +
        this.sourceLinksHTML
    );
},
mouseOut: function () {
    isc.Hover.clear();
    if (!this.resourceDisabled) this._iconLabel.setContents(this.node.title + this.sourceLinksHTML);
},
showDescription: function () {
    isc.Hover.show(this.node.description, {backgroundColor:"#FFFFD0", width:300, height:10});
}

}); // end SDKIcon.addMethods



//===================================================================
//  GENERATE WINDOWS & ICONS FROM RESOURCE TREE
//  (manages icon layout as well)
//===================================================================


// NB: must call makeWindowsFromTree() with a node that has children
function makeWindowsFromTree (tree, node, namespace, windowPos, windowProps, iconProps) {

    var children = tree.getChildren(node),
        numChildren = children.length,
        childIcons = [],
        windowOffset = 80;

    // 1. create icons and windows for children of the passed node
    for (var i=0; i<numChildren; i++) {
        var currChild = children[i],
            childWindow = null; // leaf nodes will not create a window

        // 1a. if this child has children, recursively create their windows and icons
        //     (makeWindowsFromTree also creates and returns the window for this child)
        if (tree.hasChildren(currChild)) {
            childWindow = makeWindowsFromTree(
                tree, currChild, namespace,
                {left:windowPos.left+windowOffset, top:windowPos.top+windowOffset},
                windowProps, iconProps
            );
            windowOffset += 80;
        }
        
        // 1b. if this child loads HTML content or pages, create its window now
        if (currChild.loadHTML || currChild.loadPage) {
            childWindow = isc.SDKWindow.create(windowProps, {
                ID:(namespace ? namespace+"_" : "") + "window_" + currChild.id,
                title:currChild.title,
                headerIconProperties:{src:currChild.windowIconSrc || currChild.iconSrc},
                top:50, left:50, width:550, height:500,
                canDragResize:true,
                showMinimizeButton:false,
                dragAppearance:"outline",
                autoSize:false,
                visibility:"hidden",
                // loadHTML - use inline HTML loader
                items:  currChild.loadHTML ? [isc.HTMLPane.create({contentsURL:currChild.loadHTML})] :
                // loadPage - use external page loader
                        currChild.loadPage ? [isc.Canvas.create({contentsURL:"../../"+currChild.loadPage, contentsType:"page", overflow:"auto"})] :
                        null
            });
            isc.SimpleWindowManager.addWindow(childWindow, currChild.predraw); // see below
        }

        // 1c. create the icon for this child
        childIcons[i] = isc.SDKIcon.create({
            ID:(namespace ? namespace+"_" : "") + "icon_" + currChild.id,
            node:currChild, // backref so icon instance can access node properties later
            window:childWindow
        }, iconProps);

        // save a reference from window to icon (can use this to change the state of the icon, and
        // animate a wireframe from window to icon, when the window is closed)
        if (childWindow) childWindow.openFromIcon = childIcons[i];
    }

    // 2. simple icon layout - create an HStack for every n children (3 for now)
    var rowCount = Math.ceil(numChildren/3),  // number of rows required
        stragglerCount = numChildren%3,       // number of icons in last row
        iconRows = [];
    // create each row as an hstack
    for (var i=0; i<rowCount; i++) {
        iconRows[i] = isc.HStack.create({
            layoutMargin:25,
            membersMargin:40,
            members:childIcons.getRange(
                i*3,
                // check for last row
                (i==rowCount && stragglerCount!=0) ? i*3+stragglerCount : i*3+3
            )
        });
    }

    // 3. create and return the window for the passed node
    var newWindow = isc.SDKWindow.create(windowProps, {
        ID:(namespace ? namespace+"_" : "") + "window_" + node.id,
        // windows are only moved to their assigned positions when opened
        _storedLeft:windowPos.left,
        _storedTop:windowPos.top,
        title:node.title,
        visibility:"hidden",
        headerIconProperties:{src:node.windowIconSrc || node.iconSrc},
        items:iconRows,
        icons:iconRows // so we can hide icons and show an alternate presentation (eg tree)
    });
    isc.SimpleWindowManager.addWindow(newWindow, node.predraw); // see below
    return newWindow;

} // end makeWindowsFromTree()



//===================================================================
//  PROCESS RESOURCE TREE
//  When running in clientOnly mode, set enabled:false on nodes that
//  needServer. The TreeGrid and Menu views of this tree will disable
//  the nodes (appearance and interactivity) accordingly.
//  Also set the icon property for use in these views.
//===================================================================

// assumes we start with a root node that cannot be disabled
function processResourceTree (tree, node) {
    var children = tree.getChildren(node),
        numChildren = children.length;
    for (var i=0; i<numChildren; i++) {
        var childNode = children[i];
        if (childNode.needServer && isc.clientOnly) childNode.enabled = false;
        if (!isc.hasOptionalModules(childNode.requiresModules)) childNode.enabled = false;
        childNode.icon = childNode.windowIconSrc || childNode.iconSrc;
        if (tree.isFolder(childNode)) processResourceTree(tree,childNode);
    }
}


//===================================================================
//  WINDOW STATE GETTER/SETTER
//===================================================================

isc.ClassFactory.defineClass("SDKWindow", Window).addProperties({
    placement:"nearOrigin",
    showMinimizeButton: false,                                         
    getSaveState : function () {
        var visible = this.isDrawn() && this.isVisible();
        return {
            ID:this.getID(),
            v:visible,
            // save off stored coordinates instead if hidden, since hidden windows are moved to
            // 0,0
            l:visible ? this.getLeft() : this._storedLeft || 0,
            t:visible ? this.getTop() : this._storedTop || 0,
            z:this.getZIndex(),
            m:this.minimized
        }
    },
    setSaveState : function (saveState) {
        // mark window with stored coordinates to use when it is opened
        this._storedLeft = saveState.l;
        this._storedTop = saveState.t;

        if (saveState.v) { // visible
            this.moveTo(saveState.l,saveState.t);
            this.showingDelayed = true;
            this.delayCall("show");
        } else {
            this.hide();
        }
        if (saveState.m) { // minimized
            if (this.isDrawn() && !this.minimized) this.minimize();
        } else {
            if (this.isDrawn() && this.minimized==true) this.restore();
        }
    }
});


//===================================================================
//  SIMPLE WINDOW MANAGER
//===================================================================
// Define a simple window manager that keeps track of all windows in this application
// and allows us to easily:
//      - open/close all windows
//      - save/restore all window states
// Exercises for the curious reader:
//      - arrange, tile, cascade
//      - open just one window
//      - close all but one window
//      - lazy creation of windows, with save & restore support

isc.ClassFactory.defineClass("SimpleWindowManager");

isc.SimpleWindowManager.addClassProperties({
    allWindows:[],
    predrawWinList:[],
    predrawWinNum:0
});

isc.SimpleWindowManager.addClassMethods({
    addWindow : function (windowRef, predraw) {
        this.allWindows[this.allWindows.length] = windowRef;
        if (predraw) {
            this.predrawWinList[this.predrawWinList.length] = windowRef;
        }
    },
    predrawWindows : function () {
        var predrawCount = this.predrawWinList.length;
        if (predrawCount == 0) return;
        this.predrawWinNum = predrawCount - 1;
        this.queuePredraws();
    },
    queuePredraws : function () {
        if (!this.showingDelayed) this.delayCall("predrawWindow");
    },
    predrawWindow : function () {
        // don't start a predraw in the middle of an animation
        if (isc.Animation.isActive()) return this.queuePredraws();
        var win = this.predrawWinList[this.predrawWinNum];
        if (!win.isDrawn()) win.draw();
        if (this.predrawWinNum > 0) {
            this.predrawWinNum--;
            this.queuePredraws();
        }
    },
    openAllWindows : function () {
        for (var i=0; i < this.allWindows.length; i++) this.allWindows[i].show();
    },
    closeAllWindows : function () {
        for (var i=0; i < this.allWindows.length; i++) this.allWindows[i].hide();
    },
    // TODO: breadth-first traversal of source tree to get the best cascade order
    // (currently mixed up due to depth-first recursive generation of windows)
    cascadeAllWindows : function () {
        var nextLeft = 50,
            nextTop = 70;
        // first cascade and layer all visible windows (reverse due to generator recursion)
        for (var i=this.allWindows.length; i > 0; i--) {
            var currWindow = this.allWindows[i-1];
            if (currWindow.isVisible()) {
                currWindow.moveTo(nextLeft, nextTop);
                currWindow.bringToFront();
                nextLeft += 30;
                nextTop += 45;
            }
        }
        // then cascade all hidden windows
        for (var i=this.allWindows.length; i > 0; i--) {
            var currWindow = this.allWindows[i-1];
            if (!currWindow.isVisible()) {
                currWindow.moveTo(nextLeft, nextTop);
                nextLeft += 30;
                nextTop += 45;
            }
        }
    },
    getAllWindowStates : function () {
        var saveStates = [];
        for (var i=0; i < this.allWindows.length; i++) {
            saveStates[i] = this.allWindows[i].getSaveState();
        }
        // sort by layer now, so windows will be recreated in this order
        saveStates.sortByProperty("z", Array.ASCENDING);
        return isc.Comm.serialize(saveStates);
    },
    setAllWindowStates : function (stateString) {
        if (!stateString) return null;
        var fn = new Function("return " + stateString);
        var savedStates = fn();
        for (var i=0; i < savedStates.length; i++) {
            var thisWin = window[savedStates[i].ID];
            if (thisWin) thisWin.setSaveState(savedStates[i]);
        }
    }
});


//===================================================================
//  WINDOW CONTROL EXTENSIONS
//===================================================================
// Repurpose the maximize button to switch between tree and window views.
// This button is enabled only on the topmost window.
isc.SDKWindow.addProperties({
    maximizeWidth: 800,
    maximizeHeight: 500,
    onMaximizeClick: function () {
        viewInTree();
        this.maximized = true;
        if (this.maximizeButton) {
            this.maximizeButton.addProperties(this.restoreButtonDefaults);
            this.maximizeButton.markForRedraw();
        }
        return false;
    },
    onRestoreClick: function () {
        viewInWindows();
        this.maximized = false;
        if (this.maximizeButton) {
            this.maximizeButton.addProperties(this.maximizeButtonDefaults);
            this.maximizeButton.markForRedraw();
        }
        return false;
    }
})


//===================================================================
//  WINDOW ANIMATION
//===================================================================

isc.Wireframe = isc.Canvas.create({
    ID:"isc_wireframe",
    border:"2px solid #8289A6",
    autoDraw:false
})

isc.SDKWindow.addProperties({
    animateOpenDuration:300,
    animateClosedDuration:200,
    animateMinimize:true,
    animateMinimizeTime:1000
})

isc.SDKWindow.addMethods({
    // Window.js FIXME - was overriding hide here, but window calls hide twice
    // (will still want to override closeClick, since hide is called when restoring window states)
    closeClick : function () {
        this.hide();
        var fromRect = this.getPageRect();
        // store coordinates, and keep windows at 0,0 until re-opened
        this._storedLeft = this.getLeft();
        this._storedTop = this.getTop();
        this.moveTo(0,0);
        this.animateClosed(this.openFromIcon._iconImage.getPageRect(), fromRect);
    },

    animateClosed: function (toRect, fromRect, duration) {
        // initialize the wireframe to the current window rect
        isc.Wireframe.setRect(fromRect);
        isc.Wireframe.show();
        isc.Wireframe.bringToFront();
        // animate the wireframe to the specified rect
        isc.Wireframe.animateRect(
            toRect[0], toRect[1], toRect[2], toRect[3],
            // TODO move this to a function that also calls an animateClosedDone handler
            //  (which is where the icon setSrc should go)
            "isc.Wireframe.hide();" +
                this.openFromIcon._iconImage.getID() + ".setSrc('"+this.openFromIcon.iconSrc+"');",
            duration || this.animateClosedDuration
        );
    },
    
    animateOpen: function (fromRect, toRect, duration) {
        var win = this,
            toLeft, toTop, toWidth, toHeight;
        if (toRect) { // destination rect was passed to this function
            toLeft = toRect[0];
            toTop = toRect[1];
            toWidth = toRect[2];
            toHeight = toRect[3];
        } else { // destination rect is the rect of the window
            // grab stored coordinates if any
            toLeft = this._storedLeft || this.getLeft();
            toTop = this._storedTop || this.getTop();
            if (!this.isDrawn()) { // draw offscreen to determine width and height
                this.moveTo(-10000,-10000);
                this.show();
            }
            toWidth = this.getVisibleWidth();
            toHeight = this.getVisibleHeight();
        }
        // initialize the wireframe at fromRect
        isc.Wireframe.setRect(fromRect);
        isc.Wireframe.show();
        isc.Wireframe.bringToFront();
        // animate the wireframe to the final position/size of the window
        isc.Wireframe.animateRect(
            toLeft, toTop, toWidth, toHeight,
            // then hide wireframe and show window
            // TODO move this code to a function that also calls an animateOpenDone handler
            function () {
                isc.Wireframe.hide(); 
                win.moveTo(toLeft,toTop);
                
                win.delayCall("show");
            },
            duration || this.animateOpenDuration
        );
    }
})

        



