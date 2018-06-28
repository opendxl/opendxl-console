isc.DynamicForm.create({
    ID:"order",
    width:500, colWidths: [110, "*"],
    fields: [
        { type:"header", defaultValue:"Select an item for your Order" },
        { name:"itemId", title:"Item", width:300, editorType:"ComboBoxItem", optionDataSource:"StockItem",
          valueField:"id", displayField:"description",
          changed: "var record=item.getSelectedRecord(); if(record) form.setValue('price', record.price)" },
        { name:"quantity", title:"Quantity", type:"integer", defaultValue:1, validateOnExit:true },
        { name:"price", title:"Price", type:"float", canEdit:false, readOnlyDisplay:"static", format:"$,##0.00" },
        { name:"extended", title:"Extended", type:"float", canEdit:false, readOnlyDisplay:"static", format:"$,##0.00",
          formula: { text: "price*quantity" } },

        { type:"header", defaultValue:"Enter ship to details" },
        { name:"firstName", title:"First name", type:"text" },
        { name:"lastName", title:"Last name", type:"text" },
        { name:"address", title:"Address", type:"text" },
        { name:"city", title:"City", type:"text" },
        { name:"state", title:"State", type:"text", characterCasing:"upper", length:2, width:40 },
        { name:"zip", title:"Zip code", type:"integer", length:5 },
        { name:"label", title:"Shipping label", type:"textArea", width:300, canEdit:false,
          textFormula: { text: "#{firstName} #{lastName}\\n#{address}\\n#{city} #{state} #{zip}" } },

        { type:"header", defaultValue:"Select shipping time" },
        { name:"shipDays", title:"Ship days", type:"integer", defaultValue: 2 },
        { name:"estDelivery", title:"Est. Delivery", type:"date", canEdit:false, useTextField:true,
          formula: { text: "DateAdd(new Date(),'d',shipDays)"} },

        { type:"submit", title:"Submit Order", width:"*" }
    ]
});
