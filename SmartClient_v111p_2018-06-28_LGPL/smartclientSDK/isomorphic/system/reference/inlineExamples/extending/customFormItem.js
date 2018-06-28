isc.ClassFactory.defineClass("YesNoMaybeItem", isc.TextItem);

// class (static) properties and methods
isc.YesNoMaybeItem.addClassProperties({
    // (just placeholders for now - these are set dynamically)
    dialog:null,
    currentEditor:null,
    
    // create the picker dialog
    makeDialog : function () {
        isc.YesNoMaybeItem.dialog = isc.Dialog.create({
            autoDraw:false,
            autoCenter:false,
            isModal:true,
            showHeader:false,
            showToolbar:false,
            autoSize: true,
            width:100,
            bodyDefaults:{layoutMargin:10, membersMargin:10},
            items:[
                isc.Button.create({title:"YES", click:"isc.YesNoMaybeItem.setValue(this.title)"}),
                isc.Button.create({title:"NO", click:"isc.YesNoMaybeItem.setValue(this.title)"}),
                isc.Button.create({title:"MAYBE", click:"isc.YesNoMaybeItem.setValue(this.title)"})
            ]
        });
    },
    // show the picker dialog at the specified position (could be smarter about this)
    showDialog : function (left, top) {
        this.dialog.moveTo(left, top);
        this.dialog.show();
    },
    // set the specified value and dismiss the picker dialog
    setValue : function (value) {
        this.currentEditor.storeValue(value, true);
        this.dialog.hide();
    }    
});

// instance properties and methods
isc.YesNoMaybeItem.addProperties({
	
    icons:[{}], // could specify a different image here

    // (this logic could alternatively go on the 'click' handler of the icon object)
    iconClick : function (form, item, icon) {
        // get global coordinates of the clicked picker icon
        var iconRect = this.getIconPageRect(icon);

        // lazily create the YesNoMaybe picker dialog the first time a yesNoMaybe editor is clicked
        if (!isc.YesNoMaybeItem.dialog) isc.YesNoMaybeItem.makeDialog();

        // remember what editor is active, so we can set its value from the picker dialog
        isc.YesNoMaybeItem.currentEditor = this;
		
        // show the picker dialog
        isc.YesNoMaybeItem.showDialog(iconRect[0],iconRect[1]);
    }	
});


// Now use the custom FormItem in an example form.  Note that the change event is fired as you'd expect
isc.DynamicForm.create({
    ID:"aForm",
    left:50, top:50,
    fields:[
        {name:"decision", title:"Decision", editorType:"YesNoMaybeItem", change: "isc.say('User selected ' + value)"}
    ]
});

