isc.DynamicForm.create({
    items : [
        { name:"employeeName", title:"Employee",
          optionDataSource:"employees", 
          valueField:"EmployeeId", displayField:"Name",
          pickListWidth:250,
          pickListFields:[
              {name:"Name", formatCellValue : function (value, record) {
                 return record.Name + " (" + record.Email + ")";
               }
              }
          ]
        }
    ]
});
