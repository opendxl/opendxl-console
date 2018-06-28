window.chunksPath = isc.Page.getIsomorphicDocsDir() + "inlineExamples/html/chunks/";

isc.HTMLFlow.create({
    ID:"myTextBox",
    top:40, width:280,
    styleName:"exampleTextBlock",
    contentsURL:chunksPath + "ajax.html"
})

isc.HTMLPane.create({
    left:300, top:40,
    width:280, height:200, showEdges:true,
    styleName:"exampleTextBlock",
    contentsURL:chunksPath + "glossary.html",
    selectContentOnSelectAll:true
})

isc.IButton.create({
    left:10, width:80,
    title:"Ajax",
    click:"myTextBox.setContentsURL(chunksPath + 'ajax.html')"
})

isc.IButton.create({
    left:100, width:80,
    title:"GUI",
    click:"myTextBox.setContentsURL(chunksPath + 'gui.html')"
})

isc.IButton.create({
    left:190, width:80,
    title:"RIA",
    click:"myTextBox.setContentsURL(chunksPath + 'ria.html')"
})
