//It uses DMI to call GeneratorSetup.setupGenerator(), but it would be more typical to do this
//during applications startup, for example, from a servlet where <load-on-startup> has been
//set in web.xml
isc.DMI.call("GeneratorSetup", 
    "com.isomorphic.examples.server.editableServerSideDataSource.GeneratorSetup",
    "setupGenerator", updateDataSource);

// Editable grid for setup dynamicDS fields
isc.ListGrid.create({
    autoDraw: false,
    ID: "dsFieldEditList",
    width: "100%",
    height: 224,
    alternateRecordStyles: true,
    // use server-side dataSource so edits are retained across page transitions
    dataSource: dynamicDSFields,
    autoFetchData: true,
    canEdit: true,
    canRemoveRecords: true,
    editEvent: "click",
    listEndEditAction: "next"
})

isc.IButton.create({
    autoDraw: false,
    ID: "editNew",
    title: "Edit New",
    click: "dsFieldEditList.startEditingNew()"
});

isc.IButton.create({
    autoDraw: false,
    ID: "reload",
    title: "Reload",
    click: updateDataSource
});

// Form based on dynamicDS fields
var dsFieldForm;

function updateDataSource() {
    var callback = function(datas) {
        if (dsFieldForm != null) {
            formContainer.removeMember(dsFieldForm);
            dsFieldForm.clear();
        }
        dsFieldForm = isc.DynamicForm.create({
            dataSource: "dynamicDS"
        });
        formContainer.addMember(dsFieldForm, 0);
    };
    isc.DataSource.load("dynamicDS", callback, true);
}

isc.DataView.create({
    autoDraw: true,
    overflow: "hidden",
    width: "100%",
    height: "100%",
    members: [isc.HLayout.create({
        membersMargin: 10,
        members: [isc.VLayout.create({
            padding:10,
            membersMargin: 10,
            width: "60%",
            members: [dsFieldEditList, editNew],
            isGroup:true,
            groupTitle:"Edit Fields"
        }),
        isc.VLayout.create({
            ID: "formContainer",
            width: "40%",
            padding:10,
            membersMargin: 10,
            overflow: "auto",
            members: [reload],
            isGroup:true,
            groupTitle:"Form bound to fields"
        })]
    })]
})