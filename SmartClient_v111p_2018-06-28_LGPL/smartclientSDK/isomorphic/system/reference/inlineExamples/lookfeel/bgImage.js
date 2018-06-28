isc.VStack.create({
    ID:"myBox", width:"100%", height:"100%", showEdges:true, layoutMargin:20, membersMargin:10,
    appImgDir:"backgrounds/",
    backgroundImage:"leather.jpg",
    members:[
        isc.IButton.create({title:"Brick", click:"myBox.setBackgroundImage('brick.jpg')"}),
        isc.IButton.create({title:"Stone", click:"myBox.setBackgroundImage('stone.jpg')"}),
        isc.IButton.create({title:"Metal", click:"myBox.setBackgroundImage('metal.jpg')"}),
        isc.IButton.create({title:"Leather", click:"myBox.setBackgroundImage('leather.jpg')"}),
        isc.IButton.create({title:"Beads", click:"myBox.setBackgroundImage('beads.jpg')"}),
        isc.IButton.create({title:"Emboss", click:"myBox.setBackgroundImage('emboss.jpg')"}),
        isc.IButton.create({title:"Brocade", click:"myBox.setBackgroundImage('brocade.jpg')"}),
        isc.IButton.create({title:"Leaves", click:"myBox.setBackgroundImage('leaves.jpg')"})
    ]
})
