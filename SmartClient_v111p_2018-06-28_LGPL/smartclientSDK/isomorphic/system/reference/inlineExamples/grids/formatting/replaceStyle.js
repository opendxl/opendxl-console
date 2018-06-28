isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true, canDragSelect: true,
    sortField: 1,
    data: countryData,
    baseStyle:"cell",
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"population", title:"Population", type:"number"}
    ],
    
    getBaseStyle: function (record, rowNum, colNum) {
        if (this.getFieldName(colNum) == "population") {
            if (record.population > 1000000000) {
                return "myHighGridCell";
            } else if (record.population < 50000000) {
                return "myLowGridCell";
            } else {
                return this.baseStyle;
            }
        } else {
            return this.baseStyle;
        }
    }

})
