isc.defineClass("ItemsListGrid","ListGrid").addProperties({
    autoDraw: false,
    alternateRecordStyles:true, 
    leaveScrollbarGap:false,
    dataSource: supplyItem,
    autoFetchData: false,
    dragDataAction: "move",
    defaultFields: [
        {name: "itemName"},
        {name: "SKU"},
        {name: "category"}
    ]
});


isc.HLayout.create({membersMargin:10, 
    height:224, width: 800, 
    members:[
        isc.ItemsListGrid.create({
            ID:"list1",
            canDragRecordsOut: true,
            canAcceptDroppedRecords: true,
            canReorderRecords: true
        }),
        isc.VStack.create({width:32, height:74, layoutAlign:"center", membersMargin:10, members:[
            isc.Img.create({src:"icons/32/arrow_right.png", width:32, height:32,
                click:"list2.transferSelectedData(list1)"
            }),
            isc.Img.create({src:"icons/32/arrow_left.png", width:32, height:32,
                click:"list1.transferSelectedData(list2)"
            })
        ]}),
        isc.ItemsListGrid.create({
            ID:"list2",
            canDragRecordsOut: true,
            canAcceptDroppedRecords: true,
            canReorderRecords: true
        })
    ]
});

list1.fetchData({category: "Manilla Folders"});
list2.fetchData({category: "Lever Arch Files"});
