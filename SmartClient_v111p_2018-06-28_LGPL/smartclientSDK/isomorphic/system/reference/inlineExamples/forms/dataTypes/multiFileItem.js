var uploadTest = isc.DataSource.get("uploadTest");

isc.ListGrid.create({
    ID: "uploadLG",
    dataSource: uploadTest,
    width: 500,
    height: 200,
    left: 20,
    top: 20,
    recordClick: function (viewer, record) {
        uploadForm.editSelectedData(uploadLG);
    }
});
uploadLG.filterData({});



isc.Button.create({
    title : "Delete Row",
    top: 240,
    left: 20,
    click: "uploadLG.removeSelectedData(); uploadForm.editNewRecord()"
});

isc.DynamicForm.create({
    ID: "uploadForm",
    width: 400,
    height: 100,
    top: 300,
    left: 20,
    dataSource: uploadTest,
    items: [
        {name: "title"},
        {name: "file", title: "Files", height: 50, editorType:"MultiFileItem", dataSource: "uploadedFiles" }
    ]
});

isc.Button.create({
    title: "Save Form",
    top: 400,
    left: 20,
    click: "uploadForm.save()"
});

isc.Button.create({
    title: "Clear Form",
    top: 400,
    left: 200,
    click: "uploadForm.editNewRecord()"
});
