isc.DynamicForm.create({
    items : [
        { name:"employeeName", title:"Employee",
          optionDataSource:"employees", 
          valueField:"EmployeeId", displayField:"Name",
          pickListFields:[
              {name:"Name"},
              {name:"Email"}
          ],
          width:250, pickListWidth:350,
          formatValue : function (value, record, form, item) {
              var selectedRecord = item.getSelectedRecord();
              if (selectedRecord != null) {
                 return selectedRecord.Name + " (" + selectedRecord.Email + ")";
              } else {
                 return value;
              }
          }
        },
        { name:"otherEmployeeName", title:"Employee", type: "comboBox",
          optionDataSource:"employees", 
          valueField:"EmployeeId", displayField:"Name",
          pickListFields:[
              {name:"Name"},
              {name:"Email"}
          ],
          width:250, pickListWidth:350,
          formatOnBlur: true,
          formatValue : function (value, record, form, item) {
              var selectedRecord = item.getSelectedRecord();
              if (selectedRecord != null) {
                 return selectedRecord.Name + " (" + selectedRecord.Email + ")";
              } else {
                 return value;
              }
          }
        }
    ]
});
