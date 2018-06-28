isc.VStack.create({
    width:"100%",
    membersMargin:20,
    members:[

        isc.TileGrid.create({
            autoDraw:false,
            ID:"boundList",
            tileWidth:158,
            tileHeight:205,
            height:400,
            canReorderTiles:true,
            showAllRecords:true,
            dataSource:"animals",
            autoFetchData:true,
            animateTileChange:true,
            fields: [
                {name:"picture"},
                {name:"commonName", cellStyle: "commonName"},
                {name:"lifeSpan", formatCellValue: "return 'Lifespan: ' + value;"},
                {   name:"status", 
                    getCellStyle: function (value, field, record, viewer) {
                        if (value == "Endangered") return "endangered";
                        else if (value == "Threatened") return "threatened";
                        else if (value == "Not Endangered") return "notEndangered";
                        else return viewer.cellStyle;
                    }
                }
                
            ]            
        }),

        isc.DynamicForm.create({
            autoDraw:false,
            isGroup:true,
            groupTitle:"Search",
            ID:"boundForm",
            numCols:"6",
            dataSource:"animals",
            autoFocus:false,
            fields: [  
                {name:"commonName"},
                {name:"lifeSpan" , title: "Max Life Span", editorType: "SliderItem", wrapTitle: false,
                    minValue:1, maxValue:60, defaultValue:60, height:50,
                    operator: "lessThan"
                },
                {name:"status", operator: "equals", allowEmptyValue: true, emptyDisplayValue: "(Any)"}

            ],
            itemChanged: "boundList.fetchData(this.getValuesAsCriteria());"
                      
            
        }),

        isc.DynamicForm.create({
            autoDraw:false,
            ID:"sortForm",
            isGroup:true,
            groupTitle:"Sort",
            numCols:"6",
            autoFocus:false,
            itemChanged: function(item, newValue, oldValue) {
                var sortVal = this.getValue("sortBy");
                var sortDir = this.getValue("chkSortDir");
                if (sortVal) boundList.data.sortByProperty(sortVal, sortDir); 
            },
            fields: [  
                {
                    name:"sortBy", title:"Sort by", type:"select",
                    valueMap: {
                        "commonName" : "Animal",
                        "lifeSpan" : "Life Span",
                        "status" : "Endangered Status"  
                    }
                },
                
                {name:"chkSortDir", title:"Ascending", type:"checkbox"}
            ]
        }),

        isc.HLayout.create({
            autoDraw:false,
            membersMargin:10,
            height: 22,                               
            members:[
                isc.IButton.create(
                    {
                        title:"Filter", 
                        click:"boundList.fetchData(boundForm.getValuesAsCriteria());", 
                        autoFit:true
                    }
                ),
                isc.IButton.create(
                    {
                        title:"Clear", 
                        click:"boundList.fetchData();boundForm.clearValues();sortForm.clearValues();", 
                        autoFit:true
                    }
                )
            ]
        })
        
       
    ]
});
