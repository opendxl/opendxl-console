isc.HTMLFlow.create({
    ID: "htmlFlow",
    autoDraw: false,
    width:500,
    padding: 10,
    contents:"<h2>Asia</h2> <span style='font-size:12px;'>"+
        "Asia is the Earth's largest and most populous continent, located primarily "+
        "in the eastern and northern hemispheres.<p>"+
        "Below are some details about various countries in Asia.</span>"
});
isc.ListGrid.create({
    ID: "listGrid",
    autoDraw: false,
    width:500, minHeight: 90, 
    alternateRecordStyles:true,
    fields:[
        {name:"countryCode", title:"Flag", width:40, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country"},
        {name:"capital", title:"Capital"},
        {name:"continent", title:"Continent"}
    ],
    canResizeFields: true
});
listGrid.setData(countryData.findAll('continent','Asia'));

isc.HLayout.create({
    width: "100%",
    membersMargin: 15,
    members: [
        isc.VLayout.create({
            width:530,
            height: 320,
            border: "1px solid blue",
            overflow:"auto",
            layoutMargin: 5,
            members: [ htmlFlow, listGrid ]
        }),
        isc.VLayout.create({
            membersMargin: 15,
            members: [
                isc.Button.create({
                    autoDraw: false,
                    width: 140,
                    title: "Longer text",
                    click : function () {
                        htmlFlow.setContents("<h2>Asia</h2> <span style='font-size:12px;'> "+
                            "Asia is the Earth's largest and most populous continent, "+
                            "located primarily in the eastern and northern hemispheres. <p> "+
                            "Asia covers an area of "+
                            "44,579,000 square kilometers, about 30% of Earth's total land area and 8.7% of the "+
                            "Earth's total surface area. It has historically been home to the world's first "+
                            "modern civilizations and has always hosted the bulk of the planet's human population. "+
                            "<p>"+
                            "Below are some details about various countries in Asia.</span>");
                    }
                }),
                isc.Button.create({
                    autoDraw: false,
                    width: 140,
                    title: "Longest text",
                    click : function () {
                        htmlFlow.setContents("<h2>Asia</h2> <span style='font-size:12px;'> "+
                            "Asia is the Earth's largest and most populous continent, "+
                            "located primarily in the eastern and northern hemispheres. <p>"+
                            "Asia covers an area of 44,579,000 square kilometers, about 30% of Earth's total land "+
                            "area and 8.7% of the Earth's total surface area. "+
                            "<p>"+
                            "It has historically been home to the world's first "+
                            "modern civilizations and has always hosted the bulk of the planet's human population. "+
                            "<p>"+
                            " Asia is notable for not only overall large size and population, but unusually dense and "+
                            "large settlements as well as vast barely populated regions within the continent of 4.4 "+
                            "billion people. The boundaries of Asia are traditionally determined as that of Eurasia, "+
                            "as there is no significant geographical separation between Asia and Europe."+
                            "<p>"+
                            "Below are some details about various countries in Asia.</span>");
                    }
                }),
                isc.Button.create({
                    autoDraw: false,
                    width: 140,
                    title: "Show Input Dialog",
                    click : function () {
                        isc.HLayout.create({
                            ID: "layout",
                            autoDraw: "false",
                            layoutTopMargin: "15px;",
                            margin: "5px",
                            members: [
                                isc.Img.create({
                                    width:32, height:32,
                                    imageType: "normal",
                                    src: "[SKIN]/Dialog/say.png"
                                }),
                                isc.DynamicForm.create({
                                    width: "100%",
                                    numCols: 3,
                                    colWidths:[100,"*",40],
                                    fields: [
                                        {name: "username",
                                         title: "Enter your name",
                                         type: "text", wrapTitle: false,
                                         width:"*"
                                        },
                                        {type: "SpacerItem"}
                                    ]
                                })
                            ]
                        });
                        isc.Window.create({
                            title: "Sample Input Dialog",
                            autoDraw:true,
                            width:"80%",
                            autoCenter:true,
                            minWidth:400,
                            maxWidth:800,
                            items: [ layout ]
                        });
                    }
                })
            ]
        })
    ]
})
