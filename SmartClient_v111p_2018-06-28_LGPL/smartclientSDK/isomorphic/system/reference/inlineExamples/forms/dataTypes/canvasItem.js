isc.ClassFactory.defineClass("ListGridItem", "CanvasItem");

isc.ListGridItem.addProperties({
    height:"*", width:"*",
    rowSpan:"*", endRow:true, startRow:true,
    
    // this is going to be an editable data item
    shouldSaveValue:true,
    
    // Implement 'createCanvas' to build a ListGrid from which the user may 
    // select items.
    createCanvas : function () {
        return isc.ListGrid.create({
            autoDraw:false,
            
            // fill the space the form allocates to the item
            width:this.width, height:this.height,
            leaveScrollbarGaps:false,
            
            // dataSource and fields to use, provided to a listGridItem as
            // listGridItem.gridDataSource and optional gridFields
            dataSource:this.gridDataSource,
            fields:this.gridFields,
            autoFetchData:true,
            
            dataArrived : function () {
                this.canvasItem.showValue(null, this.canvasItem.getValue());
            },
            
            selectionUpdated : function (record) {
                var item = this.canvasItem;
                if (record == null) item.storeValue(null);
                else item.storeValue(record[item.name]);
            }
        });
    },
    
    // implement showValue to update the ListGrid selection
    showValue : function (displayValue, dataValue) {
        if (this.canvas == null) return;
        
        var record = this.canvas.data.find(this.name, dataValue);
        if (record) this.canvas.selection.selectSingle(record)
        else this.canvas.selection.deselectAll();
    }
});


// ----------- Example Usage -------------

// form containing new listGrid-based item
isc.DynamicForm.create({
   ID: "exampleForm", autoDraw:false,
   width: 400, height: 350,
   border:"2px solid blue", padding:5, canDragResize:true,
   fields: [
       {name: "Name" },
       {name:"countryName",
        title:"Home Country",
        editorType:"ListGridItem",
        gridDataSource:"countryDS",
        gridFields:[ {name:"countryName"}, {name:"capital"} ]
       },
       {name: "Email" }
   ],
   values : {
       Name:"Bob",
       countryName:"Germany",
       Email:"bob@isomorphic.com"
   },
   itemChanged : function () {
       valuesLabel.setContents("Current values:<br> " + isc.JSON.encode(this.getValues()));
   }
});

isc.VLayout.create({
    ID: "vLayout",
    membersMargin: 30,
    autoDraw:false,
    members: [
        // demonstrate programmatic setValue()
        isc.Button.create({
            title: "Set Value: France",
            autoFit: true,
            click: function () {
                exampleForm.setValue("countryName", "France");
                valuesLabel.setContents("Current values:<br> " + isc.JSON.encode(exampleForm.getValues()))
            }
        }),
        isc.Label.create({
            ID:"valuesLabel",
            contents:"Initial values:<br> " + isc.JSON.encode(exampleForm.getValues())
        })
    ]
});

isc.HLayout.create({
    membersMargin: 50,
    members: [ vLayout, exampleForm ]
});