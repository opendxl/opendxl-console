isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    emptyCellValue: "--",
    dataSource: worldDS,
    // display a subset of fields from the datasource
    fields:[
        {name:"countryCode"},
        {name:"countryName"},
        {name:"capital"},
        {name:"continent"}
    ],
    sortField: 0, // sort by countryCode
    dataPageSize: 50,
    autoFetchData: true
})


isc.IButton.create({
    left:0, top:240, width:150,
    title:"Add new country",
    nextNum:1,
    click: function () {
        countryList.addData({
            countryCode: "A" + this.nextNum,
            countryName: "Country " + this.nextNum,
            capital:"Capital " + this.nextNum
        });
        this.nextNum++;
    }
})
