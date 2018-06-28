function makeSectorsForm() {
    var numSectors = gauge.getNumSectors();
    var items = new Array(numSectors);
    for (var i = 0; i < numSectors; ++i) {
        items[i] = {
            name: "colorpick_sector" + (i + 1) + "Color",
            title: "Sector " + (i + 1),
            type: "color",
            _sectorIndex: i,
            changed : function (form, colorItem, value) {
                gauge.setSectorFillColor(this._sectorIndex, colorItem.getValue());
            },
            icons: numSectors == 1 ? [] : [
                {
                    src: "[SKIN]/actions/remove.png",
                    endRow: true,
                    click : (function (sectorIndex) {
                        return function (form, item) {
                            if (numSectors > 1) {
                                gauge.removeSector(sectorIndex);
                                makeSectorsForm();
                            }
                        };
                    })(i)
                }
            ]
        };
    }

    sectorsForm.setItems(items);
    for (var i = 0; i < numSectors; ++i) {
        var colorItem = items[i];
        var fillColor = gauge.getSectorFillColor(i);
        colorItem.setDefaultValue(fillColor);
        colorItem.setValue(fillColor);
    }
}

function updateGaugeValueConfigItem() {
    var gaugeValueConfigItem = window.ID_gaugeSample_gaugeValueConfigItem;
    gaugeValueConfigItem.setMinValue(gauge.minValue);
    gaugeValueConfigItem.setMaxValue(gauge.maxValue);
    var value = gauge.value;
    gaugeValueConfigItem.setValue(value);
}

var gauge = isc.Gauge.create({
    autoDraw: false,
    width: 400,
    height: "100%",
    numMajorTicks: 11,
    numMinorTicks: 101,
    value: 45,
    sectors: [{value: 10, fillColor: "#E33B35"},
              {value: 30, fillColor: "#ED5450"},
              {value: 60, fillColor: "#FCBE29"},
              {value: 90, fillColor: "#0889C6"},
              {value: 100, fillColor: "#3AACE1"}]
});

var configForm = isc.DynamicForm.create({
    autoDraw: false,
    padding: 5,
    numCols: 3,
    colWidths: [165, "*", 135],
    width: 500,
    isGroup: true,
    groupTitle: "Configuration",
    autoFocusOnError: false,
    overflow: "hidden",
    items: [
        {
            name: "chkbox_drawnClockwise",
            title: "Draw Clockwise?",
            type: "boolean",
            endRow: true,
            value: gauge.drawnClockwise,
            changed : function (form, drawnClockwiseConfigItem, value) {
                gauge.setDrawnClockwise(value);
            }
        }, {
            name: "text_minValue",
            title: "Min. Value",
            type: "text",
            endRow: true,
            defaultValue: gauge.minValue,
            validators: [{
                type: "required"
            }, {
                type: "isFloat"
            }, {
                type: "custom",
                dependentFields: ["text_maxValue"],
                errorMessage: "Must be at least 1 less than the max value.",
                condition : function (item, validator, value, record) {
                    return (parseFloat(value) <= parseFloat(record.text_maxValue) - 1);
                }
            }],
            validateOnExit: true,
            editorExit : function (form, self, minValue) {
                if (!form.hasFieldErrors(self.name) &&
                    !form.hasFieldErrors("text_maxValue"))
                {
                    var maxValueItem = form.getItem("text_maxValue"),
                        maxValue;
                    minValue = parseFloat(minValue);
                    maxValue = parseFloat(maxValueItem.getValue());
                    gauge.setMinValue(minValue);
                    gauge.setMaxValue(maxValue);
                    updateGaugeValueConfigItem();
                    makeSectorsForm();
                }
            }
        }, {
            name: "text_maxValue",
            title: "Max. Value",
            type: "text",
            endRow: true,
            defaultValue: gauge.maxValue,
            validators: [{
                type: "required"
            }, {
                type: "isFloat"
            }, {
                type: "custom",
                dependentFields: ["text_minValue"],
                errorMessage: "Must be at least 1 greater than the min value.",
                condition : function (item, validator, value, record) {
                    return (parseFloat(record.text_minValue) <= parseFloat(value) - 1);
                }
            }],
            validateOnExit: true,
            editorExit : function (form, self, maxValue) {
                if (!form.hasFieldErrors("text_minValue") &&
                    !form.hasFieldErrors(self.name))
                {
                    var minValueItem = form.getItem("text_minValue"),
                        minValue;
                    minValue = parseFloat(minValueItem.getValue());
                    maxValue = parseFloat(maxValue);
                    gauge.setMinValue(minValue);
                    gauge.setMaxValue(maxValue);
                    updateGaugeValueConfigItem();
                    makeSectorsForm();
                }
            }
        }, {
            name: "text_numMajorTicks",
            title: "# Major Ticks",
            type: "text",
            endRow: true,
            value: gauge.numMajorTicks + "",
            validators: [{
                type: "required"
            }, {
                type: "isInteger"
            }],
            validateOnExit: true,
            editorExit : function (form, self, numMajorTicks) {
                if (!form.hasFieldErrors(self.name)) {
                    var num = parseInt(numMajorTicks);
                    gauge.setNumMajorTicks(num);
                }
            }
        }, {
            name: "text_numMinorTicks",
            title: "# Minor Ticks",
            type: "text",
            endRow: true,
            value: gauge.numMinorTicks + "",
            validators: [{
                type: "required"
            }, {
                type: "isInteger"
            }],
            validateOnExit: true,
            editorExit : function (form, self, numMinorTicks) {
                if (!form.hasFieldErrors(self.name)) {
                    var num = parseInt(numMinorTicks);
                    gauge.setNumMinorTicks(num);
                }
            }
        }, {
            name: "text_labelPrefix",
            title: "Label Prefix",
            type: "text",
            endRow: true,
            value: gauge.labelPrefix,
            editorExit : function (form, self, labelPrefix) {
                gauge.setLabelPrefix(labelPrefix);
            }
        }, {
            name: "text_labelSuffix",
            title: "Label Suffix",
            type: "text",
            endRow: true,
            value: gauge.labelSuffix,
            editorExit : function (form, self, labelSuffix) {
                gauge.setLabelSuffix(labelSuffix);
            }
        }, {
            name: "text_newSectorValue",
            title: "New Sector - Value",
            wrapTitle: false,
            type: "text",
            validators: [{
                type: "required"
            }, {
                type: "isFloat"
            }, {
                type: "custom",
                errorMessage: "Must be between the min and max values.",
                condition : function (item, validator, value, record) {
                    value = parseFloat(value);
                    if (!isc.isA.Number(value)) return false;
                    return (parseFloat(record.text_minValue) <= value && value <= parseFloat(record.text_maxValue));
                }
            }],
            validateOnExit: true,
            endRow: false
        }, {
            name: "button_addSector",
            title: "Add Sector",
            type: "button",
            startRow: false,
            width: "*",
            click : function (form, self) {
                var newSectorValueTextItem = form.getItem("text_newSectorValue"),
                    value = newSectorValueTextItem.getValue();
                if (value != null && !isc.isAn.emptyString(value) && !form.hasFieldErrors(newSectorValueTextItem.name)) {
                    var value = parseFloat(newSectorValueTextItem.getValue());
                    newSectorValueTextItem.setValue();
                    gauge.addSector(value);
                    makeSectorsForm();
                }
            }
        }, {
            ID: "ID_gaugeSample_gaugeValueConfigItem",
            name: "slider_gaugeValue",
            title: "Value",
            type: "slider",
            colSpan: 2,
            width: "*",
            changed : function (form, self, value) {
                var val = parseFloat(value);
                gauge.setValue(val);
            }
        }
    ]
});

var sectorsForm = isc.DynamicForm.create({
    autoDraw: false,
    padding: 5,
    numCols: 2,
    width: 275,
    isGroup: true,
    groupTitle: "Sectors",
    // Allow scrollbars in case more than around 15 sectors are added.
    overflow: "auto"
});

updateGaugeValueConfigItem();
makeSectorsForm();

isc.HLayout.create({
    width: "100%",
    height: 400,
    members: [gauge, configForm, sectorsForm]
});
