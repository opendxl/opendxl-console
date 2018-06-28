isc.ListGrid.create({
    width: "80%", height: 84, leaveScrollbarGap:false,
    hoverWidth:300,
    fields: [
        {name:"commonName", hidden:true, title:"Animal"},
        {name:"scientificName", title:"Scientific Name"},
        {name:"diet", title:"Diet"},
        {name:"information", title:"Interesting Facts", showHover: true}
    ],
    data: [
        {commonName:'Platypus',scientificName:'Ornithorhynchus Anatinus',diet:'Insects and Larvae',lifeSpan:'10-15 years',information:'Were thought to be a hoax when first discovered. The male has a venemous spur on his hind legs.  Capable of many vocalizations including sounds like a growling puppy and a brooding hen.'},
        {commonName:'Elephant (African)',scientificName:'Loxodonta africana',diet:'Herbivore',lifeSpan:'40-60 years',information:'The African Elephant is the largest of all land animals and also has the biggest brain of any land animal. Both males and females have ivory tusks. Elephants are also wonderful swimmers. Man is the only real enemy of the elephant. Man threatens the elephant by killing it for its tusks and by destroying its habitat.'},
        {commonName:'Alligator (American)',scientificName:'Allligator mississippiensis',diet:'Carnivore',lifeSpan:'50 years',information:'In the 16th century, Spanish explorers in what is now Florida encountered a large formidable animal which they called "el largo" meaning "the lizard". The name "el largo" gradually became pronounced "alligator".'}
    ]
});

isc.IButton.create({
    top: 150,
    disabled: true,
    title: "Close Issue",
    prompt: "You cannot close this issue - see the owner",
    hoverWidth:150
});

isc.Img.create({
    left: 180,
    top: 100,
    width: 90,
    height: 47,
    src: "other/eyes.jpg",
    prompt: "360px by 188px<BR>25k<BR>JPEG high quality",
    hoverWidth:120,
    hoverOpacity:75,
    hoverStyle: "interactImageHover"
});

isc.DynamicForm.create({
    left: 220,
    top: 190,
    width: 200,
    itemHoverWidth: 200,
    itemHoverStyle: "interactFormHover",
    fields: [{
        name: "severityLevel",
        title: "Severity Level",
        wrapTitle: false,
        type: "staticText",
        defaultValue: "Severity 2",
        prompt: "<b>Severity 1</b> - Critical problem<br>System is unavailable in production or " +
                "is corrupting data, and the error severely impacts the user's operations." +
                "<br><br><b>Severity 2</b> - Major problem<br>An important function of the system " +
                "is not available in production, and the user's operations are restricted." +
                "<br><br><b>Severity 3</b> - Minor problem<br>Inability to use a function of the " +
                "system occurs, but it does not seriously affect the user's operations."
    }]
});
