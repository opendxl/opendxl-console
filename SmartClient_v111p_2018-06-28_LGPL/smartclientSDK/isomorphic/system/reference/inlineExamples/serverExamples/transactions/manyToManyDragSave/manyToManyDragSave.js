isc.DynamicForm.create({
    ID: "teamSelectionForm",
    width: "300",
    height: "30",
    fields: [
        {name: "TeamId", title: "Team", type: "select",
         optionDataSource:teams,
         valueField: "TeamId",
         displayField: "TeamName",
         changed: "item.splitEmployeesByTeam()",
         dataArrived : function (startRow, endRow, data) {
             if (this.getValue() == null && startRow == 0 && endRow > 0) {
                 var record = data.get(0),
                     value;
                 if (record == null || record === isc.ResultSet.getLoadingMarker()) {
                     value = null;
                 } else {
                     value = record[this.getValueFieldName()];
                 }
                 this.setValue(value);
                 this.splitEmployeesByTeam();
             }
         },
         splitEmployeesByTeam : function () {
             var criteria = teamSelectionForm.getValuesAsCriteria();
             teamMembersGrid.fetchData(criteria);
             var dsRequest = {
                 ID: "dsRequestID",
                 operationType: "fetch",
                 operationId: "fetchEmployeesNotInTeam"
             };
             employeesGrid.fetchData(criteria, null, dsRequest);
         }
        }
    ]
});

isc.ListGrid.create({
    ID: "employeesGrid",
    width:300, height:224,
    canDragRecordsOut: true,
    dragDataAction: "none",
    dragType: "nonTeamMemberEmployee",
    autoFetchData: false,  
    sortField: "EmployeeId", 
    dataSource: employeesByTeam,
    fields:[
        {name: "EmployeeId", title:"ID", width:50},
        {name: "Name", title: "Employee Name"}
    ]
});

isc.ListGrid.create({
    ID: "teamMembersGrid",
    width:350, height:264,
    canAcceptDroppedRecords: true,
    dropTypes: ["nonTeamMemberEmployee"],
    canRemoveRecords: true,
    autoFetchData: false,  
    sortField: "EmployeeId", 
    dataSource: teamMembers2,
    fields:[
        {name: "EmployeeId", title:"EID", width:"20%"},
        {name: "EmployeeName", title: "Employee Name", width:"40%"},
        {name: "TeamName", title: "Team Name"}
    ],
    recordDrop : function (dropRecords, targetRecord, index, sourceWidget) {
        mockRemoveEmployees(dropRecords);
        return this.Super("recordDrop", arguments);
    },
    removeRecordClick : function (rowNum) {
        var record = this.getRecord(rowNum);
        this.removeData(record, function (dsResponse, data, dsRequest) {
            // Update `employeesGrid` now that an employee has been removed from
            // the selected team.  This will add the employee back to `employeesGrid`,
            // the list of employees who are not in the team.
            mockAddEmployeesFromTeamMemberRecords(record);
        });
    }
});

isc.LayoutSpacer.create({
    ID: "spacer",
    height: 30
});

isc.Img.create({
    ID: "arrowImg",
    layoutAlign:"center", 
    width: 32, 
    height: 32, 
    src: "icons/32/arrow_right.png",
    click : function () {
        var selectedEmployeeRecords = employeesGrid.getSelectedRecords();  
        teamMembersGrid.transferSelectedData(employeesGrid);
        mockRemoveEmployees(selectedEmployeeRecords);
    }
});

isc.VStack.create({
    ID: "vStack",
    members: [spacer, employeesGrid]
});

isc.VStack.create({
    ID: "vStack2",
    members: [teamSelectionForm, teamMembersGrid]
});

isc.HStack.create({
    ID: "hStack",
    height: 160,
    members: [vStack, arrowImg, vStack2]
});

// To remove entries of `employeesGrid` without deleting the corresponding rows from  
// the database, we can mock a "remove" DSResponse and post it to `employeesDS` via  
// DataSource#updateCaches().  All grids that are bound to the data source respond to  
// these events as appropriate.  In this case, posting a "remove" DSResponse will cause  
// employeesGrid` to remove the records from its list.
function mockRemoveEmployees (employeeRecords) {
    if (employeeRecords.length == 0) {  
        return;
    }
    var dsRequest = {
        ID: "mockRemoveResponse",
        operationType: "remove",
        data: employeeRecords
    }
    employeesByTeam.updateCaches(dsRequest);
}

function mockAddEmployeesFromTeamMemberRecords(teamMemberRecord) {
    var mockEmployeeRecord = teamMemberRecord;
    mockEmployeeRecord.Name = teamMemberRecord.EmployeeName;  
    mockEmployeeRecord.Job = teamMemberRecord.EmployeeJob;  

    var dsRequest = {
        ID: "mockAddResponse",
        operationType: "add",
        data: mockEmployeeRecord
    }
    employeesByTeam.updateCaches(dsRequest);
}