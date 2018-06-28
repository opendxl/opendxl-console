
var ds = isc.DataSource.get("countryDS");

isc.VLayout.create({
	ID:"layout",
	width:700, height:250,
    membersMargin: 5,
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
				    ID: "editHilitesButton",
				    autoFit: true,
				    title: "Edit Hilites",
				    click: "countryList.editHilites();"
				}),
				isc.IButton.create({
				    ID: "stateButton",
				    autoFit: true,
				    title: "Recreate from State",
				    click: function () {
				        var fieldState = countryList.getFieldState(true),
                            hiliteState = countryList.getHiliteState();

						countryList.destroy();
						recreateListGrid();
				        countryList.setFieldState(fieldState);
				        countryList.setHiliteState(hiliteState);
				    }
				})
			]
		})
	]
});

recreateListGrid();

function recreateListGrid() {
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
	        {name:"population", title:"Population"},
	        {name:"area", title:"Area (km&sup2;)"},
	        {name:"gdp"}
	    ]
	}));

}
