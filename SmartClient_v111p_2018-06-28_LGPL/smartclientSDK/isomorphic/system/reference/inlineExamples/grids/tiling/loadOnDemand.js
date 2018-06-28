isc.XJSONDataSource.create({
    ID:"yahooImageSearch",
    recordXPath:"/ResultSet/Result",
    dataURL:"http://api.search.yahoo.com/ImageSearchService/V1/imageSearch?appid=YahooDemo&output=json",
    titleField:"Title", iconField:"Thumbnail",
    fields:[
        {imageHeight:"imageHeight", imageWidth:"imageWidth", width:"150", type:"image", 
                   valueXPath:"Thumbnail/Url",name:"Thumbnail"},
        {type:"integer", hidden:true, valueXPath:"Thumbnail/Width", name:"imageWidth"},
        {type:"integer", hidden:true, valueXPath:"Thumbnail/Height", name:"imageHeight"},
        {name:"Title"},
        {name:"Summary"},
        {target:"_blank", type:"link", title:"Full Image", valueXPath:"Url", name:"FullImage"}
    ]
});

isc.SearchForm.create({
    ID:"searchForm",
    top: 40,
    numCols:3,
    items : [
        { name:"query", title:"Query", type:"text", defaultValue:"snowboarding" },
        { type:"button", title:"Search", click:"form.doFetch()", startRow:false }
    ],
    doFetch : function () {
        imageList.fetchData(searchForm.getValuesAsCriteria());
    }
});

isc.TileGrid.create({
        ID:"imageList",
        top:80,
        tileWidth:150,
        tileHeight:160,
        width:500,
        height:400,
        showAllRecords:true,
        dataSource:"yahooImageSearch",
        fields: [
            {name:"Thumbnail", type:"image", title:""},
            {name:"Title", title:""}
        ]        
});

searchForm.doFetch();


// required Yahoo attribution image
isc.HTMLFlow.create({
    ID: "YahooAttribution",
    height:31,
    contents: "<a href='http://developer.yahoo.net/about'>"
              +"<img src='http://l.yimg.com/a/i/us/nt/bdg/websrv_88_1.gif' border='0'>"
              +"</a>"
});
