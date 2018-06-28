function createSplitPane() {

    var detailPane = isc.DetailViewer.create({
        dataSource: "supplyItem",
        autoDraw:false
    });

    var listPane = isc.ListGrid.create({
        autoDraw:false,
        dataSource:"supplyItem"
    });
    if (isc.Browser.isTablet) {
        listPane.addProperties({fields:[{name:"itemName"}, {name:"unitCost"}, {name:"inStock"}]});
    }

    var navigationPane = isc.TreeGrid.create({
        autoDraw:false,
        dataSource: "supplyCategory", autoFetchData: true,
        showHeader: isc.Browser.isDesktop,
        selectionUpdated : function () {
            this.splitPane.setDetailTitle(null);
            detailPane.setData([]);
        }
    });

    var splitPane = isc.SplitPane.create({
        autoDraw:false,
        navigationTitle:"Categories",
        showLeftButton:false,
        showRightButton:false,
        border:"1px solid blue",
        detailPane:detailPane,
        listPane:listPane,
        navigationPane:navigationPane,
        autoNavigate:true,
        listPaneTitleTemplate:"${record.categoryName}",
        detailPaneTitleTemplate:"${index + 1} of ${totalRows}"
    });

    return splitPane;
}

isc.VLayout.create({
    width: "100%",
    height: "100%",
    members: [createSplitPane()]
});
