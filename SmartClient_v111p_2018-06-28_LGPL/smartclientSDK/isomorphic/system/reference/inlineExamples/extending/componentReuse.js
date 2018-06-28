// Define the SimplePortlet class, extending from VLayout
// ------------------------------------------------------
isc.defineClass("SimplePortlet", "VLayout");

isc.SimplePortlet.addProperties({
    defaultWidth:250, defaultHeight:200,
    canDragResize:true, minWidth:150, minHeight:100,
    headerMargin:2, headerHeight:23,
    showEdges:true,

    // use CSS style names to allow CSS-based skinning
    styleName:"portletBackground",
    headerStyleName:"portletHeader",
    titleStyleName:"portletTitle",

    // at init, create subcomponents 
    initWidget : function () {
        this.Super("initWidget", arguments);

        // store a reference to created components in order to 
        // call methods on them later
        this.headerLabel = isc.Label.create({
            contents: this.title, wrap:false,
            styleName: this.titleStyleName,
            overflow:"hidden", width:"*",
            canDragReposition:true,
            dragTarget:this
        });

        this.header = isc.HLayout.create({
            // pass properties through to create configurability
            height:this.headerHeight,
            layoutMargin:this.headerMargin,
            styleName:this.headerStyleName,
            members : [
                this.headerLabel,
                isc.ImgButton.create({
                    // use special path prefixes to allow image skinning
                    src : "[SKIN]actions/close.png", width:18, height:18,
                    layoutAlign:"center",
                    // create interactivity by passing a reference
                    // to the creating component, so subcomponents
                    // can call methods on their creator
                    portlet: this, click:"this.portlet.hide()"
                })
            ]
        });

        // build up the layout programmatically by adding 
        // components as members 
        this.addMember(this.header);

        this.addMember(isc.HTMLFlow.create({
            contents : this.portletContents, padding: 5,
            height:"*"
        // pass a properties object through to 
        // create complete configurability
        }, this.contentProperties));

        // allow additional components to be added
        if (this.customFooter) this.addMembers(this.customFooter);
    },
    // provide dynamic updates by calling methods on subcomponents
    setHeaderTitle : function (newTitle) {
        this.headerLabel.setContents(newTitle);
    }
});

// Use the newly defined component
// --------------------------------------------------

isc.SimplePortlet.create({
    title:"Creating new components",
    portletContents:
           "This portlet is an instance of the 'SimplePortlet'" +
           " custom component created in this example<P>" +
           "To creating new, reusable SmartClient components," +
           " simply construct subcomponents at initialization."
});

isc.SimplePortlet.create({
    title:"Configurable components",
    portletContents:
          "This is also an instance of the 'SimplePortlet'" +
          " with customized appearance<P>" +
          "To make components configurable, just pass " +
          "properties through to subcomponents.",
    left:300, height:300,
    contentProperties : { padding:5, backgroundColor:"lightblue" },
    customFooter : isc.Label.create({
        contents:"Status: OK",
        height:22, padding:3,
        border:"1px solid black", backgroundColor:"#CCCCCC"
    })
});

isc.SimplePortlet.create({
    ID:"dynamicWindow",
    title:"Dynamic components",
    top:350,
    portletContents:
          "The form to the right will change the title of this " +
          "portlet by calling the custom method <code>setHeaderTitle()</code><P>" +
          "To make components dynamic, create methods " +
          "that change properties on subcomponents."
});

isc.DynamicForm.create({
    ID:"setTitleForm",
    left:260, top:350, 
    fields : [
        { name:"title", type:"text", showTitle:false, defaultValue:"[Enter new title]" },
        { type:"button", title:"Set Title",
          click:"dynamicWindow.setHeaderTitle(setTitleForm.getValue('title'))" }
    ]
});
