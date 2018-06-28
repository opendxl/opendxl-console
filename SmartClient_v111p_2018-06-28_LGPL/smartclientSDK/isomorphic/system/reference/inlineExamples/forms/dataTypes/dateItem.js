isc.DynamicForm.create({
    ID: "dateForm",
    numCols: 4,    
    width: 650,
    fields: [
        {name:"pickListDate", title:"PickList Date", type:"date", change:"dateLabel.setContents(value)",
         wrapTitle:false},
        {name:"directInputDate", title:"Direct Input Date", type:"date", useTextField:true, wrapTitle:false,
         change:"dateLabel.setContents(value)"}
    ]
});

isc.Label.create({
        ID: "dateLabel",
        top: 40,
        left: 100,
        width: 450
});

dateLabel.setContents(dateForm.getValue('pickListDate'));
