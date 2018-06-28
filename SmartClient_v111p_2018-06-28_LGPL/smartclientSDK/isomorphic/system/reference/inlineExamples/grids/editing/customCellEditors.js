isc.ListGrid.create({
    ID:"countryGrid",
    width:300,
    height:340,
    showAllRecords:true,
    canEdit:true,
    editEvent:"click",
    editByCell:true,
    fields:[
        {name:"name", title:"Name", width:"*", canEdit:false},
        {name:"value", title:"Value Field", width:170}
    ],
    getEditorProperties:function(editField, editedRecord, rowNum) {
        if (editField.title == "Value Field") {
            switch(rowNum) {
                case 0:
                    var item = {editorType:"TextItem", showHint:true, showHintInField:true, hint:"Some Hint"};
                    return item;
                case 1:
                    return {editorType:"PasswordItem"};
                case 2:
                    return {editorType:"DateItem"};
                case 3:
                    return {editorType:"CheckboxItem", showLabel:false};
                case 4:
                    return {editorType:"integer", mask:"###"};
                case 5:
                    var item = {editorType:"SelectItem", showTitle:false,
                        multiple:true, multipleAppearance:"picklist",
                        valueMap: ["Cat","Dog","Giraffe","Goat","Marmoset","Mouse"]
                    };
                    return item;
                case 6:
                    var item = { editorType:"SliderItem", maxValue:10, width:170,
                        sliderProperties:{
                            margin:5
                        }
                    };
                    return item;
            }
        }
        return null;
    },
    data:[
        {id:1, name:"String Editor", value:"some string"},
        {id:2, name:"Password Editor", value:"donkeykong"},
        {id:3, name:"Date Editor", value:new Date()},
        {id:4, name:"Boolean Editor", value:false},
        {id:5, name:"Masked Int Editor", value:5},
        {id:6, name:"SelectItem Editor", value:"Dog"},
        {id:7, name:"Slider Editor", value:7}
    ]
	
});