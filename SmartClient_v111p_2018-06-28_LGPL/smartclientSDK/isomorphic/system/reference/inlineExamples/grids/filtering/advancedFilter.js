isc.VStack.create({
    membersMargin: 30,
    members: [
        isc.VStack.create({
            membersMargin: 30,
            members: [
                isc.DynamicForm.create({
                    ID: "filterForm",
                    width: 300,
                    operator: "and",
                    saveOnEnter: true,
                    dataSource: worldDS,
                    submit: function () {
                        filterGrid.filterData(filterForm.getValuesAsCriteria());
                    },
                    fields: [
                        {name: "countryName",
                         title: "Country Name contains",
                         wrapTitle: false,
                         type: "text"
                        },
                        {type: "blurb",
                         defaultValue: "<b>AND</b>"
                        },
                        {name: "population",
                         title: "Population smaller than",
                         wrapTitle: false,
                         type: "number",
                         operator: "lessThan"
                        },
                        {type: "blurb",
                         defaultValue: "<b>AND</b>"
                        },
                        {name: "independence",
                         title: "Nationhood later than",
                         wrapTitle: false,
                         type: "date",
                         useTextField: true,
                         operator: "greaterThan"
                        }
                    ]
                }),
                isc.IButton.create({
                    title: "Filter",
                    click: function () {
                        filterForm.submit();
                    }
                })
            ]
        }),
        isc.ListGrid.create({
            ID: "filterGrid",
            width:850, height:300, alternateRecordStyles:true,
            dataSource: worldDS,
            autoFetchData: true,
            useAllDataSourceFields: true,
            fields: [ 
                {name:"countryCode", width: 60}, 
                {name:"government", title:"Government", width: 95},
                {name:"independence", title:"Nationhood", width: 100},
                {name:"population", title:"Population", width: 100},
                {name:"gdp", title:"GDP ($M)", width: 85}
            ]
        })
    ]
});
