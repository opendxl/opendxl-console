
var testData =[];

for (var i=0; i<=200; i++) {
    testData[i] = { name: "field"+i, title: "Field "+i, type: "text" };
}

isc.DataSource.create({
    ID: "bigFilterDS",
    clientOnly: true,
    fields: [
        { name: "name", type: "text" },
        { name: "title", type: "text" },
        { name: "type", type: "text" }
    ],
    testData: testData
});

isc.FilterBuilder.create({
    ID:"advancedFilter",
    fieldDataSource: "bigFilterDS",
    criteria: { _constructor: "AdvancedCriteria",
        operator: "and", criteria: [
            {fieldName: "field2", operator: "iStartsWith", value: "C"},
            {operator: "or", criteria: [
                {fieldName: "field73", operator: "notEqualField", value: "field191"},
                {fieldName: "field130", operator: "iContains", value: "B"}
            ]}
        ]
    }
});

