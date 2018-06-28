isc.ListGrid.create({
    ID: "orderList",
    width:700, height:240, 
    alternateRecordStyles:true,
    dataSource: orderDS,
    autoFetchData: true,
    canHover: true,
    showHover: true,
    showHoverComponents: true,
    // Set the hover size and activity
    hoverWidth:590,
    expansionRelatedProperties: {
        wrapCells: true,
        fixedRecordHeights: false,
        fields: [
            {name: "loggedBy", width:100},
            {name: "loggedDate", width:100},
            {name: "orderMessage", width:"*"}
        ]
	},
    // Define datasource for loading into the hover window
    hoverMode:"related",
    detailDS:"orderMessagesDS"
});

