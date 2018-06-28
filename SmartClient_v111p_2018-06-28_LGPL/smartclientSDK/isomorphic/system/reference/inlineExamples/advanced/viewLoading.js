isc.TabSet.create({
    top:40, width:400, height:250,
    tabs:[
        { title:"Tab1",
          pane:isc.Canvas.create({ autoDraw:false, contents:"Contents of Tab1"} )
        },
        { title:"Tab2",
          pane:isc.ViewLoader.create({
            autoDraw:false,
            viewURL:isc.Page.getIsomorphicDocsDir()+"inlineExamples/advanced/loadedView.js",
            loadingMessage:"Loading Grid.."
          })
        }
    ]
});
