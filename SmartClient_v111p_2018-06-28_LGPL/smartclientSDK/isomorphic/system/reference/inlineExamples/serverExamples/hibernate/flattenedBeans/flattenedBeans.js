
isc.ListGrid.create({
    ID: "userListGrid",
    width: 650, height: 164,
    autoDraw: false,
    dataSource: "flattenedBeans_flatUserHB",
    autoFetchData: true,
    fields: [
        { name: "firstName" },
        { name: "surname" },
        { name: "email" },
        { name: "addressLine1" },
        { name: "city" },
        { name: "state" }
    ],
    selectionChanged: function (record, state) {
        if (state) {
            editorForm.editRecord(record);
        }
    }
});

isc.DynamicForm.create({
    ID: "editorForm",
    autoDraw: false,
    width: 280, top: 180,
    dataSource: "flattenedBeans_flatUserHB",
    fields: [
        { name: "firstName", title: "First Name" },
        { name: "surname", title: "Surname" },
        { name: "email", title: "Email address", wrapTitle: false },
        { name: "addressLine1", title: "Address Line 1", wrapTitle: false },
        { name: "city", title: "City" },
        { name: "state", title: "State" }
    ]

});

isc.IButton.create({
    ID: "addButton",
    autoDraw: false,
    title: "Add User", 
    minWidth: 120, autoFit: true,
    click: "editorForm.editNewRecord();"
});

isc.IButton.create({
    ID: "saveButton",
    autoDraw: false,
    title: "Save Changes", 
    minWidth: 120, autoFit: true,
    click: "editorForm.saveData();"
});

isc.VStack.create({
    ID: "vStackButtons",
    autoDraw: false,
    membersMargin: 10,
    members: [addButton, saveButton]
});

isc.HStack.create({
    ID: "hStack",
    autoDraw: false,
    membersMargin: 10,
    members: [editorForm, vStackButtons]
}); 

isc.VStack.create({
    membersMargin: 20,
    members: [userListGrid, hStack]
});
