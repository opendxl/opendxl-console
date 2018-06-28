isc.DynamicForm.create({
    ID: "systemSelector",
    width:75, numCols:1,
    layoutAlign:"center",
    fields: [
        {name: "selectFont", type: "select", width:150, showTitle: false,
         valueMap: ["Development", "Staging", "Production"],
         defaultValue:"Development",
         change : "statusReport.setNewStatus(value)"
        }
    ]
});

isc.Window.create({
    width: 400, height: 200,
    title: "Status",
    canDragReposition: true, canDragResize: true,
    headerControls : ["closeButton", "minimizeButton", "headerLabel", 
                      systemSelector],
                      
    items: [
        isc.HTMLFlow.create({
            ID:"statusReport",
            padding:5,
            width: "100%",
            height: "100%",
            setNewStatus : function (system) {
                this.setContents(system +
                    ": <span style='color:green;font-weight:bold'>Normal</span><br>"); 
            }
        })
    ]
});

statusReport.setNewStatus("Development");
