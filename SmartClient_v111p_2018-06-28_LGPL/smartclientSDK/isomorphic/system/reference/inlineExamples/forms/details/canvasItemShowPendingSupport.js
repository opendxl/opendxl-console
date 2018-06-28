isc.defineClass("MyProgressbarItem", "CanvasItem").addProperties({
    progressbarConstructor: "Progressbar",
    progressbarDefaults: {
        canFocus: true,
        cursor: "pointer",
        showTitle: true,
        titleStyle: "myProgressbarItemTitle",

        _storeValue : function (newPercentDone) {
            this.setTitle("Project progress: " + newPercentDone + "%");
            this.setPercentDone(newPercentDone);

            var myProgressbarItem = this.canvasItem;
            myProgressbarItem.storeValue(newPercentDone);
        },

        click : function () {
            var offsetX = this.getOffsetX();
            var newPercentDone = Math.round(offsetX / this.getVisibleWidth() * 100);
            newPercentDone = Math.max(0, Math.min(newPercentDone, 100));
            this._storeValue(newPercentDone);
        },

        keyPress : function () {
            // http://www.w3.org/TR/wai-aria-practices/#slider
            var keyName = isc.EventHandler.getKey();
            if (keyName === "Arrow_Right" ||
                keyName === "Arrow_Up")
            {
                var currentPercentDone = this.percentDone;
                if (currentPercentDone < 100) this._storeValue(currentPercentDone + 1);

            } else if (keyName === "Arrow_Left" ||
                       keyName === "Arrow_Down")
            {
                var currentPercentDone = this.percentDone;
                if (currentPercentDone > 0) this._storeValue(currentPercentDone - 1);

            } else if (keyName === "Home") {
                if (this.percentDone != 0) this._storeValue(0);

            } else if (keyName === "End") {
                if (this.percentDone != 100) this._storeValue(100);
            }
        }
    },

    createCanvas : function (form, self) {
        return this.createAutoChild("progressbar", {
            // Elements with role="progressbar" are read-only, so if this item is editable, use
            // role="slider" to reflect that the percent done can be changed.
            // http://www.w3.org/TR/wai-aria/roles#progressbar
            ariaRole: this.getCanEdit() ? "slider" : "progressbar"
        });
    },

    canEditChanged : function (canEdit) {
        var progressbar = this.canvas;
        progressbar.setProperty("ariaRole", canEdit ? "slider" : "progressbar");
    },

    pendingStatusChanged : function (form, self, pendingStatus, newValue, value) {
        var progressbar = this.canvas;
        progressbar.setTitleStyle(pendingStatus ? "myProgressbarItemTitlePending" : "myProgressbarItemTitle");
        return false;
    },

    showValue : function (displayValue, dataValue, form, self) {
        var progressbar = this.canvas;
        progressbar.setTitle("Project progress: " + dataValue + "%");
        progressbar.setPercentDone(dataValue);
    }
});

var form = isc.DynamicForm.create({
    autoDraw: false,
    width: 500,
    colWidths: [150, "*"],
    revertValueKey: "Escape",
    items: [{
        name: "progress",
        title: "Click to set progress",
        editorType: "MyProgressbarItem",
        height: 25,
        shouldSaveValue: true,
        showPending: true,
        value: 75
    }, {
        editorType: "ButtonItem",
        title: "Remember Current Value",
        click : function (form, self) {
            form.rememberValues();
        }
    }]
});

isc.HStack.create({
    width: "100%",
    membersMargin: 20,
    members: [form]
});
