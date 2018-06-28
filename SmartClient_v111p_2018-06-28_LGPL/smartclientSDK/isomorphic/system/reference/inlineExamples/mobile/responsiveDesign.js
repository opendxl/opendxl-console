function createSplitPane(deviceMode) {

    var splitPane = isc.SplitPane.create({
        autoDraw:false,
        deviceMode: deviceMode,
        navigationTitle:"Categories",
        showLeftButton:false,
        showRightButton:false,
        border:"1px solid blue"
    });

    var detailPane = isc.DetailViewer.create({
        dataSource: "supplyItem",
        autoDraw:false
    });

    var listPane = isc.ListGrid.create({
        dataSource:"supplyItem",
        autoDraw:false,
        recordClick : function (grid, record, rowNum) {
            detailPane.viewSelectedData(this);
            splitPane.showDetailPane((rowNum+1) + " of " + grid.getTotalRows(), null, "forward");
        }
    });
    if (deviceMode === "tablet") {
    	listPane.addProperties({fields:[{name:"itemName"}, {name:"unitCost"}, {name:"inStock"}]});
    }

    var navigationPane = isc.TreeGrid.create({
        autoDraw:false,
        dataSource: "supplyCategory", autoFetchData: true,
        showHeader: deviceMode == "desktop",

        nodeClick : function (grid, record) {
            listPane.fetchRelatedData(record, this);
            splitPane.showListPane(record.categoryName, null, "forward");
        }
    });


    splitPane.setDetailPane(detailPane);
    splitPane.setNavigationPane(navigationPane);
    splitPane.setListPane(listPane);

    // Create framing for each SplitPane instance
    // ---------------------------------------------------------------------------------------
    var flipButton = isc.IButton.create({
        autoFit:true,
        getTitle : function () {
            return "Flip (" + splitPane.getPageOrientation() + ")";
        },
        click : function () {
            var newOrientation = splitPane.getPageOrientation() == "landscape" ?
                         "portrait" : "landscape";
                
            splitPane.setPageOrientation(newOrientation);
            splitPane.updateUI();
            this.markForRedraw();
        }
    });
    var container = isc.VLayout.create({
        layoutMargin:10,
        membersMargin : 2,
        members: [flipButton, splitPane]
    })

    return container;
}

isc.TabSet.create({
    width: "100%",
    height: "100%",
    tabs: [
        {title: "desktop", pane: createSplitPane("desktop")},
        {title: "tablet", pane: createSplitPane("tablet")},
        {title: "handset", pane: createSplitPane("handset")}
    ]
});
