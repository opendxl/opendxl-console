isc.TileGrid.create({
    ID:"boundList",
    tileWidth:150,
    tileHeight:220,
    width: "100%",
    height:"100%",
    dataSource:"animals",
    autoFetchData:true,
    animateTileChange:true,
    fields: [
        {name:"picture"},
        {name:"commonName", cellStyle: "commonName"},
        {name:"lifeSpan", formatCellValue: "return 'Lifespan: ' + value;"},
        {   name:"status", 
            getCellStyle: function (value, field, record, viewer) {
                if (value == "Endangered") return "endangered";
                else if (value == "Threatened") return "threatened";
                else if (value == "Not Endangered") return "notEndangered";
                else return viewer.cellStyle;
            }
        }
    ],

    // override getTile() to add a "remove" button
    getTile : function (record) {
        var tile = this.Super("getTile", arguments);
        if (!tile.children) {
            // passed record may be an index
            record = this.getTileRecord(tile);
            tile.addChild(this.getRemoveButton(record));
        }
        return tile;
    },
    
    getRemoveButton : function (record) {
        var removeButton = isc.ImgButton.create({
            src: "[SKINIMG]/Tab/left/close.png",
            showHover: true,
            prompt: "Remove tile",
            size: 15,
            showFocused: false,
            showRollOver: false,
            snapTo: "TR",
            showDown: false,
            margin: 2,
            tileGrid: this,
            record: record,
            click : function () {
                animals.removeData(this.record);
            }
        });

        return removeButton;
    }
});

