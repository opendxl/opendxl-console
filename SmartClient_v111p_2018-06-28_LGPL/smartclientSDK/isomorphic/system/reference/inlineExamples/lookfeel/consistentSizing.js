exampleText = "<b>A</b>synchronous J</b>avaScript <b>A</b>nd <b>X</b>ML (AJAX) is a Web development technique for creating interactive web applications."

isc.HTMLPane.create({
    ID:"box1", left:20, top:100,
    contents: exampleText,
    overflow: "hidden",
    styleName: "padding5",
    showEdges: true
});

isc.HTMLPane.create({
    ID: "box2", left:240, top:100,
    contents: exampleText,
    overflow: "hidden",
    styleName: "padding10border5"
});

isc.HTMLPane.create({
    ID: "box3", left:460, top:100,
    contents: exampleText,
    overflow: "hidden",
    styleName: "padding5border5",
    showEdges: true
});

isc.Slider.create({
    title: "Resize",
    vertical: false,
    value:140, minValue:140, maxValue:200, showRange:false,
    valueChanged : function (value) {
        box1.setWidth(value);
        box1.setHeight(value);
        box2.setWidth(value);
        box2.setHeight(value);
        box3.setWidth(value);
        box3.setHeight(value);
    }
});