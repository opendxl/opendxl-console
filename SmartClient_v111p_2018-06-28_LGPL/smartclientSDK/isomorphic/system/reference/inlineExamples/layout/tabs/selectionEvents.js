isc.Label.create({
    ID:"welcomePane",
    contents:"Welcome to the application",
    width:"100%", 
    align:"center"
});

isc.TabSet.create({
    ID: "tabSet",
    width: 400,
    height: 200,
    tabs: [{
        ID: "welcome",
        title: "Welcome",
        pane: welcomePane

    },{
        ID: "preferences",
        title: "Preferences",
        tabSelected : function (tabSet, tabNum, tabPane, ID, tab) {
            isc.Log.logWarn("zero" + tabPane + " null:" + (tabPane == null));
            
            if (tabPane == null) {
                isc.DynamicForm.create({
                    ID: "preferencesPane",
                    fields: [{
                        name: "useISCTabs",
                        title: "Use SmartClient tabs",
                        type: "checkbox",
                        defaultValue: false,
                        required: true
                    }]
                });
                tabSet.updateTab(ID, preferencesPane);
            }
        },
        tabDeselected : function (tabSet, tabNum, tabPane, ID, tab, newTab) {
            if (!tabPane.getValue("useISCTabs")) {
                return false;
            }
        }
    }]
});
