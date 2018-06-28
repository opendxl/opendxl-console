isc.DynamicForm.create({
    dataSource:"validationDMI_orderForm",
    fields: [
        { type:"header", defaultValue:"Add an item to your Order" },
        { name:"itemId", title:"Item", editorType:"ComboBoxItem", optionDataSource:"StockItem",
          valueField:"id", displayField:"description" },
        { name:"quantity", validateOnExit:true },
        { name:"instructions", editorType:"TextAreaItem" },
        { type:"submit", title:"Submit Order" }
    ]
});
