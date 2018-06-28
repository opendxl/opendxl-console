
isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    selectionType: "multiple",
    canSelectCells: true,
    canDragSelect: true,
    cellSelectionChanged : function (cellList) {
        var cells = this.selection.getSelectedCells();
        displayForm.setValue("countries", isc.Comm.serialize(cells, false));
    }
})

isc.DynamicForm.create({
    ID: "displayForm",
    width:250, height:100, top:250,
    fields:[
        { name: "countries", type: "textArea", width: "*", colSpan: "*", 
            titleOrientation: "top", title: "Selected Cells" }
    ]
})
