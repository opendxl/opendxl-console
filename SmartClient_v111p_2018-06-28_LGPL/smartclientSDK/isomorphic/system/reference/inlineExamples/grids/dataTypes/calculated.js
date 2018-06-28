isc.ListGrid.create({
    ID: "countryList",
    width:575, height:224, alternateRecordStyles:true,
    canEdit:true, editEvent:"click", modalEditing:true, saveByCell:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png", canEdit:false},
        {name:"countryName", title:"Country"},
        {name:"population", title:"Population", type:"integer", format: ",0"},
        {name:"gdp", title:"GDP ($B)", type:"float", format: ",0.0"},
        {name:"gdp_percap", title:"GDP (per capita)",
            canEdit:false,
            align:"right",
            formatCellValue: function (value, record) {
                if (!isc.isA.Number(record.gdp) || !isc.isA.Number(record.population)) return "N/A";
                var gdpPerCapita = Math.round(record.gdp*1000000000/record.population);
                return isc.NumberUtil.format(gdpPerCapita, "\u00A4,0");
            },
            sortNormalizer: function (record) {
                return record.gdp/record.population;
            }
        }
    ],
    editorExit: function (event, record, newValue, rowNum, colNum) {
        var fieldName = this.getFieldName(colNum);
        if (fieldName == 'gdp' || fieldName == 'population') {
            this.refreshCell(rowNum, this.getFieldNum('gdp_percap'), false, true);
        }
    }
})
