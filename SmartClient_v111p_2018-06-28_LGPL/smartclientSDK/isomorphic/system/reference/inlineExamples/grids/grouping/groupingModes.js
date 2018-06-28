isc.ListGrid.create({
    ID: "countryList",
    width:500, height: 425,
    alternateRecordStyles:true,
    dataSource: countryDS,
    // display a subset of fields from the datasource
    fields:[
        {name:"countryName"},
        {
            name:"continent",
            defaultGroupingMode: "hemisphere",
            groupingModes: {continent: "Continent Name", hemisphere: "Hemisphere"},
            getGroupValue : function (value, record, field, fieldname, grid) {
                if (this.groupingMode == "continent") return value;
                else {
                    switch (value) {
                    case "North America":
                    case "South America":
                        return "Western Hemisphere";
                    default:
                        return "Eastern Hemisphere";
                    }
                }
            }
        },
        {
            name:"independence", width:100,
            seasons : ["Winter", "Spring", "Summer", "Fall"],
            groupingModes: ["epoch", "season"],
            defaultGroupingMode: "epoch",
            getGroupValue : function (value, record, field, fieldName, grid) {
                if (this.groupingMode == "season") {
                    if (value == null) return "Unknown";
                    var month = value.getMonth(),
                        day = value.getDate(),
                        shift = month % 3 == 2 && day >= 21 ? 1 : 0,
                        season = Math.floor(((month + shift) % 12)/3);
                    return this.seasons[season];
                } else {
                    if (value == null) return "Ancient";
                    else if (value.getFullYear() < 1910) return "Pre-Industrial";
                    else return "Post-Industrial";
                }
            }
        },
        {name: "population"},
        {name:"countryCode", title:"Flag", width:40, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"}
    ],
    groupStartOpen:"all",
    groupByField: "continent",
    autoFetchData: true
})

