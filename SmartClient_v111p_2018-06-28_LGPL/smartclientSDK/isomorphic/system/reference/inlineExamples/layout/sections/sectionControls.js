isc.ListGrid.create({
    fields:[
        {type:"text", title:"System", name:"system"},
        {type:"text", title:"Monitor Name", name:"monitor"}
    ],
    ID:"listGrid",
    canEdit:true, editEvent:"click",
    autoDraw:false
})

isc.HTMLFlow.create({
    ID:"statusReport",
    padding:5, border:"1px solid #808080",
    setNewStatus : function (system) {
        this.setContents(system +
            ": <span style='color:green;font-weight:bold'>Normal</span><br>"); 
    }
})

isc.ImgButton.create({
    ID:"addButton",
    autoDraw:false,
    src:"[SKIN]actions/add.png", size:16,
    showFocused:false, showRollOver:false, showDown:false,
    click : "listGrid.startEditingNew();return false;"
});

isc.ImgButton.create({
    ID:"removeButton",
    autoDraw:false,
    src:"[SKIN]actions/remove.png", size:16,
    showFocused:false, showRollOver:false, showDown:false,
    click : "listGrid.removeSelectedData();return false;"
});

isc.DynamicForm.create({
    ID: "systemSelector",
    height:1,
    width:75, numCols:1,
    fields: [
        {name: "system", type: "select", width:150, showTitle: false,
         valueMap: ["Development", "Staging", "Production"],
         defaultValue:"Development",
         change : "statusReport.setNewStatus(value)",
         click : "return false;"
        }
    ]
});

isc.SectionStack.create({
    sections:[
        { items:listGrid, title:"Monitors", controls:[addButton, removeButton], expanded:true },
        { items:statusReport, title:"Status", controls:systemSelector, expanded:true }
    ],
    visibilityMode:"multiple",
    animateSections:true,
    height:400,
    width:300,
    overflow:"hidden"
})

statusReport.setNewStatus(systemSelector.getValue("system"));
