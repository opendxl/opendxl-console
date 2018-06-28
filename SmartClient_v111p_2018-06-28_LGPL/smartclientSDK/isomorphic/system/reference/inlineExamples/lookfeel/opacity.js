isc.Img.create({
    ID:"eyesImg",
    width:360, height:188,
    src:"other/eyes.jpg",
    showEdges:true,
    useOpacityFilter:true
})

isc.Slider.create({
    minValue:0, maxValue:100, showRange:false, showTitle:false, vertical:false,
    left:80, top:200, value:100,
    valueChanged: "eyesImg.setOpacity(value)"
})
