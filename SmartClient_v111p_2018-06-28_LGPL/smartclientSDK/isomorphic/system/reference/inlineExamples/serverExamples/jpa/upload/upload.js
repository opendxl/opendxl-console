var firstTime = true;

isc.DynamicForm.create({
    autoDraw: false,
    ID: "uploadForm", width: 300,
    dataSource: mediaLibraryJPA,
    fields: [
        { name: "title" },
        { name: "image", type: "imageFile", hint: "Maximum file size is 5 MiB" },
        { title: "Save", type: "button", 
            click: function () {
                this.form.saveData("if(dsResponse.status>=0) uploadForm.editNewRecord()");
            }
        }
    ]
});

isc.DynamicForm.create({
    autoDraw: false,
    ID: "searchForm",
    width: "100%",
    numCols: 3,
    colWidths: [60, 200, "*"],
    saveOnEnter:true, 
    fields: [
        { name: "title", title: "Title", type: "text", width: "*" },
        { name: "search", title: "Search", type: "SubmitItem",
            startRow: false, endRow: false
        }
    ],
    submit : function () {
        mediaTileGrid.fetchData(this.getValuesAsCriteria(), null, {textMatchStyle:"substring"});
    } 
});

isc.IButton.create({
    autoDraw: false,
    ID: "viewAsTiles",
    title: "View as Tiles",
    autoFit: true,
    icon: "[ISO_DOCS_SKIN]/images/silkicons/application_view_tile.png",
    value: true,
    radioGroup: "views",
    actionType: "checkbox",
    click: function(){
        showTileGrid();
    }
});

isc.IButton.create({
    autoDraw: false,
    ID:"viewAsList",
    title: "View as List",
    autoFit: true,
    icon: "[ISO_DOCS_SKIN]/images/silkicons/application_view_detail.png",
    radioGroup: "views",
    actionType: "checkbox",
    click: function(){
        showListGrid();
    }
});

isc.HLayout.create({
    autoDraw: false,
    ID: "buttons",
    width: 500,
    membersMargin: 5,
    padding: 5,
    members: [viewAsTiles, viewAsList]
});

isc.TileGrid.create({
    autoDraw: false,
    ID: "mediaTileGrid",
    width: "100%",
    height: 224,
    tileWidth: 100,
    tileHeight: 150,
    dataSource: mediaLibraryJPA,
    autoFetchData: true
});

isc.ListGrid.create({
    autoDraw: false,
    ID: "mediaListGrid",
    width: "100%",
    height: 224,
    alternateRecordStyles: true,
    dataSource: mediaLibraryJPA
});

isc.VLayout.create({
    autoDraw: false,
    ID:"mainLayout",
    width:500,
    height:250,
    members:[searchForm, buttons, mediaTileGrid, mediaListGrid]
});

isc.HStack.create({
    width:"100%",
    membersMargin: 10,
    members:[uploadForm, mainLayout]
});

viewAsTiles.click();

function showTileGrid() {
    mediaListGrid.hide();
    mediaTileGrid.show();
}

function showListGrid() {
    if (firstTime) {
        firstTime = false;
        mediaListGrid.setData(mediaTileGrid.getData());
    }
    mediaTileGrid.hide();
    mediaListGrid.show();
}
