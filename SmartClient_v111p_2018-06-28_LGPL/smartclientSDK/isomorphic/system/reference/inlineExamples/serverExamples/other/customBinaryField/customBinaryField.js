isc.DynamicForm.create({
    ID: "formView",
    width: "100%",
    dataSource: customBinaryField,
    fields: [
       	{name: "id", width: 150, canEdit:false},
    	{name: "file", canEdit:false}
    ]
});

isc.DynamicForm.create({
    ID: "formEdit",
    width: 100,
    dataSource: customBinaryField,
    fields: [
        {name: "id", width: 150, required: true},
        {name: "file", required: true}
    ]
});

isc.IButton.create({
    ID: "uploadButton",
    title: "Upload",
    width: 100,
    click: function(){
        formEdit.saveData("if(dsResponse.status>=0) formEdit.editNewRecord()");
    }
});

isc.VLayout.create({
    ID: "vLayoutForms",
    width: 100,
    members: [
        isc.Label.create({
            contents: "Editor",
            width: 50,
            height: 25,
            autoDraw: true,
            baseStyle: "exampleSeparator"
        }),
        formEdit,
        uploadButton,
        isc.Label.create({
            contents: "View",
            width: 50,
            height: 25,
            autoDraw: true,
            baseStyle: "exampleSeparator"
        }),
        formView
    ]
});

isc.ListGrid.create({
    ID: "listGrid",
    width:500, height:224, alternateRecordStyles:true,
    dataSource: customBinaryField,
    selectionType: "single",
    autoFetchData: true,
    fields:[
        {name:"id", width:100},
        {name:"file", width:380}
    ],
    recordClick: function(viewer, record, recordNum, field, fieldNum, value, rawValue) { 
        formEdit.editSelectedData(listGrid);
        formView.editSelectedData(listGrid);
    }
});

isc.HLayout.create({
    ID: "hLayoutTop",
    width: 700,
    layoutMargin:10,
    membersMargin: 10,
    members: [listGrid, vLayoutForms]
});

isc.Button.create({
    ID: "buttonDownload",
    width:200,
    title: "Download Selected File",
    click: function () { 
        var selectedRecord = listGrid.getSelectedRecord();
        if (selectedRecord == null) {
            isc.say("You must select one record");
            return;
        }
        customBinaryField.downloadFile(selectedRecord);
    }
});

isc.Button.create({
    ID: "buttonView",
    width:200,
    title: "View Selected File",
    click: function () { 
        var selectedRecord = listGrid.getSelectedRecord();
        if (selectedRecord == null) {
            isc.say("You must select one record");
            return;
        }
        customBinaryField.viewFile(selectedRecord);
    }
});


isc.HLayout.create({
    ID: "hLayoutButtons",
    width: 500,
    layoutMargin: 10,
    membersMargin: 10,
    members: [buttonDownload, buttonView]
});

isc.VLayout.create({
    ID: "vLayout",
    width: 300,
    members: [hLayoutTop, hLayoutButtons]
});