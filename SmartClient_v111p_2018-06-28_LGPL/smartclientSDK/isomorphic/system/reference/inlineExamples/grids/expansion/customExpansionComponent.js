isc.ListGrid.create({
    ID: "categoryList",
    width:"100%", height:500,
    drawAheadRatio: 4,
    dataSource: supplyCategory,
    expansionFieldImageShowSelected:true,
    autoFetchData: true,
    canExpandRecords: true,

    getExpansionComponent : function (record) {

        var countryGrid = isc.ListGrid.create({
            height: 224,
            dataSource: supplyItem,
            canEdit: true,
            modalEditing: true,
            editEvent: "click",
            listEndEditAction: "next",
            autoSaveEdits: false
        });
        countryGrid.fetchRelatedData(record, supplyCategory);

        var hLayout = isc.HLayout.create({
            align: "center",padding: 5,
            membersMargin: 10,
            members: [

                isc.IButton.create({
                    title: "Save",
                    click: function () {
                        countryGrid.saveAllEdits();
                    }
                }),
                isc.IButton.create({
                    title: "Discard",
                    click : function () {
                        countryGrid.discardAllEdits();
                    }
                }),
                isc.IButton.create({
                    title: "Close",
                    click : function () {
                        categoryList.collapseRecord(record);
                    }
                })
            ]
        });

        var layout = isc.VLayout.create({
            padding: 5,
            members: [ countryGrid, hLayout ]
        });

        return layout;
    }

});
