isc.TreeGrid.create({
    ID: "employeeTree",
    width: 500,
    height: 400,
    dataSource: "employees",
    autoFetchData:true,
    nodeIcon:"icons/16/person.png",
    folderIcon:"icons/16/person.png",
    showOpenIcons:false,
    showDropIcons:false,
    closedIconSuffix:"",
    showSelectedIcons:true,
    fields: [
        {name: "Name", formatCellValue: "record.Job+':&nbsp;'+value"}
    ],
    dataProperties:{
        dataArrived:function (parentNode) {
            this.openAll();
        }
    }
});


