isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    sayCellEvent: function (eventText, record, colNum) {
        isc.say(
            eventText + " <b>" +
            this.getField(colNum).title + ":" + record[this.getFieldName(colNum)] +
            "</b> (Country:" + record.countryName + ")"
        )
    },
    cellClick: function (record, rowNum, colNum) {
        clickDisplay.setContents(
            "Clicked <b>" +
            this.getField(colNum).title + ":" + record[this.getFieldName(colNum)] +
            "</b> (Country:" + record.countryName + ")"            
        )
    },
    cellDoubleClick: "this.sayCellEvent('Double-clicked', record, colNum)",
    cellContextClick: "this.sayCellEvent('Context-clicked', record, colNum); return false;"
})


isc.Label.create({
    ID:"clickDisplay",
    width:200, top:250,
    align:"center", border:"1px solid #808080",
    contents:"click a value in the grid"
})
