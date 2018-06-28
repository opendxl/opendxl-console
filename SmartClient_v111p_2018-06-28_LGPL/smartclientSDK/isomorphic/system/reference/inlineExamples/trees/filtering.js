isc.TreeGrid.create({
    ID: "employeeTree",
    width: 525,
    height: 400,
    dataSource: "employees",
    nodeIcon:"icons/16/person.png",
    folderIcon:"icons/16/person.png",
    showOpenIcons:false,
    showDropIcons:false,
    closedIconSuffix:"",
    autoFetchData:true,
    dataFetchMode:"local",
    loadDataOnDemand:false,
    showSelectedIcons:true,
    dataProperties:{
        dataArrived:function (parentNode) {
            this.openAll();
        }
    },
    fields: [
        {name: "Name", width:"40%"},
        {name: "Job"},
        {name: "EmployeeType"},
        {name: "Salary", formatCellValue: "isc.NumberUtil.format(value, '\u00A4,0.00')"}
    ]
});

isc.DynamicForm.create({
    ID:"buttonBar",
    top:420,
    width:500,
    numCols: 4,
    fields: [
        {name:"all", title:"Show all", type:"button", startRow:false, endRow:false,
            click:"employeeTree.setCriteria(null);"},
        {name:"fullTime", title:"Show full time", type:"button", startRow:false, endRow:false,
            click:"employeeTree.setCriteria({EmployeeType:'full time'});"},
        {name:"partTime", title:"Show contract", type:"button", startRow:false, endRow:false,
            click:"employeeTree.setCriteria({EmployeeType:'contract'});"},
        {name:"keepParents", title:"Keep parents", type:"boolean", showTitle:false,
            startRow:false, endRow:false, 
            changed : function (form,item,value) {
                employeeTree.getData().setProperty("keepParentsOnFilter", value);
                // Reset filter
                var criteria = employeeTree.getCriteria();
                if (criteria != null && !isc.isAn.emptyObject(criteria)) {
                    employeeTree.setCriteria(null);
                    employeeTree.setCriteria(criteria);
                }
            }
        }
    ]
});

