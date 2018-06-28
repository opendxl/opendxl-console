isc.HLayout.create({
    width: "100%",
    membersMargin: 20,
    height: 250, 
    members: [
        isc.ListGrid.create({
            ID: "listGrid",
            autoDraw: false,
            width:700, 
            alternateRecordStyles:true,
            dataPageSize: 250,
            fields:[
                {name:"itemName", title:"Name"},
                {name:"SKU", title:"SKU"},
                {name:"category", title:"Category", autoFitWidth:true},
                {name:"unitCost", title:"Unit Cost", autoFitWidth:true, autoFitWidthApproach:"both"},
                {name:"description", title:"Description", minWidth:47, maxWidth:270, autoFitWidth:true}
            ],
            dataSource: supplyItem,
            autoFetchData: false
        }),
        isc.VLayout.create({
            membersMargin: 15,
            members: [
                isc.Button.create({
                    autoDraw: false,
                    width: 160,
                    title: "All Short Descriptions",
                    click : function () {
                        listGrid.resizeField(0, 300);
                        listGrid.setData(resultSet.findAll('SKU',['4044000','5935000','5753100','5617200','10328400']));
                    }
                }),
                isc.Button.create({
                    autoDraw: false,
                    width: 160,
                    title: "One Long Description",
                    click : function () {
                        listGrid.resizeField(0, 180);
                        listGrid.setData(resultSet.findAll('SKU',['4044000','5935000','5753100','5617200','10193600']));
                    }
                }),
                isc.Button.create({
                    autoDraw: false,
                    width: 160,
                    title: "All Blank Descriptions",
                    click : function () {
                        listGrid.resizeField(0, 340);
                        listGrid.setData(resultSet.findAll('SKU',['45300','135900','951300','1089400','1090500']));
                    }
                })
            ]
        })
    ]
});
var resultSet = [];
listGrid.fetchData({}, function (dsRequest, data, dsResponse) {
    resultSet = data;
});
