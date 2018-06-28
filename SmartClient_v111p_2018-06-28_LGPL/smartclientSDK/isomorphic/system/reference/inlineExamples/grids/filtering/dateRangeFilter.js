// ---------------------------------------------------------------------------------------
// DynamicForm Example (DateRangeItem)

isc.Label.create({
    ID: "externalDynamicFormLabel",
    contents: "External DynamicForm (DateRangeItem)",
    width: 700,
    height: 25,
    baseStyle: "exampleSeparator"
});

isc.DynamicForm.create({
    ID: "form",
    width: 500, 
    titleOrientation: "top",
    dataSource: "worldDS",
    items: [
        { name: "independence", editorType: "DateRangeItem", showTitle: false, allowRelativeDates: true },
        { name: "searchButton", type: "ButtonItem", title: "Filter",
            click: function () {
                var criteria = form.getField("independence").getCriterion();
                grid1.fetchData(criteria);
            }
        }
    ]
});

// Create a ListGrid displaying data from the worldDS
isc.ListGrid.create({
    ID: "grid1",
    width: 850,
    height: 150,
    dataSource: "worldDS",
    fields: [
        { name:"countryCode", title:"Code", width:60 },
        { name:"countryName", title:"Country", width: 80 },
        { name:"capital", title:"Capital", width: 70 },
        { name:"government", title:"Government", width: 105 },
        { name:"continent", title:"Continent", width: 85 },
        { name:"independence", title:"Nationhood", width: 100 },
        { name:"area", title:"Area (km&sup2;)" },
        { name:"population", title:"Population", width: 95 },
        { name:"gdp", title:"GDP ($M)", width: 85 },
        { name:"member_g8", title:"G8", width:60 }
    ]
});

// ---------------------------------------------------------------------------------------
// Inline FilterEditor Example (MiniDateRangeItem)
isc.Label.create({
    ID: "filterEditorLabel",
    contents: "FilterEditor (MiniDateRangeItem)",
    width: 850,
    height: 25,
    baseStyle: "exampleSeparator"
});

// Create a ListGrid displaying data from the worldDS and also displaying a FilterEditor
isc.ListGrid.create({
    ID: "grid2",
    width: 850,
    height: 150,
    dataSource: "worldDS",
    autoFetchData: true,
    showFilterEditor: true,
    fields: [
        { name:"countryCode", title:"Code", width:60 },
        { name:"countryName", title:"Country", width: 80 },
        { name:"capital", title:"Capital", width: 70 },
        { name:"government", title:"Government", width: 105 },
        { name:"continent", title:"Continent", width: 85 },
        { name:"independence", title:"Nationhood", width: 100 },
        { name:"area", title:"Area (km&sup2;)" },
        { name:"population", title:"Population", width: 95 },
        { name:"gdp", title:"GDP ($M)", width: 85 },
        { name:"member_g8", title:"G8", width:60 }
    ]
});

isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 10,
    members: [
        externalDynamicFormLabel, form, grid1, filterEditorLabel, grid2
    ]
})

//Give the DateRangeItem an initial value (see the DateRange object)
form.getItem("independence").setValue({ 
 start: { _constructor: "RelativeDate", value: "-1200m" }, 
 end: { _constructor: "RelativeDate", value: "-600m" }
});

form.getItem("searchButton").click();
