var phoneContactsData=[{
    firstName: "Jenny",
    lastName: "Burns",
    mobile: "5558675309"
}]

isc.DataSource.create({
    ID: "phoneContacts",
    fields:[
        {name:"firstName"},
        {name:"lastName"},
        {name:"mobile", title:"Mobile number", type:"phoneNumber"}
    ],
    clientOnly: true,
    testData: phoneContactsData
})

isc.ListGrid.create({
    ID: "phoneContactsList",
    width:500, height:224,
    alternateRecordStyles:true, 
    dataSource: phoneContacts,
    autoFetchData: true,
    canEdit: true,
    editEvent: "click",
    modalEditing:true
})

isc.Button.create({
    title: "Add Contact",
    top: 230,
    click: function () {
        phoneContactsList.startEditingNew();
    }
})
