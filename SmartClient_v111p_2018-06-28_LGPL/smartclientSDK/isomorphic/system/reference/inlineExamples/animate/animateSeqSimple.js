isc.HTMLFlow.create({
    ID:"ajaxDefinition",
    top:50, width:75, height:45,
    overflow:"hidden", styleName:"exampleTextBlock", showEdges:true,
    contents:"<span class='exampleDropTitle'>Ajax&nbsp;&nbsp;</span> <b>A</b>synchronous <b>J</b>avaScript <b>A</b>nd <b>X</b>ML (AJAX) is a Web development technique for creating interactive <b>web applications</b>. The intent is to make web pages feel more responsive by exchanging small amounts of data with the server behind the scenes, so that the entire Web page does not have to be reloaded each time the user makes a change. This is meant to increase the Web page's <b>interactivity</b>, <b>speed</b>, and <b>usability</b>. (Source: <a href='http://www.wikipedia.org' title='Wikipedia' target='_blank'>Wikipedia</a>)",
    animateTime:800
});

isc.HLayout.create({
    membersMargin:10,
    members: [
        isc.IButton.create({
            ID:"expandBtn",
            title:"Expand",
            click: function () {
                this.disable();
                ajaxDefinition.animateResize(310,45,
                    // this script will execute when the first part of the animation completes
                    'ajaxDefinition.animateResize(310,195); collapseBtn.enable();'
                );
            }
        }),
        isc.IButton.create({
            ID:"collapseBtn",
            title:"Collapse", left:120,
            disabled:true,
            click: function () {
                this.disable();
                ajaxDefinition.animateResize(310,45,
                    // this script will execute when the first part of the animation completes
                    'ajaxDefinition.animateResize(75,45); expandBtn.enable();'
                );
            }
        })
    ]
});
