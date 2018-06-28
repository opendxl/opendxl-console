isc.ValuesManager.create({
        ID: "vm"        
});

isc.TabSet.create({
    ID: "theTabs",
    height: 250,
    width: 400,
    tabs: [
        {title:"Item",
         pane: isc.DynamicForm.create({
             ID: "form0",
             valuesManager:"vm",
             fields: [
                 {name: "itemName", type:"text", title:"Item"},
                 {name: "description", type:"textArea", title:"Description"},
                 {name:"price", type:"float", title: "Price", defaultValue: "low"} 
             ]
         })
        },
        {title:"Stock", 
         pane: isc.DynamicForm.create({
             ID: "form1",
             valuesManager:"vm",
             fields: [
                 {name: "inStock", type:"checkbox", title:"In Stock"},
                 {name: "nextShipment", type:"date", title:"Next Shipment",
                     useTextField:"true", defaultValue:"256", wrapTitle:false
                 }
             ]
         })    
        }
    ]
});

isc.Button.create({
    top:260,
    title:"Submit",
    click : function () {
        vm.validate();
        if (form1.hasErrors()) theTabs.selectTab(1);
        else theTabs.selectTab(0);
    }
});


