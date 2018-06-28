isc.VLayout.create({width:"100%", height:"100%", members:[

    isc.HStack.create({height:50, layoutMargin:10, membersMargin:10, membersWidth:300, members:[
        isc.IButton.create({title:"Wikipedia: Ajax", autoFit: true,
                            click:"myPane.setContentsURL('http://en.wikipedia.org/wiki/Ajax_%28programming%29')"}),
        isc.IButton.create({title:"CIA World Factbook: USA", autoFit: true,
                            click:"myPane.setContentsURL('https://www.cia.gov/library/publications/the-world-factbook/geos/us.html')"})
    ]}),

    isc.HTMLPane.create({
        ID:"myPane",
        showEdges:true,
        contentsURL:"http://en.wikipedia.org/",
        contentsType:"page"
    })

]})
