// Define a new class to hold some native HTML elements which integrate intuitively
// into the page's tab order
isc.defineClass("NativeButtonToolbar", "Canvas");
isc.NativeButtonToolbar.addProperties({
    height:50,
    
    // NativeButtonToolbar.buttons: This attribute will hold an array
    // of native button configuration objects with titles for each button
    // - set this up when initializing the NativeButtonToolbar instance
//    buttons:null
    
    draw : function () {
        // We need an entry in the TabIndexManager for each of our buttons
        // Add this lazily on draw
        if (!this.registeredTabIndices) {
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                
                isc.TabIndexManager.addTarget(
                    // arbitrary identifier for the button (must be unique within the page)
                    this.getButtonElementID(button),
                    // this entry will be focusable
                    true,
                    // parent for the new entry in the TabIndexManager tree.
                    // By passing in our own ID we ensure the new buttons' entries
                    // are stored under this widget's entry in the TabIndexManager tree.
                    // This means this widget is moved to a new tab-position on the page
                    // the buttons will be moved with it.
                    this.getID(),
                    // No need for an explicit position - we are adding the buttons
                    // in the order in which they appear in the buttons array
                    null,
                    // Callback to fire if changes to the page structure cause
                    // a new numeric tab-index to be generated for the button.
                    // We can use this to update the DOM with the new value
                    {target:this, methodName:"updateButtonTabIndex"},
                    // Callback to focus in this button programmatically
                    // This method will be fired when TabIndexManager APIs to shift
                    // focus are invoked, for example when the user is tabbing through
                    // a page while the clickmask is up
                    {target:this, methodName:"focusInButton"}
                );
            }
            this.registeredTabIndices = true;
        }
        
        return this.Super("draw", arguments);
    },
    
    // Custom contents for this component: Write out native HTML button elements for
    // each of our specified "button" configurations
    getInnerHTML : function () {
        var html = "<table border=1 cellPadding=5><tr>";
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            
            html+= "<td><button type='button'" +
                    // Unique ID for the DOM element
                    " id='" + this.getButtonElementID(button) +
                    // Numeric tabIndex supplied by the TabIndexManager
                    "' tabindex=" +  
                        isc.TabIndexManager.getTabIndex(this.getButtonElementID(button))
                    + ">" +
                    button.title + 
                    "</button></td>";
        }
        html += "</tr></table>";     
        return html;
    },
    // Helper to get arbitrary unique ID for each button
    // This is used as the ID for the DOM element, and a the unique identifier for
    // the button within the TabIndexManager
    getButtonElementID : function (button) {
        return this.getID() + "_buttonElement_" + this.buttons.indexOf(button);
    },

    // Notification fired by the TabIndexManager when the numeric tabIndex for a button
    // changes due to (for example) the page being restructured
    // Use this to update the DOM element
    updateButtonTabIndex : function (buttonID) {
        if (!this.isDrawn()) return;
        // We use the buttonID as the DOM element ID, so we can simply look for the
        // appropriate element in the DOM
        var element = isc.Element.get(buttonID);
        // set the native tabIndex of the DOM element to the new numeric value
        // supplied by the TabIndexManager
        if (element != null) element.tabIndex = isc.TabIndexManager.getTabIndex(buttonID);
    },
    
    // Callback to programmatically shift focus to one of our buttons
    focusInButton : function (buttonID) {
        // Skip this if we're undrawn or masked
        if (!this.isDrawn() || isc.EH.targetIsMasked(this)) return;
        
        // We use the buttonID as the DOM element ID, so we can simply look for the
        // appropriate element in the DOM
        var element = isc.Element.get(buttonID);
        // call 'focus()' to shift native keyboard focus to the element
        if (element != null) {
            element.focus();
            return true;
        }
        return false;
    },
    // When this widget is destroyed, remove the obsolete entries from the TabIndexManager
    destroy : function () {
        for (var i = 0; i < this.buttons.length; i++) {
            isc.TabIndexManager.removeTarget(this.getButtonElementID(this.buttons[i]));
        }
        this.Super("destroy", arguments);
    }
    
});

// Demo of this custom component in standard page UI
isc.HLayout.create({
    ID:"outerLayout",
    membersMargin:10,
    height:285,
    members:[
        isc.VLayout.create({
            ID:"customTabLayout",
            autoDraw:true,
            width:250,
            isGroup:true,
            groupTitle:"Custom Tab Elements",
            defaultLayoutAlign:"center",
            layoutMargin:10,
            membersMargin:5,
            layoutTopMargin: 16,
            
            members:[
                isc.IButton.create({
                    title:"Previous SC Button",
                    width:200
                }),
                isc.NativeButtonToolbar.create({
                    buttons:[
                        {title:"Native Button 1"},
                        {title:"Native Button 2"}
                    ]
                }),
                isc.IButton.create({
                    title:"Subsequent SC Button",
                    width:200
            
                })
            ]
        }),
                    
        // Demo of this custom component embedded in a DynamicForm
        isc.DynamicForm.create({
            ID:"customTabForm",
            autoDraw:true,
            width:250,
            isGroup:true,
            groupTitle:"Custom Tab Form",
            padding:5,
            items:[
                {name:"item1"},
                {name:"item2", icons:[{},{}]},
                {name:"item3", editorType:"ButtonItem"},
                {name:"custom",
                    editorType:"CanvasItem",
                    createCanvas:function () {
                        return isc.NativeButtonToolbar.create({
                            buttons:[
                                {title:"Native Button 1"},
                                {title:"Native Button 2"}
                            ]
                        });
                    }
                },
                {name:"item4", editorType:"ButtonItem"},
                {name:"item5"}
            ]
        })
    ]
});

isc.IButton.create({
    ID: "SwitchMembersButton",
    width:150,
    title:"Switch Members",
    click:function () {
        outerLayout.reorderMember(1,0);
    }
})

isc.VLayout.create({
   membersMargin: 10,
   members: [outerLayout, SwitchMembersButton]
});