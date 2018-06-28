
// Define a new component class for dataSource record selection and editing
isc.ClassFactory.defineClass("CompoundEditor", isc.HLayout);

isc.CompoundEditor.addProperties({

    // Override initWidget to populate the editor with a resizeable ListGrid and editor pane
    initWidget : function () {
        
        // Always call the superclass implementation when overriding initWidget
        this.Super("initWidget", arguments);

        this.form = isc.DynamicForm.create({
            compoundEditor:this,
            autoDraw:false,
            dataSource:this.dataSource
        })
        this.saveButton = isc.IButton.create({
            form:this.form,
            // have the saveButton be initially disabled - enable when a record is selected
            disabled:true,
            autoDraw:false, layoutAlign:"center",
            title:"Save",
            click:"this.form.saveData()"
        })

        this.editorLayout = isc.VLayout.create({
            autoDraw:false,
            membersMargin:5,
            members:[
                this.form,
                this.saveButton
            ]
        })
        
        this.grid = isc.ListGrid.create({
            compoundEditor:this,
            form:this.form, width:750,
            saveButton:this.saveButton,
            autoDraw:false, showResizeBar:true,
            dataSource:this.dataSource,
            autoFitDateFields: "both",
            wrapHeaderTitles: true,
            autoFetchData:true,
            recordClick:function (viewer, record, rowNum, field, fieldNum, value, rawValue) {
                this.form.clearErrors();
                this.form.editRecord(record);
                this.saveButton.enable();
            }
        });
        
        
        // Slot the grid into the left hand side and the editor into the right.
        this.addMember(this.grid);
        this.addMember(this.editorLayout);
    },
    
    // setDataSource()
    // Method to update the dataSource of both the grid and the form
    setDataSource : function (dataSource) {
        this.grid.setDataSource(dataSource);
        this.form.setDataSource(dataSource);
        this.saveButton.disable();
        this.grid.filterData();
    }
    
});

// ---------------------------------
// Make use of this custom component

isc.DynamicForm.create({
    values:{dataSource:"Select A DataSource"},
    items:[
        {name:"dataSource", showTitle:false, editorType:"SelectItem",
         width: 190,
         valueMap:["countryDS", "supplyItem"],
         change:function (form, item, value, oldValue) {
            if (!this.valueMap.contains(value)) return false;
            else compoundEditor.setDataSource(value);
         }
        }
    ]
})

isc.CompoundEditor.create({
    ID:"compoundEditor",
    dataSource:"countryDS",
    top:50, width:"100%", height:"80%"
    
})

