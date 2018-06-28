isc.ListGrid.create({
    ID: "countryList",
    width:500, height:224, alternateRecordStyles:true,
    wrapCells:true, cellHeight:32, // taller rows to fit 'government' values
    data: countryData,
    fields:[
        {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
        {name:"countryName", title:"Country", width:120},
        {name:"government", title:"Government", showHover:true,
            hoverHTML:"return government_descriptions[record.government_desc]"
        }
    ],
    hoverWidth:300
})

isc.IButton.create({
    top:250,
    width:250,
    title:"Show Hover on every cell",
    actionType:"radio",
    radioGroup:"canHover",
    // When canHover is true on a ListGrid, cells will show hover text unless field.showHover is false
    click:"countryList.canHover = true"
})

isc.IButton.create({
    top:300,
    width:250,
    title:"Show Hover on <i>Government</i> cells only",
    actionType:"radio",
    radioGroup:"canHover",
    selected:true,
    // When canHover is unset on a ListGrid, cells will show hover text if field.showHover is true
    click:"countryList.canHover = null"
})

isc.IButton.create({
    top:350,
    width:250,
    title:"Suppress all cell hovers",
    actionType:"radio",
    radioGroup:"canHover",
    // When canHover is false on a ListGrid, cells will not show any hover text
    click:"countryList.canHover = false"
})


government_descriptions = [
    "<b>Communism</b> - a system of government in which the state plans and controls the economy and a single - often authoritarian - party holds power; state controls are imposed with the elimination of private ownership of property or capital while claiming to make progress toward a higher social order in which all goods are equally shared by the people (i.e., a classless society).",
    "<b>Constitutional monarchy</b> - a system of government in which a monarch is guided by a constitution whereby his/her rights, duties, and responsibilities are spelled out in written law or by custom.",
    "<b>Federal republic</b> - a state in which the powers of the central government are restricted and in which the component parts (states, colonies, or provinces) retain a degree of self-government; ultimate sovereign power rests with the voters who chose their governmental representatives.",
    "<b>Federal (Federative)</b> - a form of government in which sovereign power is formally divided - usually by means of a constitution - between a central authority and a number of constituent regions (states, colonies, or provinces) so that each region retains some management of its internal affairs; differs from a confederacy in that the central government exerts influence directly upon both individuals as well as upon the regional units.",
    "<b>Parliamentary monarchy</b> - a state headed by a monarch who is not actively involved in policy formation or implementation (i.e., the exercise of sovereign powers by a monarch in a ceremonial capacity); true governmental leadership is carried out by a cabinet and its head - a prime minister, premier, or chancellor - who are drawn from a legislature (parliament).",
    "<b>Republic</b> - a representative democracy in which the people's elected deputies (representatives), not the people themselves, vote on legislation."
]
