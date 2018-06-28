isc.Tree.create({
    ID:"animalTree",
    root:
    {name:"Zoo", children:[
        {name:"Aquarium", children:[
            {name:"Salt Water", children:[
                {name:"Bottlenose Dolphin"},
                {name:"Giant Pacific Octopus"}
            ]},
            {name:"Fresh Water", children:[
                {name:"Freshwater Stingray"}
            ]}
        ]},
        {name:"Reptile House", children:[
            {name:"Lizard House", children:[
                {name:"Cuban Ground Iguana"},
                {name:"Desert Iguana"},
                {name:"Marbled Salamander"}
            ]},
            {name:"Snake House", children:[
                {name:"Indian Rock Python"}
            ]},
            {name:"Monkey House", children:[
                {name:"Howler Monkey"},
                {name:"Orangutan"},
                {name:"Guinea Baboon"}
            ]},
            {name:"Lion Enclosure", children:[
                {name:"Lion"}
            ]}
        ]}
    ]}
});
