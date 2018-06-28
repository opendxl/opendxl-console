 
isc.ListGrid.create({
    ID:"employeeGrid",
    width:250, height:100,
    canEdit:true,
    dataSource:"employees",
    autoFetchData:true,
    recordClick:"employeeForm.editRecord(record)",
    dateFormatter:"toJapanShortDate",
    dateInputFormat:"YMD"
})

isc.DynamicForm.create({
    ID:"employeeForm",
    top:150,
    dataSource:"employees",
    fields:[
        {name:"name"},
        {name:"hireDate", useTextField:true, inputFormat:"YMD", wrapTitle:false,
            dateFormatter:"toJapanShortDate"},
        {type:"button", title:"Save Edits", click:"form.saveData()"}
    ]
    
})