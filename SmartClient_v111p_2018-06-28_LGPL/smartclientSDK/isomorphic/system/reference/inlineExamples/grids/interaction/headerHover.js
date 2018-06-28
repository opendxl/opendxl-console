isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png",
            prompt:"Small image of national flag"
        },
        {name:"countryName", title:"Country",
            prompt:"Conventional short form of country name"
        },
        {name:"capital", title:"Capital",
            prompt:"Location of seat of government"
        },
        {name:"independence", title:"Nationhood", type:"date", width:100,
            prompt:"Date of sovereignty, founding, or other significant nationhood event"
        }
    ]
})
