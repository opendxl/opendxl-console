var initialCriteria = {
        _constructor:"AdvancedCriteria",
        operator:"and",
        criteria:[
            { fieldName:"description", operator:"notNull" }
        ]
    };
    
isc.ListGrid.create({
    ID: "listGridSuppyItem",
    width:700, height:224, alternateRecordStyles:true,
    dataSource: supplyItemDownload,
    selectionType: "simple"
});

isc.DynamicForm.create({
    ID: "formDownload",
    fields: [
        {name:"checkbox", title:"Download to new window", type:"checkbox"}
    ]
});

isc.Button.create({
    ID: "buttonDownload",
    width:200,
    title: "Download Descriptions",
    click: function () { 
    		var selectedRecords = listGridSuppyItem.getSelectedRecords();
    		if (selectedRecords.length == 0) {
    			isc.say("You must select at least one record");
    			return;
    		}
 			var criteria = { itemID: selectedRecords.getProperty("itemID") };
     		var dsRequest = {
                    ID: "dsRequest",
                    operationId: "downloadDescriptions",
                    downloadResult: true,
                    downloadToNewWindow: !!formDownload.getValue('checkbox')
               };
    		supplyItemDownload.fetchData(criteria, null, dsRequest);
    } 
});

isc.HLayout.create({
    ID: "hLayout",
    width: 300,
    members: [buttonDownload, formDownload]
});

isc.VLayout.create({
    ID: "vLayout",
    width: 300,
    members: [listGridSuppyItem, hLayout]
});

listGridSuppyItem.fetchData(initialCriteria);
