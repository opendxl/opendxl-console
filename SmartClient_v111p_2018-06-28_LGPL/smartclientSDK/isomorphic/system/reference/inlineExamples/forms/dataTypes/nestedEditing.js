isc.ClassFactory.defineClass("GridEditorItem", "CanvasItem");

isc.GridEditorItem.addProperties({
   height:"*", width:"*",
   rowSpan:"*", colSpan:"*",
   endRow:true, startRow:true,

   // this is going to be an editable data item
   shouldSaveValue:true,

   // Override createCanvas to create the ListGrid with the user can use to set the value.
   createCanvas : function () {

       var gridDS = isc.DS.get(this.gridDataSource);

       return isc.ListGrid.create({
           autoDraw:false,

           // fill the space the form allocates to the item
           leaveScrollbarGaps:false,

           // dataSource and fields to use, provided to a listGridItem as
           // listGridItem.gridDataSource and optional gridFields
           dataSource:gridDS,
           fields:this.gridFields,
           sortField:this.gridSortField,

           // the record being edited is assumed to have a set of subrecords
           data:this.getValue(),
           canEdit:true,
           saveLocally:true,
           modalEditing:true,

           // update form when data changes
           cellChanged : function () {
               this.canvasItem.storeValue(this.data);
               if (this.canvasItem.gridSortField != null) {
                    this.sort(this.canvasItem.gridSortField);
               }
           }
       });
   },

   // implement showValue to update the ListGrid data
   // Note that in this case we care about the underlying data value - an array of records
   showValue : function (displayValue, dataValue) {
       if (this.canvas == null) return;
       this.canvas.setData(dataValue);
   }
});


// ----------- Example Usage -------------

// form containing new listGrid-based item
isc.DynamicForm.create({
   ID: "exampleForm", autoDraw:true,
   width: 400, height: 350,
   dataSource:"masterDetail_orderHB",
   fields: [
       {name:"orderID" },
       {name:"orderDate" },
       {name:"items",
        showTitle:false,
        editorType:"GridEditorItem",
        gridDataSource:"masterDetail_orderItemHB",
        gridFields:[
           {name:"itemDescription", width: 145},
           {name:"unitPrice"},
           {name:"quantity"}
        ],
        gridSortField:"itemDescription"
       },
       {name:"trackingNumber",wrapTitle:false},
       {editorType:"SubmitItem", title:"Save"}
   ]
}).fetchData({orderID:3});