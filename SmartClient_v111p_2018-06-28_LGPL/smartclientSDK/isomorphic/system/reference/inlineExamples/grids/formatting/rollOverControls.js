isc.ListGrid.create({
    ID:"countryList",
    width:520, height:224,
    data: countryData,
    selectionType:"single",
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    showRollOverCanvas:true,
    showRollUnderCanvas:false, // disable the rollUnderCanvas because we're not using it
    rollOverCanvasConstructor:isc.HLayout,
    rollOverCanvasProperties:{
        snapTo:"TR", height:20, width:55,
        members:[
            {_constructor:"Button", title:"+", 
             click:"isc.say('Expanded record:' + this.echo(this.parentElement.record))", 
             height:20, width:27},
            {_constructor:"Button", title:"-", 
             click:"isc.say('Collapsed record:' + this.echo(this.parentElement.record))",
             height:20, width:27}
        ]
    }
});
