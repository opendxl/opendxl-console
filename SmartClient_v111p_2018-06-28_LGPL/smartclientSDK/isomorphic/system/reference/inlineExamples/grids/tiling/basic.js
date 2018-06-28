isc.TileGrid.create({
    tileWidth:150,
    tileHeight:190,
    height:"100%",
    width:"100%",
    showAllRecords:true,
    data:animalData,
    fields: [
        {name:"picture", type:"image", imageURLPrefix:"../inlineExamples/tiles/images/"},
        {name:"commonName"},
        {name:"status"}
    ]
});
