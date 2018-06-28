htmlFragments = {
    ajax:"<hr><span class='exampleDropTitle'>Ajax&nbsp;&nbsp;</span> " +
        "<b>A</b>synchronous <b>J</b>avaScript <b>A</b>nd <b>X</b>ML (AJAX) " +
        "is a Web development technique for creating interactive <b>web applications</b>.<hr>",
    ria:"<hr><span class='exampleDropTitle'>RIA&nbsp;&nbsp;</span> " +
        "<b>R</b>ich <b>I</b>nternet <b>A</b>pplications (or RIA) are " +
        "<b>web applications</b> that have the features and functionality of " +
        "traditional <b>desktop applications</b>.<hr>",
    webapp:"<hr><span class='exampleDropTitle'>Web App&nbsp;&nbsp;</span> " +
        "In software engineering, a <b>web application</b> is an application that is " +
        "<b>accessed with a web browser</b> over a network such as the Internet or an intranet.<hr>"
}

isc.HTMLFlow.create({
    ID:"myTextBox",
    top:40, width:280,
    styleName:"exampleTextBlock",
    contents:htmlFragments.ajax
})

isc.IButton.create({
    left:10, width:80,
    title:"Ajax",
    click:"myTextBox.setContents(htmlFragments.ajax)"
})

isc.IButton.create({
    left:100, width:80,
    title:"RIA",
    click:"myTextBox.setContents(htmlFragments.ria)"
})

isc.IButton.create({
    left:190, width:80,
    title:"Web App",
    click:"myTextBox.setContents(htmlFragments.webapp)"
})
