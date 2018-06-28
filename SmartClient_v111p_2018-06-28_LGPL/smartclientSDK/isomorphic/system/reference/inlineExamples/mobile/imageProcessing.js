isc.VStack.create({
    membersMargin: 30,
    members: [
        isc.DynamicForm.create({
            ID: "uploadForm",
            dataSource: imageProcessing,
            fields: [{ 
                name: "image", title: "Picture", showTitle: false,
                hint: "Maximum file-size is 5mb", multiple: false, accept: "image/*", required: true 
            },{ 
                title: "Scale", type: "button", 
                click: function (form, item) {
                    form.saveData(function (dsResponse) {
                        imageViewer.updateImage(dsResponse.data);
                        form.editNewRecord();
                    });
                }
            }]
        }),
        isc.Img.create({
            ID: "imageViewer",
            updateImage : function (record) {
                this.setWidth(record.width);
                this.setHeight(record.height);
                this.setSrc(imageProcessing.getFileURL({pk: record.pk}));
            }
        })
    ]
});

