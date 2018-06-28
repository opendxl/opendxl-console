isc.Button.create({
    ID: "reloadComponentButton",
    title: "Reload component XML",
    width: 200,
    autoDraw: false,
    click : function () {
        if (xmlLayout != null) {
            xmlLayout.destroy();
            xmlLayout = null;
            isc.RPCManager.loadScreen("replacePlaceholder",function (screen) {
                xmlLayout = screen;
                placeholder = screen.getByLocalId('placeholder');
                container.addChild(xmlLayout);
                if (autoReplacePlaceholderDynamicForm.getValue("autoReplacePlaceholderCheckbox")) {
                    replacePlaceholderButton.click();
                }
            });
        }                
    }
});

isc.Button.create({
    ID: "replacePlaceholderButton",
    title: "Replace Placeholder",
    width: 200,
    autoDraw: false,
    click : function () {
        if (placeholder) {
            var grid = isc.ListGrid.create({
                dataSource: "supplyItem",
                autoFetchData: true,
                autoFitDateFields: true,
                width: 850,
                height: 200
            });
            xmlLayout.removeMember(placeholder);
            placeholder = null;
            xmlLayout.addMember(grid);                    
        }
    }
});

isc.DynamicForm.create({
    ID: "autoReplacePlaceholderDynamicForm",
    items: [{
        type: "checkbox",
        name: "autoReplacePlaceholderCheckbox",
        title: "Auto-replace Placeholder"
    }]
});
                
isc.VStack.create({
    members: [
        isc.HStack.create({
            membersMargin: 5,
            height: 30,
            members: [
                reloadComponentButton,
                replacePlaceholderButton,
                autoReplacePlaceholderDynamicForm
            ]
        }),
        isc.Canvas.create({
            ID: "container",
            border: "3px solid green"
        })
    ]
})

isc.RPCManager.loadScreen("replacePlaceholder",function (screen) {
    xmlLayout = screen;
    placeholder = screen.getByLocalId('placeholder');
    container.addChild(xmlLayout);
});
