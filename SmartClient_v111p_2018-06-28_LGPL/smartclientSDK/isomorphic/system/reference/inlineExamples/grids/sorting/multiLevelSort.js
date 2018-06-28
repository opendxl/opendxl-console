isc.Button.create({
    ID: "button",
    title: "Multilevel Sort",
    autoFit: true,
    click: function () {
        isc.logWarn(isc.echoAll(supplyList.getSort()));
        supplyList.askForSort();
    }
});

isc.ListGrid.create({
    ID: "supplyList",
    width:900, height:300, 
    alternateRecordStyles:true,
    dataSource: supplyItem,
    autoFetchData: true
});

isc.VStack.create({
    membersMargin: 10,
    members: [ button, supplyList ]
});