
function dateFormatFunction () {
    return this.getDate() + "." + (this.getMonth() + 1) + "." + this.getShortYear();
}; 

isc.ListGrid.create({
    ID:"employeeGrid",
    width:250, height:100,
    canEdit:true,
    dataSource:"employees",
    autoFetchData:true,
    recordClick:"employeeForm.editRecord(record)",
    dateFormatter:dateFormatFunction,
    dateInputFormat:"DMY"
})

isc.DynamicForm.create({
    ID:"employeeForm",
    top:150,
    dataSource:"employees",
    fields:[
        {name:"name"},
        {name:"hireDate", useTextField:true, wrapTitle:false, inputFormat:"DMY", displayFormat:dateFormatFunction},
        {type:"button", title:"Save Edits", click:"form.saveData()"}
    ]
    
})