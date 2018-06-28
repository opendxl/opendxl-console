isc.DynamicForm.create({
    ID: "testForm",
    width: 500,
    fields: [
        {
            name: "multipleSelect", title: "Select items", editorType: "SelectItem",
            optionDataSource: "supplyItem",
            optionCriteria: {units:"Ream"},
            displayField: "SKU", valueField: "itemID",
            pickListWidth: 400,
            pickListFields: [
                {name: "SKU"},
                {name: "itemName"}
            ],
            multiple: true,
            pickListProperties: {

                gridComponents: [
                    isc.ToolStrip.create({
                        autoDraw:false,
                        height:30,
                        width: "100%",
                        members: [
                            isc.ToolStripButton.create({
                                width:"50%",
                                icon: "[SKIN]/actions/approve.png",
                                title: "Check All",
                                click:function() {
                                    var item = testForm.getField("multipleSelect"),
                                        fullData = item.pickList.data,
                                        cache = fullData.localData,
                                        values = [];

                                    for (var i = 0; i < cache.length; i++) {
                                        values[i] = cache[i]["itemID"];
                                    }
                                    item.setValue(values);
                                    item.pickList.hide();
                                }
                            }),
                            isc.ToolStripButton.create({
                                width:"50%",
                                icon: "[SKIN]/actions/close.png",
                                title: "Uncheck All",
                                click:function() {
                                    var item = testForm.getField("multipleSelect");
                                    item.setValue([]);
                                    item.pickList.hide();
                                }
                            })
                        ]
                    }),
                    "header","body"
                ]
            }
        }
    ]
});