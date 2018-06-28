isc.HStack.create({membersMargin:10, height:160, members:[
    isc.ListGrid.create({
        ID: "countryList1",
        width:300, height:224, alternateRecordStyles:true,
        data: countryData,
        fields:[
            {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
            {name:"countryName", title:"Country"},
            {name:"capital", title:"Capital"}
        ],
        canReorderRecords: true,
        canDragRecordsOut: true,
        canAcceptDroppedRecords: true,
        dragDataAction: "move"
    }),
    isc.VStack.create({width:32, height:74, layoutAlign:"center", membersMargin:10, members:[
        isc.Img.create({src:"icons/32/arrow_right.png", width:32, height:32,
            click:"countryList2.transferSelectedData(countryList1)"
        }),
        isc.Img.create({src:"icons/32/arrow_left.png", width:32, height:32,
            click:"countryList1.transferSelectedData(countryList2)"
        })
    ]}),
    isc.ListGrid.create({
        ID: "countryList2",
        width:200, height:224, alternateRecordStyles:true, showAllRecords:true,
        fields:[
            {name:"countryCode", title:"Flag", width:40, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
            {name:"countryName", title:"Country"}
        ],
        emptyMessage: "drop rows here",
        canReorderRecords: true,
        canDragRecordsOut: true,
        canAcceptDroppedRecords: true,
        dragDataAction: "move"
    })
]})
