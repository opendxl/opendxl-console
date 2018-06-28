isc.ListGrid.create({
    width: 750,
    height: 250,
    canResizeFields: true,
    showRecordComponents: true,    
    canRemoveRecords: true,  
	recordComponentPoolingMode: "recycle",
    data: countryData,

    fields: [
        { name: "countryCode", type: "image", title: "Flag", width: 40, align: "center",
            imageURLPrefix: "flags/16/", imageURLSuffix: ".png" },
        { name: "countryName", title: "Country" },
        { name: "capital", title: "Capital" },
        { name: "continent", title: "Continent" }
    ],
	
	createRecordComponent: function (record, colNum) {  
            var editImg = isc.IButton.create({
                showDown: false,
                showRollOver: false,
                layoutAlign: "center",
                title: record["background"],
				wrap: true,
				height: this.getDrawnRowHeight(),
                grid: this
            });
			return editImg			
    },
	
	updateRecordComponent: function (record, colNum, component, recordChanged) {
		var fieldName = this.getFieldName(colNum); 
		if (recordChanged) { 	
			component.setTitle(record["background"]);
		 	component.setHeight(this.getDrawnRowHeight());	
		}
		return component
	}
});