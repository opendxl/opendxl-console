
var ds = isc.DataSource.get("countryDS");

isc.VLayout.create({
	ID:"layout",
	width:500, height:250,
	membersMargin: 10,
	members: [
		isc.HLayout.create({
			ID:"buttonLayout",
			width:"*", height:30,
			membersMargin: 10,
			members: [
				isc.IButton.create({
				    ID: "formulaButton",
				    autoFit: true,
				    title: "Show Formula Builder",
				    click: "countryList.addFormulaField();"
				}),
				isc.IButton.create({
				    ID: "stateButton",
				    autoFit: true,
				    title: "Persist State",
				    click: function () {
				        var state = countryList.getViewState();
                        isc.Offline.put("exampleState", state)
				    }
				})
			]
		})
	]
});

layout.addMember(isc.ListGrid.create({
    ID: "countryList",
    width:"100%", height:"*",
    alternateRecordStyles:true,
    dataSource: ds,
    autoFetchData: true,
    canAddFormulaFields: true,
    canAddSummaryFields: true,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", 
            imageURLSuffix:".png"
        },
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"population", title:"Population", format:",0", width: 90},
        {name:"area", title:"Area (km&sup2;)", format:",0", width: 95},
        {name:"gdp", format:",0"}
    ]
}));

var savedState = isc.Offline.get("exampleState");
if (savedState) {
    countryList.setViewState(savedState);
}

