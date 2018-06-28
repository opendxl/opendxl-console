 
Date.setShortDisplayFormat(function () {
    return this.getDate() + "." + (this.getMonth() + 1) + "." + this.getShortYear();
});
Date.setInputFormat("DMY");

isc.ListGrid.create({
    ID:"employeeGrid",
    width:250, height:100,
    canEdit:true,
    dataSource:"employees",
    autoFetchData:true,
    recordClick:"employeeForm.editRecord(record)"
})

isc.DynamicForm.create({
    ID:"employeeForm",
    top:150,
    dataSource:"employees",
    fields:[
        {name:"name"},
        {name:"hireDate", useTextField:true},
        {type:"button", title:"Save Edits", click:"form.saveData()"}
    ]
    
})