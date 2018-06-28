isc.ListGrid.create({
    ID: "countryList",
    width:525, height:300, alternateRecordStyles:true,
    dataSource: worldDS,
    fields:[
        {name:"countryCode", width:60},
        {name:"countryName"},
        {name:"capital"},
        {name:"continent"},
        {name:"area"},
        {name:"population"}
    ],
    autoFetchData: true,
    showFilterEditor: true,
    allowFilterExpressions: true,
    initialCriteria: { _constructor: "AdvancedCriteria", operator: "and",
        criteria: [
            { fieldName: "countryName", operator: "iNotContains", value: "i" },
            { fieldName: "capital", operator: "iBetweenInclusive", start: "A", end: "FZZZZZZZZZZ" },
            { _constructor: "AdvancedCriteria", operator: "or",
                criteria: [
                    { fieldName: "population", operator: "lessThan", value: "1000000" },
                    { fieldName: "population", operator: "greaterThan", value: "100000000" }
                ]
            }
        ]
    }
})

isc.Label.create({
    ID: "symbolLabel",
    width: "*",
    height: "100%",
    valign: "top",
    contents: "" +
        "<table style='font-size:14;'>"+
            "<tr><td><b>Prefix</b></td><td><b>Operator</b></td></tr>"+
            "<tr><td>&lt;</td><td>lessThan</td></tr>"+
            "<tr><td>&gt;</td><td>greaterThan</td></tr>"+
            "<tr><td>&lt;=</td><td>lessThanOrEqual</td></tr>"+
            "<tr><td>&gt;=</td><td>greaterThanOrEqual</td></tr>"+
            "<tr><td>someValue...someValue</td><td>betweenInclusive</td></tr>"+
            "<tr><td>!</td><td>notEqual</td></tr>"+
            "<tr><td>^</td><td>startsWith</td></tr>"+
            "<tr><td>|</td><td>endsWith</td></tr>"+
            "<tr><td>!^</td><td>notStartsWith</td></tr>"+
            "<tr><td>!@</td><td>notEndsWith</td></tr>"+
            "<tr><td>~</td><td>contains</td></tr>"+
            "<tr><td>!~</td><td>notContains</td></tr>"+
            "<tr><td>=(value1|value2)</td><td>inSet</td></tr>"+
            "<tr><td>!=(value1|value2)</td><td>notInSet</td></tr>"+
            "<tr><td>#</td><td>isNull</td></tr>"+
            "<tr><td>!#</td><td>isNotNull</td></tr>"+
            "<tr><td>==</td><td>exact match (for fields where 'contains' is the default)</td></tr>"+
            "<tr><td>=.</td><td>matches other field-name or title</td></tr>"+
        "</table>",
    autoDraw: false

});

isc.HLayout.create({
    width: "100%",
    height: "100%",
    members: [ countryList, isc.LayoutSpacer.create({ width: 20 }), symbolLabel ]
});



