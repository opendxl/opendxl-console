isc.Menu.create({
    ID:"sizeMenu",
    autoDraw:false,
    data:[
        {title:"Small", checkIf:"widget.width == 50",
         click:"widget.animateResize(50,50)"},
        {title:"Medium", checkIf:"widget.width == 100",
         click:"widget.animateResize(100,100)"},
        {title:"Large", checkIf:"widget.width == 200",
         click:"widget.animateResize(200,200)"}
    ],
    width:150
});


isc.Menu.create({
    ID:"moveMenu",
    autoDraw:false,
    width:150,
    data:[
        {title:"Up", click:"widget.animateMove(widget.getLeft(),widget.getTop()-20)"},
        {title:"Right", click:"widget.animateMove(widget.getLeft()+20,widget.getTop())"},
        {title:"Down", click:"widget.animateMove(widget.getLeft(),widget.getTop()+20)"},
        {title:"Left", click:"widget.animateMove(widget.getLeft()-20,widget.getTop())"}
    ]
});

isc.Menu.create({
    ID:"mainMenu",
    width:150,
    data:[
        {title:"Visible", checkIf:"widget.isVisible()",
         click:"widget.isVisible() ? widget.animateHide('fade') : widget.animateShow('fade')"
        },
        {isSeparator:true},
        {title:"Size", submenu:sizeMenu, enableIf:"widget.isVisible()"},
        {title:"Move", submenu:moveMenu, enableIf:"widget.isVisible()"},
        {isSeparator:true},
        {title:"Reset",
            click:"widget.animateRect(200,75,100,100);widget.animateShow('fade')",
            icon:"other/yinyang.gif",
            iconWidth:20,
            iconHeight:20
        }
    ]
});

isc.MenuButton.create({
    ID:"mainMenuButton",
    title:"Widget",
    width:150,
    menu:mainMenu
});


isc.Img.create({
    ID:"widget",
    left:200,
    top:75,
    width:100,
    height:100,
    src:"other/yinyang.gif",
    contextMenu: mainMenu
});
