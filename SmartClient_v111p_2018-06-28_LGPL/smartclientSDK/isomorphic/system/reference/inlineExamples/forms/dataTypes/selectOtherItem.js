isc.DynamicForm.create({
    width: 300,
    fields: [
        {
            title: "Units",
            type: "selectOther",
            valueMap: { 
                "Ea" : "Ea",
                "Pkt" : "Pkt",
                "Bag" : "Bag",
                "Ctn" : "Ctn"
            }
        }
    ]
});