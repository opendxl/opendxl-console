function createFields (fieldCount) {
    var fields = [];
    for(var i = 1; i <= fieldCount; i++) {
        fields.add({name: "field" + i, title: "Field " + i, showIf: "false"});
    }
    return fields;
}

function createRecords (recordCount, fields) {
    var records = [];
    for (var i = 0; i < recordCount; i++) {
        var record = {};
        for (var j = 0; j < fields.length; j++) {
            record[fields[j].name] = "Row " + i + ", Value " + (j+1);
        }
        records.add(record);
    }
    return records;
}

function getOrderedFields(fields) {
    var initialFieldIndices = [ 20, 5, 197, 59, 17, 120, 152, 91, 37, 101, 40, 9, 174, 29, 163 ],
        i, orderedFields = [];

    for (i = 0; i < initialFieldIndices.length; i++) {
        var field = fields.find("name", "field" + initialFieldIndices[i]);
        orderedFields.add(field);
        delete field.showIf;
    }

    for (i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (field.showIf != null) orderedFields.add(field);
    }

    return orderedFields;
}

var fields = createFields(200);

isc.ListGrid.create({
    ID: "pickableFields",

    autoFitData: "both",
    autoFitMaxRecords: 20,
    autoFitMaxColumns: 8,
    autoFitFieldWidths: true,
    canEditTitles: true,

    useAdvancedFieldPicker: true,
    fieldPickerFieldProperties: [ "frozen" ],

    fields: getOrderedFields(fields),
    data: createRecords(20, fields),
    
    alternateRecordStyles: true,
    alternateFieldStyles: true
});

pickableFields.delayCall("editFields");
