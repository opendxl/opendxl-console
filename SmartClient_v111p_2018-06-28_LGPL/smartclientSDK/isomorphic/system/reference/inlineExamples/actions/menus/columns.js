isc.Menu.create({
    ID:"customColumnMenu",
    autoDismiss:false,
    fields:[
        // standard title field
        "title", 
        // Special close icon field
        {name:"canDismiss", width:16, 
         showValueIconOnly:true,
         valueIcons:{
            "true":"icons/16/close.png"
         }
        }
    ],
    data:[
        {name:"Item 1"},
        {name:"Item 2", canDismiss:true},
        {name:"Item 3", canDismiss:true}
    ],
    itemClick: function (item, colNum) {
        if (colNum == 1 && item.canDismiss) {
            this.removeItem(item);
        } else {
            isc.say("You Selected '" + item.name + "'.");
            this.hide();
        }
    }
});

var menuButton = isc.MenuButton.create({
    autoDraw: false,
    title:"Show Menu",
    menu:customColumnMenu
});

isc.HStack.create({
    width: "100%",
    members: [menuButton]
});
