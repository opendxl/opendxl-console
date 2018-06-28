isc.RestDataSource.create({
    ID:"countryDS",
    fields:[
        {name:"countryCode", title:"Code", primaryKey:true, canEdit:false},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"}
    ],
    
    fetchDataURL:"[ISOMORPHIC]/system/reference/inlineExamples/dataIntegration/xml/responses/country_fetch_rest.xml",
    addDataURL:"[ISOMORPHIC]/system/reference/inlineExamples/dataIntegration/xml/responses/country_add_rest.xml",
    updateDataURL:"[ISOMORPHIC]/system/reference/inlineExamples/dataIntegration/xml/responses/country_update_rest.xml",
    removeDataURL:"[ISOMORPHIC]/system/reference/inlineExamples/dataIntegration/xml/responses/country_remove_rest.xml"
    
        
});
   
isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    emptyCellValue: "--",
    dataSource: countryDS,
    // display a subset of fields from the datasource
    fields:[
        {name:"countryCode"},
        {name:"countryName"},
        {name:"capital"},
        {name:"continent"}
    ],
    sortField: 0, // sort by countryCode
    dataPageSize: 50,
    autoFetchData:true
});

isc.HLayout.create({
    membersMargin:15,
    top:240,
    members: [
        isc.IButton.create({
            width:150,
            title:"Add new country",
            click: function () {
                countryList.addData(
                    {
                        countryCode: "A1",
                        countryName: "New Value",
                        capital:"New Value",
                        continent:"New Value"
                    }
                );
                this.disable();
            }
        }),
        isc.IButton.create({
            width:150,
            title:"Update country (US)",
    
            click: function () {
                countryList.updateData(
                    {
                        countryCode: "US",
                        countryName:"Edited Value",
                        capital:"Edited Value",
                        continent:"Edited Value"
                    }
                );
        
                countryList.selection.selectSingle({countryCode:"US"})
                this.disable();
            }
        }),
        isc.IButton.create({
            width:150,
            title:"Remove country (UK)",
    
            click: function () {
                countryList.removeData(
                    {
                        countryCode: "UK"
                    }
                );
                this.disable();
            }
        })
    ]
});

