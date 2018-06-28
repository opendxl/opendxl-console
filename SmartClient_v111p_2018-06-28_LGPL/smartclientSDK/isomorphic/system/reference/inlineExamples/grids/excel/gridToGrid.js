isc.defineClass("GridCanvas", "VLayout").addProperties({

    GRID_FIELD_NAMES: [ "A", "B", "C", "D", "E", "F", "G" ],

    addButtons : function () {
        var MEMBER_ALIGNMENT = [ "left", "center", "right" ];

        var grid = this.grid;

        var layout = isc.HLayout.create({
            margin: 10,
            membersMargin: 10,
            width: "100%",
            layoutAlign: "center",
            align: MEMBER_ALIGNMENT[this.orderNumber],
            members: [
                isc.IButton.create({
                    title: "Copy",
                    click: function () { 
                        listGridSheets.data = grid.getSelectedCellData();
                    }}),
                isc.IButton.create({
                    title: "Paste",
                    click: function () { 
                        grid.applyCellData(listGridSheets.data);
                    }})]
        });
        this.addMember(layout);
    },

    initWidget : function () {
        this.Super("initWidget", arguments);

        var i, fields = [];
        for (i = 0; i < this.GRID_FIELD_NAMES.length; i++) {
            fields.add({
                name: this.GRID_FIELD_NAMES[i]
            });
        }
        var data = [];
        for (i = 0; i < 10; i++) {
            data.add({});
        }
        if (this.orderNumber === 0) {
            data[2].B = "text1";
            data[2].E = "text2";
            data[4].C = "text3";
            data[7].G = "text4";
            data[5].A = "text5";
            data[5].F = "text6";
        }
        this.grid = isc.ListGrid.create({
            ID: "tabGrid" + this.orderNumber,
            data: data,
            canvas: this,
            canEdit: true,
            width: "100%",
            fields: fields,
            canSelectAll: true,                                            
            canDragSelect: true,
            canSelectCells: true,
            leaveScrollbarGap: false,
            autoFitData: "vertical"
        });
        this.addMember(this.grid);
        this.addButtons();
    }
});

isc.TabSet.create({
    ID: "listGridSheets",
    height: "100%",
    width: "100%"
});

for (var i = 0 ; i < 3; i++) {
    var canvas = isc.GridCanvas.create({
        orderNumber: i,
        overflow: "visible"
    });
    listGridSheets.addTab({
        title: "Sheet " + (i + 1),
        pane: canvas
    });
}
