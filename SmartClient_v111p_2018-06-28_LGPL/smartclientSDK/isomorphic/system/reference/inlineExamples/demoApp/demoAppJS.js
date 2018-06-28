// User Interface
// ---------------------------------------------------------------------

// Detail
// ------

isc.Label.create({
    ID:"editorMessage",
    autoDraw: false,
    width:"100%",
    height:"100%",
    align:"center",
    contents:"Select a record to edit, or a category to insert a new record into"
});

isc.DetailViewer.create({
    ID:"itemViewer",
    autoDraw:false,
    dataSource:"supplyItem",
    width:"100%",
    margin:"5",
    emptyMessage:"Select an item to view its details"
});

isc.DynamicForm.create({
    ID:"editForm",
    autoDraw:false,
    dataSource:"supplyItem",
    useAllDataSourceFields:true,
    fields:[
        {name:"SKU"},
        {name:"description", rowSpan:3, width:200},
        {name:"category", editorType:"PickTreeItem", dataSource:"supplyCategory",
         emptyMenuMessage:"No Sub Categories", canSelectParentItems:true},
        {name:"unitCost", editorType:"SpinnerItem", step:0.01},
        {name:"inStock"},
        {name:"nextShipment", useTextField:true, wrapTitle: false},
        {name:"savebtn", editorType:"ButtonItem", align:"center", 
         width:100, colSpan:4, title:"Save Item", click:"editForm.saveData()"}
    ],
    width:650,
    numCols:4,
    colWidths:[80,200,100,200],
    margin:5,
    cellPadding:5,
    autoFocus:false
});

isc.TabSet.create({
    ID:"itemDetailTabs",
    autoDraw:false,
    tabSelected: function() {
        if(pageLayout.currentPane == "detail") {
            itemList.updateDetails();
        }
    },

    // Function to clear out selected items' details
    clearDetails : function () {
        var selectedTab = this.getSelectedTabNumber();
        if (selectedTab == 0) {
            // View tab: show empty message
            itemViewer.setData();
        } else if (selectedTab == 1) {
            // Edit tab: show new record editor, or empty message
            if (categoryTree.getSelectedRecord() != null) {
                this.updateTab("editTab", editForm);
                editForm.editNewRecord({category:categoryTree.getSelectedRecord().categoryName});
            } else {
                this.updateTab("editTab", editorMessage);
            }
        }
    }

});


// List
// -------------------------------

isc.SearchForm.create({
    ID:"findForm",
    autoDraw:false,
    dataSource:"supplyItem",
    left:130,
    top:10,
    cellPadding:4,
    numCols:6,
    fields:[
        {name:"SKU"},
        {name:"itemName", editorType:"ComboBoxItem", optionDataSource:"supplyItem", 
        pickListWidth:250},
        {name:"findInCategory", editorType:"CheckboxItem", 
            title:"Use category", defaultValue:true, shouldSaveValue:false}
    ],
    
    // Function to actually find items
    findItems : function (categoryName) {
        var findValues;

        if (this.getValue('findInCategory') && categoryTree.selection.anySelected()) {
            // use tree category and form values
            if (categoryName == null) categoryName = categoryTree.getSelectedRecord().categoryName;
            findValues = {category:categoryName};
            isc.addProperties(findValues, this.getValues());

        } else if (categoryName == null) {
            // use form values only
            findValues = this.getValues();

        } else {
            // use tree category only
            findValues = {category:categoryName};
        }

        itemList.filterData(findValues);

        itemDetailTabs.clearDetails();

        if(pageLayout.currentPane == "navigation") pageLayout.showListPane();
    }
});

isc.IButton.create({
    ID:"findButton",
    autoDraw:false,
    title:"Find",
    left:25,
    top:16,
    width:80,
    click:"findForm.findItems();",
    icon:"demoApp/icon_find.png",
    iconWidth:16
});

isc.Canvas.create({
    ID:"findPane",
    autoDraw:false,
    height:60,
    overflow:"auto",
    styleName:"defaultBorder",
    children:[findForm, findButton]
});

isc.Menu.create({
    ID:"itemListMenu",
    autoDraw:false,
    data:[
        {title:"Add New Item",
            icon:"demoApp/icon_add.png",
            click:function () {
                itemList.selection.deselectAll();
                itemDetailTabs.selectTab(1);
                itemList.updateDetails();
            }
        },
        {isSeparator:true},
        {title:"Show Details",
            icon:"demoApp/icon_view.png",
            click:"itemDetailTabs.selectTab(0); itemList.updateDetails()"},
        {title:"Edit Item",
            icon:"demoApp/icon_edit.png",
            click:"itemDetailTabs.selectTab(1); itemList.updateDetails()"},
        {title:"Delete Item",
            icon:"demoApp/icon_delete.png",
            click:"itemList.removeSelectedData(); itemDetailTabs.clearDetails()"}
    ]
});

isc.ListGrid.create({
    ID:"itemList",
    autoDraw:false,
    dataSource:"supplyItem",
    useAllDataSourceFields:true,
    fields:[
        {name:"itemName", title:"Name", showHover:true},
        {name:"unitCost", 
         formatCellValue:"return isc.NumberUtil.toCurrencyString(parseFloat(value))", 
         editorType:"SpinnerItem", editorProperties:{step:0.01}},
        {name:"SKU", canEdit:false},
        {name:"description", showHover:true},
        {name:"category", canEdit:false},
        {name:"inStock", width:55, align:"center",
            formatCellValue : function (value, record, field, rowNum, colNum) {
                if (value) return isc.Canvas.imgHTML("demoApp/checked.png");
                else return isc.Canvas.imgHTML("demoApp/unchecked.png")
            }},
        {name:"nextShipment", showIf:"false"}
    ],
    canEdit:true,
    modalEditing:true,
    alternateRecordStyles:true,
    canDragRecordsOut:true,
    hoverWidth:200,
    hoverHeight:20,
    selectionType:"single",

    selectionUpdated : function (record, recordList) {
        if (itemList.getSelectedRecord() == null) {
            var categoryNode = categoryTree.getSelectedRecord();
            if (categoryNode != null) {
                findForm.findItems(categoryNode.categoryName);
            } else {
                itemDetailTabs.clearDetails();
            }
        }
    },

    recordClick : "this.updateDetails()",

    cellContextClick : "return itemListMenu.showContextMenu()",

    cellChanged : "this.updateDetails()",

    // Function to update details based on selection
    updateDetails : function () {

        // If we are in mobile device, add tabs here dynamically
        // (if we do it before this moment, I do not know why,
        // but the navigation pane do not display any entry)
        if(!isc.Browser.isDesktop &&
            (itemDetailTabs.tabs == null || itemDetailTabs.tabs.length==0)) {
            addTabs(itemDetailTabs);
        }

        var record = this.getSelectedRecord();
        if (record == null) return itemDetailTabs.clearDetails();
        
        if (itemDetailTabs.getSelectedTabNumber() == 0) {
            // View tab: show selected record
            itemViewer.setData(record) 
        } else {
            // Edit tab: edit selected record
            itemDetailTabs.updateTab("editTab", editForm);
            editForm.editRecord(record);
        }
        if(pageLayout.currentPane == "list") pageLayout.showDetailPane();
    }

});

function addTabs(tabSet) {
    tabSet.addTab({
        title:"View",
        pane:itemViewer,
        ID:"viewTab",
        width:70,
        icon:"demoApp/icon_view.png"});
    tabSet.addTab({
        title:"Edit",
        pane:editForm,
        ID:"editTab",
        width:70,
        icon:"demoApp/icon_edit.png"});
}

// Navigation
// -----------------------------------
isc.HTMLPane.create({
    ID:"helpCanvas",
    autoDraw:false,
    contentsURL:isc.Page.getIsomorphicDocsDir() + "/inlineExamples/demoApp/demoApp_helpText.html",
    overflow:"auto",
    styleName:"defaultBorder",
    padding:10
});

isc.TreeGrid.create({
    ID:"categoryTree",
    autoDraw:false,
    dataSource:"supplyCategory",
    showHeader:false,
    selectionUpdated : function (record, recordList) {
        if (categoryTree.getSelectedRecord() == null) {
            itemList.setData([]);
            itemDetailTabs.clearDetails();
        }
    },
    nodeClick : function (categoryTree, node, recordNum) {
        if (categoryTree.isSelected(node)) {
            findForm.findItems(node.categoryName);
        }
    },
    visibilityChanged : function(isVisible) {
        if(isVisible) {
            itemDetailTabs.selectTab(0);
            itemDetailTabs.clearDetails();
        }
    }
});


// Define application layout
// ---------------------------------------------------------------------
    isc.VLayout.create({
        ID:"detailPane",
        autoDraw: false,
        members:[itemDetailTabs]
    });

    isc.VLayout.create({
        ID:"listPane",
        autoDraw: false,
        members:[findPane, itemList]
    });
    
    isc.SectionStack.create({
        ID:"navigationPane",
        autoDraw: false,
        width:280,
        visibilityMode:"multiple",
        animateSections:true,
        sections:[
            {showHeader: false,
                autoShow:true,
                items:[categoryTree]},
            {title:"Instructions",
                autoShow:true,
                items:[helpCanvas],
                hidden: isc.Browser.isDesktop?false:true}
        ]
    });

    isc.SplitPane.create({
        ID:"pageLayout",
        width:"100%",
        height:"100%",
        autoDraw: true,
        navigationPane: navigationPane,
        navigationTitle:"Categories",
        listPane: listPane,
        listTitle:"Items",
        detailPane: detailPane,
        detailTitle:"Item Details",
        showLeftButton:false,
        showRightButton:false
    });

    // If we are in desktop, we can add safely tabs here
    if(isc.Browser.isDesktop) addTabs(itemDetailTabs);

// Custom logic: 
// When showing options in the combo-box, only show the options from the selected category
// if appropriate
findForm.getItem("itemName").addProperties({
    getPickListFilterCriteria : function () {
        var criteria = this.Super("getPickListFilterCriteria", arguments);
        if (this.form.getValue('findInCategory') && categoryTree.selection.anySelected()) {
            criteria.category = categoryTree.getSelectedRecord().categoryName;
        }
        return criteria
     }
     
});

// Call fetchData() on the tree to load the initially visible categories
// ---------------------------------------------------------------------

categoryTree.fetchData();
