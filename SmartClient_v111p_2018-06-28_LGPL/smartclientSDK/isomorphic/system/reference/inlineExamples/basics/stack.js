isc.defineClass("BlueBox", "Label").addProperties({
    align:"center",
    border:"1px solid #808080",
    backgroundColor:"lightblue",
    styleName:"blackText"
})

isc.VStack.create({
    showEdges:true,
    width:150, membersMargin:5,  layoutMargin:10,
    members:[
        isc.BlueBox.create({height:40, contents:"height 40"}),
        isc.BlueBox.create({height:80, contents:"height 80"}),
        isc.BlueBox.create({height:160, contents:"height 160"})
    ]
})

isc.HStack.create({
    left:170,
    showEdges:true,
    height:150, membersMargin:5,  layoutMargin:10,
    members:[
        isc.BlueBox.create({width:60, contents:"width 60"}),
        isc.BlueBox.create({width:120, contents:"width 120"}),
        isc.BlueBox.create({width:180, contents:"width 180"})
    ]
})
