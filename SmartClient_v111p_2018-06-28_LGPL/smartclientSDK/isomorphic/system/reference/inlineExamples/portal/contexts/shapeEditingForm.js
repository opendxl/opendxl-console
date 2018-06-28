isc.DynamicForm.create({
    autoDraw: false,
    ID: "drawItemProperties",
    width: "100%",
    numCols: 8,
    colWidths: [100,100,100,50,50,50,50,50],
    titleOrientation: "top",
    fields: [
        { name: "lineColor", title: "Line color",
            type: "color", supportsTransparency: true,
            pickerColorSelected : function (color, opacity) {
                this.Super("pickerColorSelected", arguments);
                this.form.setPropertyOnSelection("lineColor", color);
                this.form.setPropertyOnSelection("lineOpacity", opacity != null ? 
                                                                opacity/100 : 1);
            }
        },
        { name: "fillColor", title: "Fill color",
            type: "color", supportsTransparency: true,
            pickerColorSelected : function (color, opacity) {
            this.Super("pickerColorSelected", arguments);
                this.form.setPropertyOnSelection("fillGradient", null);
                this.form.setPropertyOnSelection("fillColor", color);
                this.form.setPropertyOnSelection("fillOpacity", opacity != null ?
                                                                opacity/100 : 1);
            }
        },
        { name: "arrows", title: "Arrows",
            type: "select",
            valueMap: [ "None", "Start", "End", "Both" ],
            changed : function (form, item, value) {
                this.form.setPropertyOnSelection("startArrow", (value == "Start" || value == "Both" ? "block" : null));
                this.form.setPropertyOnSelection("endArrow", (value == "End" || value == "Both" ? "block" : null));
            }
        },
        { editorType: "SpacerItem", showTitle: false },
        { name: "sendToBack", title: "Send to back", vAlign: "bottom",
            type: "button", startRow: false, endRow: false,
            click: function () {
                var selection = this.form.getSelectedItems();
                if (!selection) return;
                for (var ri = selection.length; ri > 0; --ri) {
                    selection[ri - 1].sendToBack();
                }
            }
        },
        { name: "bringToFront", title: "Bring to front", vAlign: "bottom",
            type: "button", startRow: false, endRow: false,
            click: function () {
                var selection = this.form.getSelectedItems();
                if (!selection) return;
                for (var i = 0, numItems = selection.length; i < numItems; ++i) {
                    selection[i].bringToFront();
                }
            }
        },
        { editorType: "SpacerItem", showTitle: false },
        { name: "removeItem", title: "Remove", vAlign: "bottom",
            type: "button", startRow: false, endRow: false,
            click: function () {
                this.form.removeItem();
            }
        },
    ],
    initWidget : function () {
        this.Super("initWidget", arguments);

        // Set initial field values/state 
        this.selectedEditNodesUpdated();
    },
    removeItem : function () {
        var selection = this.getSelectedNodes();
        if (!selection) return;
        for (var i = 0; i < selection.length; i++) {
            var node = selection[i];

            // Remove node from editContext and destroy it
            this.editContext.removeNode(node);
            node.liveObject.destroy();
        }
    },
    setPropertyOnSelection : function (property, value) {
        var selection = this.getSelectedNodes();
        if (!selection) return;
        var properties = {};
        for (var i = 0; i < selection.length; i++) {
            var node = selection[i];
            properties[property] = value;
            this.editContext.setNodeProperties(node, properties);
            if (value == null) {
                // Remove property when null - set to null above to trigger
                // UI change
                this.editContext.removeNodeProperties(node, [property]);
            }
        }
    },
    getSelectedItems : function () {
        return (this.editContext ? this.editContext.getSelectedComponents() : []);
    },
    getSelectedNodes : function () {
        return (this.editContext ? this.editContext.getSelectedEditNodes() : []);
    },
    selectedEditNodesUpdated : function () {
        var selection = this.getSelectedNodes();
        if (selection.length == 0 || selection.length > 1 || isc.isA.DrawPane(selection[0])) {
            // No selection or multiple selection
            this.getField("lineColor").disable();
            this.getField("fillColor").disable();
            this.getField("arrows").disable();
            var disabled = (selection.length == 0);
            this.getField("sendToBack").setDisabled(disabled);
            this.getField("bringToFront").setDisabled(disabled);
            this.getField("removeItem").setDisabled(disabled);

            this.clearValue("lineColor");
            this.clearValue("fillColor");
            this.clearValue("arrows");
        } else {
            this.getField("sendToBack").enable();
            this.getField("bringToFront").enable();
            this.getField("removeItem").enable();

            // Enable only property controls that are applicable to selection
            var item = selection[0].liveObject,
                itemClass = item.getClass(),
                supportsStartArrow = item.supportsStartArrow(),
                supportsEndArrow = item.supportsEndArrow()
            ;
            this.getField("lineColor").setDisabled(!itemClass.isMethodSupported("setLineColor"));
            this.getField("fillColor").setDisabled(!itemClass.isMethodSupported("setFillColor"));
            this.getField("arrows").setDisabled(!supportsStartArrow && !supportsEndArrow);

            // Update the arrow selections based on the item's support
            var arrowsValueMap = [ "None" ];
            if (supportsStartArrow) arrowsValueMap.add("Start");
            if (supportsEndArrow) arrowsValueMap.add("End");
            if (supportsStartArrow && supportsEndArrow) arrowsValueMap.add("Both");
            this.getField("arrows").setValueMap(arrowsValueMap);

            // Update the form with current values
            var arrows = (item.startArrow && item.endArrow ? "Both" : (item.startArrow ? "Start" : (item.endArrow ? "End" : "None")));
            this.setValue("lineColor", item.lineColor);
            this.setValue("fillColor", item.fillColor);
            this.setValue("arrows", arrows);
        }
    }
});


// The editCanvas is the root component in which the items can be placed.
// This canvas will not be serialized - only the child nodes.
isc.Canvas.create({
    ID: "editCanvas",
    border: isc.EditPane.getInstanceProperty("border"),
    width: "100%",
    height: "100%",
    canFocus: true,
    keyPress: function () {
        if (isc.EventHandler.getKey() == "Delete") {
            drawItemProperties.removeItem();
        }
    }
});
