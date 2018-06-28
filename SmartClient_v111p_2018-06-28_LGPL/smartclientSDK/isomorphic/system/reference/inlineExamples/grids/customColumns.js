
var ds = isc.DataSource.get("countryDS");

isc.VLayout.create({
	ID:"layout",
	width:550, height:250,
	membersMargin: 5,
	members: [
		isc.HLayout.create({
			ID:"buttonLayout",
			width:"*", height:1,
			membersMargin: 10,
			members: [
				isc.IButton.create({
				    ID: "formulaButton",
				    autoFit: true,
				    title: "Show Formula Builder",
				    click: "countryList.addFormulaField();"
				}),
				isc.IButton.create({
				    ID: "summaryButton",
				    autoFit: true,
				    title: "Show Summary Builder",
				    click: "countryList.addSummaryField();"
				}),
				isc.IButton.create({
				    ID: "stateButton",
				    autoFit: true,
				    title: "Recreate from State",
				    click: function () {
				        var state = countryList.getFieldState();
						countryList.destroy();
						recreateListGrid();
				        countryList.setFieldState(state);
				    }
				})
			]
		})
	]
});

recreateListGrid();

function recreateListGrid() {
	var grid = isc.ListGrid.create({
	    ID: "countryList",
	    width:"100%", height:"*",
	    headerButtonProperties: {showFocusedAsOver: true},
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
	        {name:"population", title:"Population"},
	        {name:"area", title:"Area (km&sup2;)"},
	        {name:"gdp", format: ",0"}
	    ]
	});
    layout.addMember(grid);
}
