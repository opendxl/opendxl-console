isc.Label.create({
    ID:"helpText",
	contents:"<ul>" +
	"<li>click a record in the grid to view and edit that record in the form</li>" +
	"<li>click <b>Save</b> to save changes to an edited record in the form</li>" +
	"<li>click <b>Clear</b> to clear all fields in the form</li>" +
	"<li>click <b>Filter</b> to filter (substring match) the grid based on the value of the 'Item' form value only.</li>" +
	"<li>click <b>Fetch</b> to fetch records (exact match) for the grid based on the value of the 'Item' form value only.</li>" +
	"<li>click <b>Delete</b> to delete all selected records</li>" +
	"</ul>"
});

// databound ListGrid
//   * click records to edit in boundForm and view in boundViewer
//   * double-click record to edit inline (Return or arrow/tab off current row to save)
isc.ListGrid.create({
	ID:"boundList",
    dataSource: supplyItemDMI,
	height:200,
    selectionChanged : function (record, state) {
        if (this.selection.anySelected()) {
            deleteBtn.enable();
            saveBtn.setDisabled(this.selection.multipleSelected());
            boundForm.editRecord(record);
            boundViewer.viewSelectedData(this);
        } else {
            deleteBtn.disable();
            saveBtn.disable();
        }
    }
});

// databound SearchForm
//   * click boundList records to edit
isc.SearchForm.create({
	ID:"boundForm",
    dataSource: supplyItemDMI,
	numCols:"6",
	autoFocus:false,
    useAllDataSourceFields: true,
    fields: [{name:"nextShipment", wrapTitle:false}]
});

// toolbar to perform various actions using the boundForm values (see helpText above)
isc.Toolbar.create({
    ID: "boundFormToolbar",
	membersMargin:10,
    buttonConstructor: "IButton",
    height: 22,
	buttons:[
		{title:"Save", click:"boundForm.saveData()", ID:"saveBtn"},
		{title:"Clear", click:"boundForm.clearValues();boundForm.editNewRecord();saveBtn.enable()"},
		{title:"Filter", click:"boundList.filterData(boundForm.getValuesAsCriteria());"},
		{title:"Fetch", 
         click:"boundList.fetchData(boundForm.getValuesAsCriteria());"},
		{title:"Delete", ID:"deleteBtn", disabled: true, 
         click:"boundList.removeSelectedData();boundList.deselectAllRecords()"}
	]
});
		
// databound DetailViewer
//   * click boundList records to display
isc.DetailViewer.create({
	ID:"boundViewer",
    dataSource: supplyItemDMI
});

isc.VStack.create({
	width:"100%",
	membersMargin:20,
	members:[ helpText, boundList, boundForm, boundFormToolbar, boundViewer]
});

boundList.filterData();