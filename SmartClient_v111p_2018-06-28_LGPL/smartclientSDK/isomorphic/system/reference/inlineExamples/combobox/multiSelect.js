isc.DynamicForm.create({
    ID:"exampleForm",
    width:450,
    wrapItemTitles: false,
    fields: [
        {
            type:"select",
            title:"Select Multiple (Grid)",
            multiple:true,
            multipleAppearance:"grid",
            valueMap: [ "Cat", "Dog", "Giraffe", "Goat", "Marmoset", "Mouse" ]
        },
        {
            type:"select",
            title:"Select Multiple (PickList)",
            multiple:true,
            multipleAppearance:"picklist",
            valueMap: [ "Cat", "Dog", "Giraffe", "Goat", "Marmoset", "Mouse" ]
        },
        {
            type:"select",
            title:"Select",
            hint:"Multi Select with icons",
            wrapHintText: false,
            multiple:true,
            valueMap: {
                "US" : "United States",
                "CH" : "China",
                "JA" : "Japan",
                "IN" : "India",
                "GM" : "Germany",
                "FR" : "France",
                "IT" : "Italy",
                "RS" : "Russia",
                "BR" : "Brazil",
                "CA" : "Canada",
                "MX" : "Mexico",
                "SP" : "Spain"
            },
            imageURLPrefix:"flags/16/",
            imageURLSuffix:".png",
            valueIcons: {
                "US" : "US",
                "CH" : "CH",
                "JA" : "JA",
                "IN" : "IN",
                "GM" : "GM",
                "FR" : "FR",
                "IT" : "IT",
                "RS" : "RS",
                "BR" : "BR",
                "CA" : "CA",
                "MX" : "MX",
                "SP" : "SP"
            }
        },
    ]
});
