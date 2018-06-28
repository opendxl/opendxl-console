isc.VLayout.create({width:"100%", height:"100%", membersMargin:10, members:[
    isc.FormLayout.create({
        items:[
            {title:"Color picker", width:85, type:"color", change:"myBox.setBackgroundColor(value)"}
        ]
    }),
    isc.Label.create({
        ID:"myBox",
        overflow:"hidden", showEdges:true,
        align:"center", styleName:"exampleTitle",
        contents:"Color box"
    })
]})
