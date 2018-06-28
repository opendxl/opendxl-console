isc.Canvas.create({
    ID: "container"
});

isc.DynamicForm.create({
    top: 415,
    ID: "treeForm",
    fields: [
        { name: "fullConnectors", type: "checkbox", 
          title: "Show Full Connectors?",
          changed: "this.form.createTree();"
        }
    ],
    createTree: function () {
        isc.TreeGrid.create({
            autoDraw: false,
            ID: "employeeTree",
            width: 500,
            height: 400,
            dataSource: "employees",
            autoFetchData: true,
            showConnectors: true,
            showFullConnectors: this.getValues()["fullConnectors"],
            nodeIcon:"icons/16/person.png",
            folderIcon:"icons/16/person.png",
            showOpenIcons:false,
            showDropIcons:false,
            closedIconSuffix:"",
            baseStyle: "noBorderCell",
            fields: [
                {name: "Name"}
            ]
        });
        container.addChild(employeeTree);
    }
});

treeForm.createTree();







