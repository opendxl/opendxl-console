isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"independence", title:"Nationhood", type:"date", width: "25%",
            formatCellValue: function (value) {
                if (isc.isA.Date(value)) {
                    return (new Date().getYear() - value.getYear()) + " years ago";
                }
            }
        },
        {name:"area", title:"Area", type:"number",
            formatCellValue: "isc.NumberUtil.format(value, ',0') + ' km&sup2;'"
        }
    ]
})
