isc.Canvas.create({
    ID:"customTabSequence",
    height: 140,
    isGroup:true,
    margin:5,
    groupTitle:"Custom Tab Sequence",
    children:[
        isc.Button.create({
            snapTo: "TL",
            snapOffsetLeft: 10,
            snapOffsetTop: 10,
            title:"First Child",
            
            // Simple hard-coded attributes indicating
            // position in the parent.
            // We'll use these to determine desired tab order
            rowNum:0, colNum:0
    
        }),
        isc.Button.create({
            snapTo: "BL",
            snapOffsetLeft: 10,
            snapOffsetTop: -10,
            title:"Second Child",
            rowNum:1, colNum:0
    
        }),
        isc.Button.create({
            snapTo: "TR",
            snapOffsetLeft: -10,
            snapOffsetTop: 10,
            title:"Third Child",
            rowNum:0, colNum:1
    
        }),
        isc.Button.create({
            snapTo: "BR",
            snapOffsetLeft: -10,
            snapOffsetTop: -10,
            title:"Fourth Child",
            rowNum:1, colNum:1 
               
        })
    ],

    // Default tab behavior is to move through children in child-order
    // Override this to support tabbing through them either vertically (in columns)
    // or horizontally (in rows)

    // Use an arbitrary attribute ("tabDirection") to track which direction we're moving
    tabDirection:"vertical",

    // This method will modify the tab positions of each child button to set up
    // the desired tab sequence
    updateTabDirection : function (tabDirection) {
        if (this.tabDirection == tabDirection) return;
        this.tabDirection = tabDirection;
        
        var vertical = (this.tabDirection == "vertical");
        for (var i = 0; i < this.children.length; i++) {
            // Order the buttons based on their row and column positions
            // We hardcoded these values into the buttons in this sample.
            var relativeTabPosition,
                rowNum = this.children[i].rowNum,
                colNum = this.children[i].colNum;
            if (vertical) {
                relativeTabPosition = rowNum + 2*colNum
            } else {
                relativeTabPosition = colNum + 2*rowNum;
            }
            this.children[i].setRelativeTabPosition(relativeTabPosition);
    
        }
    }
});

isc.DynamicForm.create({
    colWidths:["*","*"],
    ID:"directionForm",
    items:[
        {name:"direction", editorType:"SelectItem",
         title:"Select Tab Direction",
         wrapTitle: false,
         valueMap:{
            vertical:"Vertical", 
            horizontal:"Horizontal"
         },
         defaultValue:"vertical",
         changed:function (form,item,value) {
            // Invoke the 'updateChildTabPositions()' method directly to rearrange the
            // children
            customTabSequence.updateTabDirection(value);
    
         }
        }
    ]
});

isc.VLayout.create({
     width: 320,
     members: [directionForm, customTabSequence]
})