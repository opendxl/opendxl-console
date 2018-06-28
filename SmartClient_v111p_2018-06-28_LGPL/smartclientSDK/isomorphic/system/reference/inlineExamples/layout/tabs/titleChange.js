isc.DynamicForm.create({
    ID: "profilePane",
    fields: [{
        name: "yourName", title: "Your Name", type: "text",
        change : function (form, item, value) {
            if (value) tabSet.setTabTitle(1, value+"'s Preferences");
            else tabSet.setTabTitle(1, "Preferences");
        }
    }]
});


isc.DynamicForm.create({
    ID: "preferencesPane",
    fields: [{
        name: "useISCTabs",
        title: "Use SmartClient tabs",
        type: "checkbox",
        defaultValue: true
    }]
});


isc.TabSet.create({
    ID: "tabSet",
    width: 400,
    height: 200,
    tabs: [{
        id: "profile",
        title: "Profile",
        pane: profilePane

    },{
        id: "preferences",
        title: "Preferences",
        pane: preferencesPane
    }]
});
