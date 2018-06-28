isc.DynamicForm.create({
    width: 400,
    fields: [
        {name: "uid", title: "User ID", accessKey: "I"},
        {name: "firstName", title: "First Name", accessKey: "F"},
        {name: "lastName", title: "Last Name", accessKey: "L"},
        {name: "email", title: "Email", accessKey: "E"},
        {name: "homeSite", title: "Home Site", accessKey: "H"},
        {name: "sex", title: "Sex", accessKey: "S", type: "select", valueMap: ["M","F"]},
        {name: "dob", title: "Date of Birth", accessKey: "B", type: "date"}
    ]
});