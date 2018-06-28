isc.HTMLFlow.create({
    ID:"ajaxDefinition",
    autoDraw:false, width:75, height:45,
    overflow:"hidden", styleName:"exampleTextBlock", showEdges:true,
    contents:"<span class='exampleDropTitle'>Ajax&nbsp;&nbsp;</span> <b>A</b>synchronous <b>J</b>avaScript <b>A</b>nd <b>X</b>ML (AJAX) is a Web development technique for creating interactive <b>web applications</b>. The intent is to make web pages feel more responsive by exchanging small amounts of data with the server behind the scenes, so that the entire Web page does not have to be reloaded each time the user makes a change. This is meant to increase the Web page's <b>interactivity</b>, <b>speed</b>, and <b>usability</b>. (Source: <a href='http://www.wikipedia.org' title='Wikipedia' target='_blank'>Wikipedia</a>)",
    animateTime:800
});

isc.HLayout.create({
    ID:"hLayout",
    autoDraw:false,
    membersMargin: 10,
    members: [
        isc.IButton.create({
            title:"Expand",
            click:"ajaxDefinition.animateResize(310,195);"
        }),
        isc.IButton.create({
            title:"Collapse", left:120,
            click:"ajaxDefinition.animateResize(75,45);"
        })
    ]
});

isc.VLayout.create({
    membersMargin: 10,
    members: [
        hLayout,
        ajaxDefinition
    ]
});
