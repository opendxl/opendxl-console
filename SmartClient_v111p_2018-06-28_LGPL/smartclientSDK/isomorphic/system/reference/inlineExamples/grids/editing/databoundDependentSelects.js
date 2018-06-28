isc.ListGrid.create({
    width: 500,
    height:200,
    canEdit:true,
    ID:"orderList",
    
    fields: [
        {name:"quantity", title:"Qty", type:"integer", width:30},
        {name:"categoryName", title:"Category", editorType:"SelectItem", 
         changed:"this.grid.clearEditValue(this.rowNum, 'itemName');",
         editorProperties : { optionDataSource:"supplyCategory" }
        },
        {name: "itemName", title:"Item", editorType: "SelectItem", 
         editorProperties:{
             optionDataSource:"supplyItem", 
             getPickListFilterCriteria : function () {
                var category = this.grid.getEditedCell(this.rowNum, "categoryName");
                return {category:category};
             }
         }
        }
        
    ]
});

isc.IButton.create({
    top:225,
    title:"Order New Item",
    click:"orderList.startEditingNew({quantity:1})"
})
