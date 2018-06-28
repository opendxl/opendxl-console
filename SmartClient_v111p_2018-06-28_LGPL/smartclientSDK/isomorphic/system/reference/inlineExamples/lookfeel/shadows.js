exampleText = "When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation."


isc.Label.create({
    ID:"textBox",
    left:200, top:20, width:240, padding:10,
    contents:exampleText, backgroundColor: "white", border:"1px solid #c0c0c0",
    canDragReposition:true,
    showShadow: true,
    shadowSoftness: 10,
    shadowOffset: 5
})

isc.Slider.create({
    minValue:1, maxValue:10, numValues:11, showRange:false, labelWidth:40,
    title:"Softness", value:10,
    valueChanged: "textBox.shadowSoftness = value; textBox.updateShadow();"
})

isc.Slider.create({
    minValue:0, maxValue:20, numValues:21, showRange:false, labelWidth:40,
    title:"Offset", left:80, value:5,
    valueChanged: "textBox.shadowOffset = value; textBox.updateShadow();"
})

