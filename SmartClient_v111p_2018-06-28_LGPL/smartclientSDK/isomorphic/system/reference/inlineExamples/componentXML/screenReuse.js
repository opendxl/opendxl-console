isc.VLayout.create({
    top:5,
    width:"100%",
    height:"90%",
    membersMargin:10,
    members : [
        isc.DynamicForm.create({
            values:{dataSource:"Select A DataSource"},
            items:[
            {
                name:"dataSource", showTitle:false, editorType:"SelectItem",
                valueMap:["countryDS", "supplyItem"],
                change:function (form, item, value, oldValue) {
                    if (!this.valueMap.contains(value)) {
                        return false;
                    } else {
                     switchTo(value);
                    }
                 }
                }
            ]
        }),

        isc.TabSet.create({
            width:"100%",
            height:"*",
            ID:"tabSet"
        })
    ]
});

function switchTo(datasource){

    var tabId = "tabFor"+datasource;

    // if no tab was created for this DataSource, create one
    if (!tabSet.getTab(tabId)) {

        // create our screen
        var screen = isc.RPCManager.createScreen("screenReuse");
        
        screen.getByLocalId('saveButton').addProperties({
            click: function () {
                this.form.saveData();
            },

            form:screen.getByLocalId('editForm')
        });

        screen.getByLocalId('listGrid').setDataSource(datasource);

        screen.getByLocalId('listGrid').addProperties({
            recordClick:function (viewer, record, rowNum, field, fieldNum, value, rawValue) {
                this.form.clearErrors();
                this.form.editRecord(record);
                this.saveButton.enable();
            },
            form:screen.getByLocalId('editForm'),
            saveButton:screen.getByLocalId('saveButton'),
        });


        screen.getByLocalId('editForm').setDataSource(datasource);

        tabSet.addTab({
            title:datasource, pane:screen,
            ID:tabId
        });
        tabSet.selectTab(tabId);
    } else {
        tabSet.selectTab(tabId);
    }
}

isc.RPCManager.cacheScreens("screenReuse", function(data, rpcResponse){
    switchTo("countryDS");
});
