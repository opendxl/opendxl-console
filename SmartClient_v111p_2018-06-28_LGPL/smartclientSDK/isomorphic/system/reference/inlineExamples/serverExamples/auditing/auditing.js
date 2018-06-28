
isc.VLayout.create({
    ID:"tstLayout",
    width:"100%",
    height:"100%",
    members : [
        isc.ListGrid.create({
                dataSource:"supplyItemAudited",
                width:"100%",
                height:250,
                autoFetchData:true,
                canEdit:true,
                canRemoveRecords:true,
                ID:"auditedList",

                recordClick : function(viewer, record) {
                    if (auditForm.getField("auditFor").getValue() != "Selected Record") {
                        auditForm.getField("auditFor").setValue("Selected Record");
                    }

                    auditList.fetchData({itemID:record.itemID});
                },

                removeRecordClick : function() {
                    this.removeSelectedData(function() {
                        if (auditForm.getField("auditFor").getValue() == "Selected Record") {
                            auditForm.getField("auditFor").setValue("All Records");
                            auditList.clearCriteria();
                        } else {
                            auditList.invalidateCache();
                        }
                    });
                },

                editComplete : function() {
                    auditList.invalidateCache();
                }
            }),

            isc.Label.create({
                contents: "Browse Audit Data",
                width: "100%",
                height: 25,
                autoDraw: true,
                baseStyle: "exampleSeparator"
            }),

            isc.DynamicForm.create({
                titleWidth: "140",
                ID:"auditForm",
                fields: [{
                    title: "Show Audit Trail for",
                    name:"auditFor",
                    defaultValue: "Selected Record",
                    type:"radioGroup",
                    vertical:false,
                    valueMap: [
                        "Selected Record",
                        "All Records"
                    ],

                    changed : function(form, item, value) {
                        if (value == "All Records") {
                            auditList.clearCriteria();
                        } else {
                            var record = auditedList.getSelectedRecord();
                            if (record != null) {
                                auditList.fetchData({itemID:record.itemID});
                            } else {
                                auditList.fetchData({itemID:-1});
                            }
                        }
                    }
                }
                ]
            }),

            isc.ListGrid.create({
                ID:"auditList",
                width:"100%",
                wrapHeaderTitles: true,
                height:200,
                sortField:"audit_revision",
                sortDirection:"descending",
                autoFetchData:false,
                showFilterEditor:true,
            })
    ]
});


isc.DataSource.load("audit_supplyItemAudited", function() {

    auditList.setDataSource("audit_supplyItemAudited");
});


