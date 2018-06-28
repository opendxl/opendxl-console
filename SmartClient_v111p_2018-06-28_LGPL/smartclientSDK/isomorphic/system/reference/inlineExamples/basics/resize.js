isc.HTMLFlow.create({
    ID:"ajaxDefinition",
    top:50, width:75, height:45,
    overflow:"hidden", styleName:"exampleTextBlock", showEdges:true,
    contents:"<span class='exampleDropTitle'>Ajax&nbsp;&nbsp;</span> <b>A</b>synchronous <b>J</b>avaScript <b>A</b>nd <b>X</b>ML (AJAX) is a Web development technique for creating interactive <b>web applications</b>. The intent is to make web pages feel more responsive by exchanging small amounts of data with the server behind the scenes, so that the entire Web page does not have to be reloaded each time the user makes a change. This is meant to increase the Web page's <b>interactivity</b>, <b>speed</b>, and <b>usability</b>. (Source: <a href='http://www.wikipedia.org' title='Wikipedia' target='_blank'>Wikipedia</a>)"
})

isc.IButton.create({
    ID: "expandButton",
    title:"Expand",
    click:"ajaxDefinition.resizeBy(235,150);"
})

isc.IButton.create({
    ID: "collapseButton",
    left: 130,
    title:"Collapse",
    click:"ajaxDefinition.resizeTo(75,45);"
})
