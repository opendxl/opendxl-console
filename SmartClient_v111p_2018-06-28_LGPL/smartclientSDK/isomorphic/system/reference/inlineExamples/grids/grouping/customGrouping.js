isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224,
    alternateRecordStyles:true,
    dataSource: countryDS,
    // display a subset of fields from the datasource
    fields:[
        {name:"countryName"},
        {name:"continent"},
        {
            name:"independence", width:100,
            getGroupValue : function (value, record, field, fieldName, grid) {
                if (value == null)               return "Ancient";
                else if (value.getFullYear() < 1910) return "Pre-Industrial";
                else                             return "Post-Industrial";
            }
        },
        {
            name:"population",
            GROUP_SMALL: 1,
            GROUP_MED: 2,
            GROUP_LARGE: 3,
            getGroupValue : function (value, record, field, fieldName, grid) {
                if      (value < 100000000)  return this.GROUP_SMALL;
                else if (value < 1000000000) return this.GROUP_MED;
                else                         return this.GROUP_LARGE;
            },
            getGroupTitle : function (groupValue, groupNode, field, fieldName, grid) {
                switch (groupValue) {
                case this.GROUP_SMALL: 
                    baseTitle = "Population less than 100 million"; break;
                case this.GROUP_MED: 
                    baseTitle = "Population between 100 million-1 billion"; break;
                case this.GROUP_LARGE: 
                    baseTitle = "Population over 1 billion"; break;
                }
                baseTitle += " (" + groupNode.groupMembers.length + " members)";
                return baseTitle;
            }
       },
       {name:"countryCode", title:"Flag", width:40, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"}
    ],
    groupStartOpen:"all",
    groupByField: 'population',
    autoFetchData: true
})

