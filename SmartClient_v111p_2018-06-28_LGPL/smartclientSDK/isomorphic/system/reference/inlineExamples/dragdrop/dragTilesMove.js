
isc.TileGrid.create({
    ID: "testList",  width: 500, height: 400, autoDraw:false,
    tileWidth:150,
    tileHeight:170,
    data: [
         {
            picture:"Camel.jpg", 
            commonName:"Arabian Camel", 
            information:"Can eat any vegetation including thorns. Has one hump for fat storage. Is well known as a beast of burden.", 
            lifeSpan:50, 
            scientificName:"Camelus dromedarius", 
            diet:"Herbivore", 
            status:"Not Endangered" 
         }, 
        {
            picture:"BaldEagle.jpg", 
            commonName:"Bald Eagle", 
            information:" Females lay one to three eggs. Visual acuity is 3-4 times greater than a human. Bald eagles build the largest nest of any North American bird. The largest nest found was 3.2 yds (2.9 m) in diameter and 6.7 yds (6.1 m) tall. Protection of the Bald Eagle is afforded by three federal laws: (1) the Endangered Species Act, (2) the Bald Eagle and Golden Eagle Protection Act, and (3) the Migratory Bird Treaty Act.", 
            lifeSpan:50, 
            scientificName:"southern subspecies: Haliaeetus leucocephalus leuc", 
            diet:"Carnivore", 
            status:"Endangered" 
        }, 
        {
            picture:"BlackSpiderMonkey.jpg", 
            commonName:"Black Spider Monkey", 
            information:"They can perform remarkable feats with their tails.", 
            lifeSpan:20, 
            scientificName:"Ateles panicus", 
            diet:"Herbivore", 
            status:"Not Endangered"
        }
    ],
    canAcceptDroppedRecords: true,
    canDragTilesOut: true,
    canReorderTiles: true,
    tileDragAppearance: "target",
    fields: [
    {name:"picture", type:"image", imageURLPrefix:"../inlineExamples/tiles/images/"},
    {name:"commonName"}
    ]
});


isc.HLayout.create({
    membersMargin: 10,
    members: [
        isc.ListGrid.create({
                ID: "testGrid", autoDraw:false,
                width:300, height: 400,
                data: animalData,
                canDragRecordsOut: true,
                canAcceptDroppedRecords: true,
                canReorderRecords: true,
                fields: [
                {name:"commonName", title:"Common Name"},
                {name:"lifeSpan", title:"Lifespan"},
                {name:"status", title:"Status"}
                ]
        }),
        testList
   
    ]
});
