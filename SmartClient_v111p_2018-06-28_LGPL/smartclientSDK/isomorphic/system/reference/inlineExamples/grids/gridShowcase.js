isc.Canvas.addProperties({
    hoverWidth:150
})

government_descriptions = [
    "<b>Communism</b> - a system of government in which the state plans and controls the economy and a single - often authoritarian - party holds power; state controls are imposed with the elimination of private ownership of property or capital while claiming to make progress toward a higher social order in which all goods are equally shared by the people (i.e., a classless society).",
    "<b>Constitutional monarchy</b> - a system of government in which a monarch is guided by a constitution whereby his/her rights, duties, and responsibilities are spelled out in written law or by custom.",
    "<b>Federal republic</b> - a state in which the powers of the central government are restricted and in which the component parts (states, colonies, or provinces) retain a degree of self-government; ultimate sovereign power rests with the voters who chose their governmental representatives.",
    "<b>Federal (Federative)</b> - a form of government in which sovereign power is formally divided - usually by means of a constitution - between a central authority and a number of constituent regions (states, colonies, or provinces) so that each region retains some management of its internal affairs; differs from a confederacy in that the central government exerts influence directly upon both individuals as well as upon the regional units.",
    "<b>Parliamentary monarchy</b> - a state headed by a monarch who is not actively involved in policy formation or implementation (i.e., the exercise of sovereign powers by a monarch in a ceremonial capacity); true governmental leadership is carried out by a cabinet and its head - a prime minister, premier, or chancellor - who are drawn from a legislature (parliament).",
    "<b>Republic</b> - a representative democracy in which the people's elected deputies (representatives), not the people themselves, vote on legislation."
];

isc.ListGrid.create({
    ID:"countryList",
    data:countryData,
    width:"100%", height:"100%",
    canEdit:true,
    cellHeight:30,
    saveByCell:true,
    editorChange: function (record, newValue, oldValue, rowNum, colNum) {
        var fieldName = this.getFieldName(colNum);
        if (fieldName == 'gdp' || fieldName == 'population') {
            this.refreshCell(rowNum, this.getFieldNum('gdp_percap'), false, true);
        }
    },
    canHover:true,
    hoverWidth:300,
    cellHoverHTML: function (record, rowNum, colNum) {
        var fieldName = this.getFieldName(colNum);
        if (fieldName == 'government') return government_descriptions[record.government_desc];
    },
    fields:[
        {name:"countryCode", title:"Flag", width:40, canEdit:false, canSort:false,
            type:"image",
            imageURLPrefix:"flags/24/",
            imageURLSuffix:".png",
            imageSize:24
        },
        {name:"countryName", title:"Country", prompt:"Conventional short form of country name"},
        {name:"capital", title:"Capital", prompt:"Location of seat of government"},
        {name:"government", title:"Government", prompt:"Basic form of government"},
        {name:"member_g8", title:"G8", prompt:"Member of the <b>Group of Eight</b> political summits",
            type:"boolean"
        },
        {name:"continent", title:"Continent",
            valueMap:["Europe", "Asia", "North America", "Australia/Oceania", "South America", "Africa"]
        },
        {name:"independence", title:"Nationhood", prompt:"Date of sovereignty, founding, or other significant nationhood event",
            type:"date",
            align:"right"
        },
        {name:"area", title:"Area (km&sup2;)", prompt:"Total of all land and water areas delimited by international boundaries",            
            type:"float",
            format: ",0.00",
            editorProperties:{
                // characterValue>31 here should allow enter, esc, backspace
                keyPress:"if (characterValue && characterValue>31 && (characterValue<48 || characterValue>57)) return false"
            }
        },
        {name:"population", title:"Population", prompt:"Estimated population based on US Bureau of the Census statistics",
            type:"integer",
            format: ",0.00",
            editorType:"SpinnerItem",
            editorProperties:{step:1000}
        },
        {name:"gdp", title:"GDP ($B)", prompt:"Gross domestic product at purchasing power parity (PPP) exchange rates",
            type:"float",
            format: ",0.0"
            //editorProperties:{blur:"form.setValue('gdp_percap', 99999)"}
        },
        // this is not really the time to apply formulas - they should be precalculated when data
        // arrives, and refreshed on a cell level - but good enough for a demo
        // see editorChange above - refreshes this cell when the source values are updated
        {name:"gdp_percap", title:"GDP (per capita)", prompt:"GDP on a purchasing power parity basis, divided by population",
            canEdit:false,
            align:"right",
            formatCellValue: function (value, record) {
                if (!isc.isA.Number(record.gdp) || !isc.isA.Number(record.population)) return "N/A";
                var gdpPerCapita = Math.round(record.gdp*1000000/record.population);
                return isc.NumberUtil.format(gdpPerCapita, "\u00A4,0.00");
            },
            sortNormalizer: function (record) {
                return record.gdp/record.population;
            }
        },
        {name:"article", title:"Info", prompt:"Link to encyclopedia article in a new window",
            type:"link",
            width:50,
            align:"center",            
            linkText:isc.Canvas.imgHTML("other/openbook.png",24,24)
        }
    ]
})
