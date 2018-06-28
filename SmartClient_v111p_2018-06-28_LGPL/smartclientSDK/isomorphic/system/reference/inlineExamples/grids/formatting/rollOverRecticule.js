isc.ListGrid.create({
    ID:"countryList",
    width:500, height:224,
    data: countryData,
    selectionType:"single",
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    
    showRollOverCanvas:true,
    rollOverCanvasConstructor:isc.StretchImg,
    rollOverCanvasProperties:{
        vertical:false, capSize:7,
        src:"other/cellOverRecticule.png"
    }
})
