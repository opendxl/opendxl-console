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
        dragDataAction: "copy"
    }),
    isc.Img.create({src:"icons/32/arrow_right.png", width:32, height:32, layoutAlign:"center",
        click:"countryList2.transferSelectedData(countryList1)"
    }),
    isc.ListGrid.create({
        ID: "countryList2",
        width:200, height:224, left:350, alternateRecordStyles:true, showAllRecords:true,
        fields:[
            {name:"countryCode", title:"Flag", width:40, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
            {name:"countryName", title:"Country"}
        ],
        emptyMessage: "drop rows here",
        canReorderRecords: true,
        canAcceptDroppedRecords: true
    })
]})

