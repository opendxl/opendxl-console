isc.DynamicForm.create({
    width: 500,
    numCols: 4,
    fields: [
        {name:"categoryName", title:"Category", editorType:"SelectItem", 
         optionDataSource:"supplyCategory", changed:"form.clearValue('itemName');" 
        },
        {name: "itemName", title:"Item", editorType: "SelectItem", 
         optionDataSource:"supplyItem", 
         getPickListFilterCriteria : function () {
            var category = this.form.getValue("categoryName");
            return {category:category};
         }
        }
    ]
});
