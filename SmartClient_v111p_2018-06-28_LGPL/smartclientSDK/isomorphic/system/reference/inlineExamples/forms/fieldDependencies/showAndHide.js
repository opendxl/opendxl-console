isc.DynamicForm.create({
    width: 300,
    fields: [
        {name:"onOrder",
         type:"checkbox",
         title:"Shipment on order",
         redrawOnChange:true,
         width:50
        },
        {name:"orderDate",
         type:"date",
         wrapTitle:false,
         title:"Order Placed",
         showIf:"form.getValue('onOrder') == true",
         required:true
        }
    ]
});
