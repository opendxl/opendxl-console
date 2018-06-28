function createCopyDialog () {

    var width = 525;
    var height = 300;

    var guidance = "Press Ctrl-C (\u2318C on Mac) or right click (Control-click on Mac) on the selected text to copy values, then paste into Excel.  Note that values in columns that are dates or numbers are correctly understood as dates and numbers in Excel.";

    var selection = countryList.selection.getSelectedCells() || [];
    if (selection.length === 0) return;

    var fieldNames = [];
    var firstRow = selection[0][0];
    for (var i = 0; i < selection.length; i++) {
        if (selection[i][0] != firstRow) break;
        fieldNames.add(countryList.getFieldName(selection[i][1]));
    }

    var settings = {
        fieldList: fieldNames,
        fieldSeparator: "\t",
        escapingMode: "double"
    };

    var resultsForm = isc.DynamicForm.create({

        numCols: 1,

        width: width,

        height: height,

        autoFocus: true,

        fields: [{ type: "text",
                   name: "guidance",
                   showTitle: false,
                   editorType: "StaticTextItem",
                   value: guidance
                 },
                 { type: "text",
                   name: "textArea",
                   canEdit: false,
                   showTitle: false,
                   height: "*",
                   width: "*",
                   editorType: "TextAreaItem" },
                 { type : "text",
                   name : "Done",
                   align: "center",
                   editorType: "ButtonItem",
                   title: "Done",
                   click: function (form) { form.close(); }
                 }],

        close : function () {
            this.dialog.hide();
            this.dialog.markForDestroy();
            this.dialog.removeItem(this);
        }

    });

    var records = countryList.getSelectedRecords();
    var text = countryList.dataSource.recordsAsText(records, settings);

    resultsForm.dialog = isc.Dialog.create({ 
        autoSize: true,
        showToolbar: false,
        canDragReposition: true,
        title: "Copy Cells",
        items: [ resultsForm ],
        isModal: true,
        showModalMask: true
    });

    resultsForm.textArea = resultsForm.getField("textArea");
    resultsForm.textArea.setValue(text);
    resultsForm.textArea.selectValue();

}

isc.Menu.create({
    ID: "copyContextMenu",
    data: [
        {title: "Copy",
         click : function () { createCopyDialog(); }}
    ],
    width: 150
});

isc.ListGrid.create({ 
    ID: "countryList",
    width: "100%",
    height: 288,
    canEdit: false,
    autoFetchData: true,
    canDragSelect: true,
    canSelectCells: true,
    dataSource: countryDS,
    contextMenu: copyContextMenu,

    cellContextClick : function () { 
        this.showContextMenu(); return false;
    }
});

isc.Button.create({ 
    top: 300, 
    left: 10,
    title: "Copy",
    click: function () { createCopyDialog(); }
});

