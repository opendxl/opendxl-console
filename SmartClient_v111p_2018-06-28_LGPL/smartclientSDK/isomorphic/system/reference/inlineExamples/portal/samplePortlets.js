// Sample Portlets
// ---------------------------------------------------------------------------------------
var samplePortlets = [];

// Qyarterly Results chart
// ---------------------------------------------------------------------------------------

samplePortlets.add({
    title:"Quarterly Results", 
    className:"FusionChart",
    makeComponent : function () {
        return makeSalesChart();
    }
});

function makeSalesChart() {
    return isc.FusionChart.create({
        autoDraw:false,
        chartProperties : {
            bgColor:"000000"
        },
        facets:[{ id:"regions" }, { id:"product" }],
        data : [
           {product:"cars", regions:"west", _value:4},
           {product:"cars", regions:"north", _value:2},
           {product:"cars", regions:"east", _value:5},
           {product:"trucks", regions:"west", _value:1},
           {product:"trucks", regions:"north", _value:9},
           {product:"trucks", regions:"east", _value:3}
        ]
    })
}

// Analytics engine (CubeGrid)
// ---------------------------------------------------------------------------------------

samplePortlets.add({
    title:"Business Analytics",
    className:"CubeGrid",
    makeComponent : function () {
        return makeCubeGrid();
    }
});

function makeCubeGrid() {

var reportData = [
	{quarter:"Q1", month:"jan", region:"west", product:"pens", metric:"rev", _value:10000, percentNational:25},
	{quarter:"Q1", month:"jan", region:"west", product:"chairs", metric:"rev", _value:50000, percentNational:45},
	{quarter:"Q1", month:"jan", region:"west", product:"monitors", metric:"rev", _value:120000, percentNational:49},

	{quarter:"Q1", month:"jan", region:"west", product:"pens", metric:"profit", _value:2000, percentNational:25},
	{quarter:"Q1", month:"jan", region:"west", product:"chairs", metric:"profit", _value:5000, percentNational:45},
	{quarter:"Q1", month:"jan", region:"west", product:"monitors", metric:"profit", _value:44000, percentNational:59, _hilite:"over50"},

	{quarter:"Q1", month:"jan", region:"midwest", product:"pens", metric:"rev", _value:8000, percentNational:20},
	{quarter:"Q1", month:"jan", region:"midwest", product:"chairs", metric:"rev", _value:22000, percentNational:20},
	{quarter:"Q1", month:"jan", region:"midwest", product:"monitors", metric:"rev", _value:20000, percentNational:8, _hilite:"under10"},

	{quarter:"Q1", month:"jan", region:"midwest", product:"pens", metric:"profit", _value:2000, percentNational:25},
	{quarter:"Q1", month:"jan", region:"midwest", product:"chairs", metric:"profit", _value:2000, percentNational:18},
	{quarter:"Q1", month:"jan", region:"midwest", product:"monitors", metric:"profit", _value:5000, percentNational:7, _hilite:"under10"},

	{quarter:"Q1", month:"jan", region:"east", product:"pens", metric:"rev", _value:22000, percentNational:55, _hilite:"over50"},
	{quarter:"Q1", month:"jan", region:"east", product:"chairs", metric:"rev", _value:40000, percentNational:36},
	{quarter:"Q1", month:"jan", region:"east", product:"monitors", metric:"rev", _value:105000, percentNational:43},

	{quarter:"Q1", month:"jan", region:"east", product:"pens", metric:"profit", _value:4000, percentNational:50, _hilite:"over50"},
	{quarter:"Q1", month:"jan", region:"east", product:"chairs", metric:"profit", _value:4000, percentNational:36},
	{quarter:"Q1", month:"jan", region:"east", product:"monitors", metric:"profit", _value:25000, percentNational:34},

	{quarter:"Q1", month:"feb", region:"west", product:"pens", metric:"rev", _value:12000, percentNational:23},
	{quarter:"Q1", month:"feb", region:"west", product:"chairs", metric:"rev", _value:42000, percentNational:47},
	{quarter:"Q1", month:"feb", region:"west", product:"monitors", metric:"rev", _value:160000, percentNational:40},

	{quarter:"Q1", month:"feb", region:"west", product:"pens", metric:"profit", _value:4000, percentNational:23},
	{quarter:"Q1", month:"feb", region:"west", product:"chairs", metric:"profit", _value:4000, percentNational:47},
	{quarter:"Q1", month:"feb", region:"west", product:"monitors", metric:"profit", _value:68000, percentNational:40},

	{quarter:"Q1", month:"feb", region:"midwest", product:"pens", metric:"rev", _value:10000, percentNational:19},
	{quarter:"Q1", month:"feb", region:"midwest", product:"chairs", metric:"rev", _value:12000, percentNational:13},
	{quarter:"Q1", month:"feb", region:"midwest", product:"monitors", metric:"rev", _value:75000, percentNational:19},

	{quarter:"Q1", month:"feb", region:"midwest", product:"pens", metric:"profit", _value:3000, percentNational:20},
	{quarter:"Q1", month:"feb", region:"midwest", product:"chairs", metric:"profit", _value:1000, percentNational:11},
	{quarter:"Q1", month:"feb", region:"midwest", product:"monitors", metric:"profit", _value:32000, percentNational:17},

	{quarter:"Q1", month:"feb", region:"east", product:"pens", metric:"rev", _value:31000, percentNational:58, _hilite:"over50"},
	{quarter:"Q1", month:"feb", region:"east", product:"chairs", metric:"rev", _value:35000, percentNational:39},
	{quarter:"Q1", month:"feb", region:"east", product:"monitors", metric:"rev", _value:164000, percentNational:41},

	{quarter:"Q1", month:"feb", region:"east", product:"pens", metric:"profit", _value:8000, percentNational:53, _hilite:"over50"},
	{quarter:"Q1", month:"feb", region:"east", product:"chairs", metric:"profit", _value:4000, percentNational:44},
	{quarter:"Q1", month:"feb", region:"east", product:"monitors", metric:"profit", _value:88000, percentNational:47},

	{quarter:"Q1", month:"mar", region:"west", product:"pens", metric:"rev", _value:18000, percentNational:26},
	{quarter:"Q1", month:"mar", region:"west", product:"chairs", metric:"rev", _value:25000, percentNational:54, _hilite:"over50"},
	{quarter:"Q1", month:"mar", region:"west", product:"monitors", metric:"rev", _value:220000, percentNational:40},

	{quarter:"Q1", month:"mar", region:"west", product:"pens", metric:"profit", _value:9000, percentNational:29},
	{quarter:"Q1", month:"mar", region:"west", product:"chairs", metric:"profit", _value:2000, percentNational:40},
	{quarter:"Q1", month:"mar", region:"west", product:"monitors", metric:"profit", _value:112000, percentNational:38},

	{quarter:"Q1", month:"mar", region:"midwest", product:"pens", metric:"rev", _value:7000, percentNational:10},
	{quarter:"Q1", month:"mar", region:"midwest", product:"chairs", metric:"rev", _value:6000, percentNational:13},
	{quarter:"Q1", month:"mar", region:"midwest", product:"monitors", metric:"rev", _value:135000, percentNational:25},

	{quarter:"Q1", month:"mar", region:"midwest", product:"pens", metric:"profit", _value:2000, percentNational:6, _hilite:"under10"},
	{quarter:"Q1", month:"mar", region:"midwest", product:"chairs", metric:"profit", _value:1000, percentNational:20},
	{quarter:"Q1", month:"mar", region:"midwest", product:"monitors", metric:"profit", _value:66000, percentNational:23},

	{quarter:"Q1", month:"mar", region:"east", product:"pens", metric:"rev", _value:44000, percentNational:64, _hilite:"over50"},
	{quarter:"Q1", month:"mar", region:"east", product:"chairs", metric:"rev", _value:15000, percentNational:33},
	{quarter:"Q1", month:"mar", region:"east", product:"monitors", metric:"rev", _value:190000,percentNational:35},

	{quarter:"Q1", month:"mar", region:"east", product:"pens", metric:"profit", _value:20000, percentNational:65, _hilite:"over50"},
	{quarter:"Q1", month:"mar", region:"east", product:"chairs", metric:"profit", _value:2000, percentNational:40},
	{quarter:"Q1", month:"mar", region:"east", product:"monitors", metric:"profit", _value:115000, percentNational:39}
	
];


var report = isc.CubeGrid.create({

    autoDraw:false,
	
	data:		reportData,
    valueProperty:"_value",

	columns:	{facets:["quarter","month","metric"]},
	rows:		{facets:["region","product"]},

    canMoveFacets:true,

	canReorderFacets:		false,
	canSortData:			false,
	canSortFacets:			false,
	canCloseColumns:		false,

	autoSizeHeaders:		true,
	wrapFacetValueTitles:		true,
	wrapFacetTitles:		true,

	facets:	[
	{id:"quarter",
	 title:"Quarter",
	 values:[
		{id:"Q1", title:"Q1, 2002", align:"left"}
	 ]},
	
	{id:"month",
	 title:"Month",
	 border:"1px solid black;",
	 values:[
		{id:"jan", title:"January", align:"left"},
		{id:"feb", title:"February", align:"left"},
		{id:"mar", title:"March", align:"left"}
	 ]},
	
	{id:"region",
	 title:"Region",
	 width:85,
	 values:[
	 	{id:"west", title:"Western U.S."},
		{id:"midwest", title:"Midwest U.S."},
		{id:"east", title:"Eastern U.S."}
	 ]},
	 
	{id:"product",
	 title:"Product",
	 width:85,
	 values:[
		{id:"chairs", title:"Trucks"},
		{id:"pens", title:"Cars"},
		{id:"monitors", title:"SUVs"}
	 ]},
	 
	{id:"metric",
	 title:"Metric",
	 values:[
		{id:"rev", title:"Revenue", width:70, align:"right",
            getCellValue : function (viewer, record) {
                return "$" + Math.round(record._value / 10) + "k";
            }
        },
		{id:"profit", title:"Profit", width:70, align:"right",
            getCellValue : function (viewer, record) {
                return "$" + Math.round(record._value / 10) + "k";
            }
        }
	 ]}
    ],
	 
	hilites:[	
	{
	id:"over50",
	title:"Green Light",
	htmlBefore:"<nobr><div style='float:left'>&nbsp;<img src='images/greenlight.gif' width='7' height='7' border='0'>&nbsp;</div>",
	htmlAfter:"</nobr>"
	},
	
	{
	id:"under10",
	title:"Red Light",
	htmlBefore:"<nobr><div style='float:left'>&nbsp;<img src='images/redlight.gif' width='7' height='7' border='0'>&nbsp;</div>",
	htmlAfter:"</nobr>"
	},
	
	{
	id:"boldpurple",
	title:"Bold Purple Text",
	style:"font-weight:bold; color:#990099;"		
	},
	
	{
	id:"aqua",
	title:"Aqua Background",
	style:"background-color:aqua; border:1px solid aqua;"
	}
    ],

    blinkCellList : [reportData[8], reportData[11], reportData[45]],
    blink : function (on) {
    	this.hiliteCellList(this.blinkCellList, on ? 1 : null);
        var report = this;
	    isc.Timer.setTimeout(function () { 
            report.blink(!on)
        }, 600);
    }
	
});
report.delayCall("blink");
return report;



}

// Sales Forecasting
// ---------------------------------------------------------------------------------------

samplePortlets.add({
    title:"Sales Forecasting",
    className:"VLayout",
    makeComponent : function () {
        return makeForecastGrid();
    }
});

function makeForecastGrid() {

isc.defineClass("PortletContents", "VLayout").addProperties({
    
    backgroundColor:"black",

    initWidget : function () {
        this.Super("initWidget", arguments);

        // generate a random data set
        //----------------------------------------

        var months = [
            {name:"jun", title:"Jun", longTitle:"June"},
            {name:"jul", title:"Jul", longTitle:"July"},
            {name:"aug", title:"Aug", longTitle:"August"},
            {name:"sep", title:"Sep", longTitle:"September"},
            {name:"oct", title:"Oct", longTitle:"October"},
            {name:"nov", title:"Nov", longTitle:"November"},
            {name:"dec", title:"Dec", longTitle:"December"}
        ];

        var salesData=[], 
            numProducts = 4, 
            products = ["Cars", "Trucks", "Vans", "SUVs"];

        for (var i=0; i<numProducts; i++) {
            salesData[i] = {product:products[i]};
            var minSales = Math.round(Math.random()*8000) + 2000, // 2k-10k
                maxVariance = minSales/3; // up to 33% of min value for this product
            for (var j=0; j<months.length; j++) {
                salesData[i][months[j].name] = Math.round(Math.random()*maxVariance) + minSales;
            }
        }

        // show a grid view
        //----------------------------------------
        this.salesDataGrid = isc.ListGrid.create({
            masterLayout: this,
    
            leaveScrollbarGap:false, height:108,
            canEdit:true, editEvent:'click', 
            chartProperties : {
                chartProperties : {
                    bgColor:"000000"
                }
            },

            // editing a cell triggers an update of the chart
            cellChanged:"this.updateChart()",
            updateChart : function (props) {

                // store chart configuration
                if (props) this.chartProps = props;
                isc.addProperties(this.chartProps, {
                    height: 300,
                    animateValuesOnShow: false
                });


                // if there's already a chart, destroy it
                if (this.lastChart) this.lastChart.destroy();

                // generate chart
                this.lastChart = this.chartData("product", null, null, this.chartProps);
    
                // show it
                this.masterLayout.addMember(this.lastChart, 1);
            },

            // fields (columns) are the same as the chart categories (months), plus an extra column
            // up front to display the series names
            fields:[{name:"product", title:"Product", canEdit:false}].concat(months),

            data:salesData
        });

        // allow dynamic chart changing
        //----------------------------------------
        this.chartSelector = isc.DynamicForm.create({
            items : [ 
                { name:"chartType", title:"Chart Type", type:"select", defaultValue:"Line",
                  valueMap: ["Bar","Column","Line","Area", "Doughnut"],
                  defaultValue:"Column", changed:this.getID()+".salesDataGrid.updateChart({chartType: value})" }
            ]
        });

        this.addMembers([this.salesDataGrid, this.chartSelector]);
        this.salesDataGrid.updateChart({ chartType:"Line" });
    }

});

return isc.PortletContents.create();

}

// Training Video
// ---------------------------------------------------------------------------------------

samplePortlets.add({
    title:"Training Videos", 
    className:"Flashlet",
    makeComponent : function () {
        return makeTrainingVideo();
    }
});


function makeTrainingVideo () {
    return isc.Flashlet.create({
        width:"100%", height:"100%",
        src:"http://www.youtube.com/v/URF2sVQWuxU&hl=en"
    })
}

// SalesForce
// ---------------------------------------------------------------------------------------

samplePortlets.add({
    title:"Accounts (SalesForce)",
    className:"ListGrid",
    makeComponent : function (newNode, parentNode, editContext, callback) {
        return loadSFLeadsGrid(newNode, callback);
    }
});

function loadSFLeadsGrid (newNode, callback) {
    var canvas = isc.Canvas.create({
        autoDraw:false,
        contents:"Loading...",
        width:"100%", 
        height:"100%"
    });
    
    isc.SForce.ensureLoggedIn(function () {
        isc.SForce.getEntity("Lead", function (dataSource) {
            canvas.addChild(isc.ListGrid.create({ 
                autoDraw:false,
                width:"100%", height:"100%",
                autoFetchData:true,
                leaveScrollbarGap:false,
                dataSource : dataSource,
                fields : [
                    { name:"Status", valueIcons:{
                          "Working - Contacted" : "greenlight.gif",
                          "Open - Not Contacted" : "redlight.gif",
                          "Closed - Not Converted" : "redlight.gif",
                          "Closed - Converted" : "greenlight.gif"
                      },
                      valueIconSize:7
                    },
                    { name:"Company" },
                    { name:"FirstName", title:"First Name", width:80 },
                    { name:"LastName", title:"Last Name", width:80 }
                ]
            }))
        })
    }, null, { username:"charles@isomorphic.com", password:"isomorphic" });
    return canvas;
}
