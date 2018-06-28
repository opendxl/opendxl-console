isc.defineClass("BlueBox", "Label").addProperties({
    align:"center",
    border:"1px solid #808080",
    backgroundColor:"lightblue",
    styleName:"blackText"
})

isc.HLayout.create({
    width:"100%", height:"100%", membersMargin:20,
    members:[
        isc.VLayout.create({
            showEdges:true,
            width:150,
            membersMargin:5,  layoutMargin:10,
            members:[
                isc.BlueBox.create({height:50, contents:"height 50"}),
                isc.BlueBox.create({height:"*", contents:"height *"}),
                isc.BlueBox.create({height:"30%", contents:"height 30%"})
            ]
        }),      
        isc.HLayout.create({
            showEdges:true,
            height:150, membersMargin:5,  layoutMargin:10,
            members:[
                isc.BlueBox.create({width:50, contents:"width 50"}),
                isc.BlueBox.create({width:"*", contents:"width *"}),
                isc.BlueBox.create({width:"30%", contents:"width 30%"})
            ]
        })
    ]
})
