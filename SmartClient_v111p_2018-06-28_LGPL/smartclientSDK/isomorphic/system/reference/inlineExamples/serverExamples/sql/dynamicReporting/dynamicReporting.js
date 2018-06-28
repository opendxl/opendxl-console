isc.DynamicForm.create({
    ID: "orderItemCriteriaForm",
    numCols: 2, width: 400,
    autoDraw: false,
    fields: [
        {name: "startDate", type: "date", title: "Start&nbsp;Date", defaultValue: new Date(2016, 1, 1)},
        {name: "endDate", type: "date", title: "End&nbsp;Date", defaultValue: new Date(2017, 1, 31) },
        {
            name: "filterButton",
            title: "Filter",
            type: "button",
            endRow: false, startRow: false,
            click: function() {
                var criteria = orderItemSummaryList.getFilterEditorCriteria(true);
                if (!criteria) criteria = {};
                criteria = isc.DataSource.combineCriteria(criteria, orderItemCriteriaForm.getValuesAsCriteria());
                orderItemSummaryList.filterData(criteria);
            }
        }
    ]
});

isc.ListGrid.create({
    ID: "orderItemSummaryList",
    width:650, height:184, alternateRecordStyles:true, 
    autoDraw: false,
    dataSource: dynamicReporting_orderItem,
	// Switch off client-side filtering - it can't work because the criteria contains filter
	// values for "startDate" and "endDate", but the data that the client sees is summarized
	// and does not contain those fields.  With this in place, every filter request will 
	// result in a server visit.
	dataProperties: {useClientFiltering: false},
    fetchOperation: "summary",
    fields:[
        {name: "itemID", displayField: "itemName", align: "left",
         title: "Item Name", width: "50%", 
         filterEditorType: "TextItem", 
         filterEditorProperties: {fetchMissingValues: false}
        },
        {name: "SKU"},
        {name: "unitCost"},
        {name: "quantity", title: "Total qty", canFilter: false},
        {name: "totalSales", canFilter: false, width: 100, formatCellValue: function(value) {
            return value == null ? "" : Math.round(value*100)/100;
        }
        }
    ],
    showFilterEditor: true
});

isc.IButton.create({
	ID: "orderItemExportButton",
	title: "Export Data",
	click: "orderItemSummaryList.exportData({operationId: 'summary'});"
});

isc.VLayout.create({
    membersMargin: 20,
    members: [orderItemCriteriaForm, orderItemSummaryList, orderItemExportButton]
});

orderItemSummaryList.fetchData(orderItemCriteriaForm);
