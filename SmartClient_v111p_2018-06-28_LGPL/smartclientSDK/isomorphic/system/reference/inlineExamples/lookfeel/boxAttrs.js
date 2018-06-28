exampleText = "When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation."


isc.VStack.create({ID:"outerBox", top:20, margin:25, border:"4px solid gray", members:[
    isc.HTMLFlow.create({
        ID:"textBox", width:240, contents:exampleText,
        border: "8px solid slateblue",
        padding: 10,
        margin: 4
    })
]}).draw(); // draw immediately, so the sliders can manipulate this box immediately


isc.Slider.create({
    ID: "marginSlider",
    minValue:0, maxValue:10, showRange:false, labelWidth:35,
    title:"Margin", value:4,
    valueChanged: "textBox.setMargin(value); textBox.markForRedraw();"
})

isc.Slider.create({
    ID: "paddingSlider",
    minValue:0, maxValue:10, showRange:false, labelWidth:35,
    title:"Padding", value:10,
    valueChanged: "textBox.setPadding(value); textBox.markForRedraw();"
})

isc.Slider.create({
    ID: "borderSlider",
    minValue:0, maxValue:10, showRange:false, labelWidth:35,
    title:"Border", value:8,
    valueChanged: function () {
        textBox.setBorder(this.value + 'px solid slateblue');
        textBox.markForRedraw();
    }
})

isc.HLayout.create({
    layoutLeftMargin: 15,
    membersMargin: 20,
    height: 220,
    members: [marginSlider, paddingSlider, borderSlider, outerBox]
})
