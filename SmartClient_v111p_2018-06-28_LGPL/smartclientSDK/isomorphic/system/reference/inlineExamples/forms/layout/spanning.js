isc.DynamicForm.create({
    width: 300,
    numCols: 2,
    colWidths: [60, "*"],
    border:"1px solid blue", padding:5,
    canDragResize:true, resizeFrom:["R"],
    fields: [
        {name: "subject",
         title: "Subject",
         type: "text",
         width: "*"
        },
        {name: "message",
         type: "text",
         length: 5000,
         showTitle: false,
         colSpan: 2,
         width: "*"
        }
    ]
});
