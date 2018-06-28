isc.DataSource.create({
    ID: "viewState",
    dataFormat: "sql",
    clientOnly: true,
    fields: [
        {name: "pk", primaryKey: true, hidden: true},
        {name: "name", title: "Name"},
        {name: "viewState", title: "View State"}
    ]
});

var ds = isc.DataSource.get("countryDS");
var tableDS = isc.DataSource.get("viewState");
var lastNum = 1;

isc.ListGrid.create({
    ID: "viewStateTable",
    height: 200, width: "100%",
    wrapCells: true,
    fixedRecordHeights: false,
    canEdit: true,
    autoDraw: false,
    emptyMessage: "No Saved Preferences",
    canRemoveRecords: true,
    autoFetchData: true,
    dataSource: tableDS,
    fields: [
            {name: "name", title: "Preference", width: 100},
            {name: "viewState", title: "View State String", editorType: "TextAreaItem"} 
    ]
});
isc.ListGrid.create({
    ID: "countryGrid",
    width: "100%", height: 200,
    leaveScrollBarGap: true,
    canGroupBy: true,
    autoDraw: false,
    canFreezeFields: true,
    canAddFormulaFields: true,
    canAddSummaryFields: true,
    dataSource: ds,
    autoFetchData: true,
    fields: [
        {name: "countryCode", title: "Flag", type: "image", width: 50, imageURLPrefix: "flags/16/", imageURLSuffix: ".png", canSort: false},
        {name: "countryName", title: "Country"},
        {name: "capital", title: "Capital"},
        {name: "population", title: "Population"}, 
        {name: "area", title: "Area (km&sup2;)"} 
    ],
draw : function() {
        this.Super("draw", arguments);
        viewStateTable.addData({pk: 0, name: "Default", viewState: this.getViewState()});
        preferenceSelectItem.setValue("Default");
    }    
});

isc.DynamicForm.create({
    top: 45,
    width: 200,
    ID: "preferenceForm",
    numCols: 2,
    autoDraw: false,
    fields: [
            {name: "name", title: "Preference", type: "select",  ID: "preferenceSelectItem", displayField: "name",
            addUnknownValues:true, optionDataSource: viewState,
             changed: function(form, item, value) {
              var criteria = {name: value};
               viewState.fetchData(criteria, function(dsResponse, data) {
                        if (data.length != 0) {
                        	var selectedViewState = data[0].viewState;
                            countryGrid.setViewState(selectedViewState);
                        }
                    }); 
                } 
            }
    ]
});
isc.ToolStripButton.create({
    ID: "formulaBuilder",    
    autoDraw: false,
    icon: "icons/16/sc_insertformula.png",  
    title: "Formula Builder",
    autoFit: true,
    click : function () {
        countryGrid.addFormulaField();
    }   
});

isc.ToolStripButton.create({
    ID: "summaryBuilder",    
    autoDraw: false,
    icon: "icons/16/application_side_tree.png",  
    title: "Summary Builder",
    autoFit: true,
    click : function () {
        countryGrid.addSummaryField();
    }
});

isc.ToolStripButton.create({
    ID: "savePreference",    
    icon: "icons/16/database_gear.png",  
    title: "Save Preference",
    autoDraw: false,
    autoFit: true,
    click : function () {
        isc.askForValue("Save Preference as",
                    function(value) {
                    if (value) {
                        viewStateTable.addData({pk: lastNum, name: value, viewState: countryGrid.getViewState()});
                        lastNum = lastNum + 1;
                        preferenceSelectItem.setValue(value);
                     }
                    },
                    {width: 300, height: 100}) 
    } 
});



isc.ToolStrip.create({
    ID: "preferenceStrip",
    width: "100%",
    addFill: true,
    align: "right",
    autoDraw: false,
    members: [formulaBuilder, summaryBuilder, "separator", savePreference, 
              "separator",  preferenceForm]
});

isc.ToolStripButton.create({
    ID: "restoreState",    
    autoDraw: false,
    title: "Restore State",
    icon: "icons/16/database_gear.png",  
    autoFit: true,
    click : function () {
        var selectedViewState = viewStateTable.getSelectedRecord().viewState;
        preferenceSelectItem.setValue(viewStateTable.getSelectedRecord().name);
        countryGrid.setViewState(selectedViewState);
    }
});

isc.ToolStrip.create({
    ID: "restoreStrip",
    width: "100%",
    addFill: true,
    autoDraw: false,
    align: "right",
    members: [restoreState]
});

isc.VLayout.create({
    height: "100%",
    minBreadthMember: "preferenceStrip",
    members: [preferenceStrip, countryGrid, viewStateTable, restoreStrip]
    });