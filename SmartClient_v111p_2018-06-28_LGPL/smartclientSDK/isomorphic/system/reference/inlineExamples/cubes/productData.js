var productData = [

	{quarter:"Q1, 2016", month:"January", region:"Western U.S.", product:"Pens", metric:"Revenue", _value:10000, percentNational:25},
	{quarter:"Q1, 2016", month:"January", region:"Western U.S.", product:"Chairs", metric:"Revenue", _value:50000, percentNational:45},
	{quarter:"Q1, 2016", month:"January", region:"Western U.S.", product:"Monitors", metric:"Revenue", _value:120000, percentNational:49},

	{quarter:"Q1, 2016", month:"January", region:"Western U.S.", product:"Pens", metric:"Profit", _value:2000, percentNational:25},
	{quarter:"Q1, 2016", month:"January", region:"Western U.S.", product:"Chairs", metric:"Profit", _value:5000, percentNational:45},
	{quarter:"Q1, 2016", month:"January", region:"Western U.S.", product:"Monitors", metric:"Profit", _value:44000, percentNational:59, _hilite:"over50"},

	{quarter:"Q1, 2016", month:"January", region:"Midwest U.S.", product:"Pens", metric:"Revenue", _value:8000, percentNational:20},
	{quarter:"Q1, 2016", month:"January", region:"Midwest U.S.", product:"Chairs", metric:"Revenue", _value:22000, percentNational:20},
	{quarter:"Q1, 2016", month:"January", region:"Midwest U.S.", product:"Monitors", metric:"Revenue", _value:20000, percentNational:8, _hilite:"under10"},

	{quarter:"Q1, 2016", month:"January", region:"Midwest U.S.", product:"Pens", metric:"Profit", _value:2000, percentNational:25},
	{quarter:"Q1, 2016", month:"January", region:"Midwest U.S.", product:"Chairs", metric:"Profit", _value:2000, percentNational:18},
	{quarter:"Q1, 2016", month:"January", region:"Midwest U.S.", product:"Monitors", metric:"Profit", _value:5000, percentNational:7, _hilite:"under10"},

	{quarter:"Q1, 2016", month:"January", region:"Eastern U.S.", product:"Pens", metric:"Revenue", _value:22000, percentNational:55, _hilite:"over50"},
	{quarter:"Q1, 2016", month:"January", region:"Eastern U.S.", product:"Chairs", metric:"Revenue", _value:40000, percentNational:36},
	{quarter:"Q1, 2016", month:"January", region:"Eastern U.S.", product:"Monitors", metric:"Revenue", _value:105000, percentNational:43},

	{quarter:"Q1, 2016", month:"January", region:"Eastern U.S.", product:"Pens", metric:"Profit", _value:4000, percentNational:50, _hilite:"over50"},
	{quarter:"Q1, 2016", month:"January", region:"Eastern U.S.", product:"Chairs", metric:"Profit", _value:4000, percentNational:36},
	{quarter:"Q1, 2016", month:"January", region:"Eastern U.S.", product:"Monitors", metric:"Profit", _value:25000, percentNational:34},

	{quarter:"Q1, 2016", month:"February", region:"Western U.S.", product:"Pens", metric:"Revenue", _value:12000, percentNational:23},
	{quarter:"Q1, 2016", month:"February", region:"Western U.S.", product:"Chairs", metric:"Revenue", _value:42000, percentNational:47},
	{quarter:"Q1, 2016", month:"February", region:"Western U.S.", product:"Monitors", metric:"Revenue", _value:160000, percentNational:40},

	{quarter:"Q1, 2016", month:"February", region:"Western U.S.", product:"Pens", metric:"Profit", _value:4000, percentNational:23},
	{quarter:"Q1, 2016", month:"February", region:"Western U.S.", product:"Chairs", metric:"Profit", _value:4000, percentNational:47},
	{quarter:"Q1, 2016", month:"February", region:"Western U.S.", product:"Monitors", metric:"Profit", _value:68000, percentNational:40},

	{quarter:"Q1, 2016", month:"February", region:"Midwest U.S.", product:"Pens", metric:"Revenue", _value:10000, percentNational:19},
	{quarter:"Q1, 2016", month:"February", region:"Midwest U.S.", product:"Chairs", metric:"Revenue", _value:12000, percentNational:13},
	{quarter:"Q1, 2016", month:"February", region:"Midwest U.S.", product:"Monitors", metric:"Revenue", _value:75000, percentNational:19},

	{quarter:"Q1, 2016", month:"February", region:"Midwest U.S.", product:"Pens", metric:"Profit", _value:3000, percentNational:20},
	{quarter:"Q1, 2016", month:"February", region:"Midwest U.S.", product:"Chairs", metric:"Profit", _value:1000, percentNational:11},
	{quarter:"Q1, 2016", month:"February", region:"Midwest U.S.", product:"Monitors", metric:"Profit", _value:32000, percentNational:17},

	{quarter:"Q1, 2016", month:"February", region:"Eastern U.S.", product:"Pens", metric:"Revenue", _value:31000, percentNational:58, _hilite:"over50"},
	{quarter:"Q1, 2016", month:"February", region:"Eastern U.S.", product:"Chairs", metric:"Revenue", _value:35000, percentNational:39},
	{quarter:"Q1, 2016", month:"February", region:"Eastern U.S.", product:"Monitors", metric:"Revenue", _value:164000, percentNational:41},

	{quarter:"Q1, 2016", month:"February", region:"Eastern U.S.", product:"Pens", metric:"Profit", _value:8000, percentNational:53, _hilite:"over50"},
	{quarter:"Q1, 2016", month:"February", region:"Eastern U.S.", product:"Chairs", metric:"Profit", _value:4000, percentNational:44},
	{quarter:"Q1, 2016", month:"February", region:"Eastern U.S.", product:"Monitors", metric:"Profit", _value:88000, percentNational:47},

	{quarter:"Q1, 2016", month:"March", region:"Western U.S.", product:"Pens", metric:"Revenue", _value:18000, percentNational:26},
	{quarter:"Q1, 2016", month:"March", region:"Western U.S.", product:"Chairs", metric:"Revenue", _value:25000, percentNational:54, _hilite:"over50"},
	{quarter:"Q1, 2016", month:"March", region:"Western U.S.", product:"Monitors", metric:"Revenue", _value:220000, percentNational:40},

	{quarter:"Q1, 2016", month:"March", region:"Western U.S.", product:"Pens", metric:"Profit", _value:9000, percentNational:29},
	{quarter:"Q1, 2016", month:"March", region:"Western U.S.", product:"Chairs", metric:"Profit", _value:2000, percentNational:40},
	{quarter:"Q1, 2016", month:"March", region:"Western U.S.", product:"Monitors", metric:"Profit", _value:112000, percentNational:38},

	{quarter:"Q1, 2016", month:"March", region:"Midwest U.S.", product:"Pens", metric:"Revenue", _value:7000, percentNational:10},
	{quarter:"Q1, 2016", month:"March", region:"Midwest U.S.", product:"Chairs", metric:"Revenue", _value:6000, percentNational:13},
	{quarter:"Q1, 2016", month:"March", region:"Midwest U.S.", product:"Monitors", metric:"Revenue", _value:135000, percentNational:25},

	{quarter:"Q1, 2016", month:"March", region:"Midwest U.S.", product:"Pens", metric:"Profit", _value:2000, percentNational:6, _hilite:"under10"},
	{quarter:"Q1, 2016", month:"March", region:"Midwest U.S.", product:"Chairs", metric:"Profit", _value:1000, percentNational:20},
	{quarter:"Q1, 2016", month:"March", region:"Midwest U.S.", product:"Monitors", metric:"Profit", _value:66000, percentNational:23},

	{quarter:"Q1, 2016", month:"March", region:"Eastern U.S.", product:"Pens", metric:"Revenue", _value:44000, percentNational:64, _hilite:"over50"},
	{quarter:"Q1, 2016", month:"March", region:"Eastern U.S.", product:"Chairs", metric:"Revenue", _value:15000, percentNational:33},
	{quarter:"Q1, 2016", month:"March", region:"Eastern U.S.", product:"Monitors", metric:"Revenue", _value:190000,percentNational:35},

	{quarter:"Q1, 2016", month:"March", region:"Eastern U.S.", product:"Pens", metric:"Profit", _value:20000, percentNational:65, _hilite:"over50"},
	{quarter:"Q1, 2016", month:"March", region:"Eastern U.S.", product:"Chairs", metric:"Profit", _value:2000, percentNational:40},
	{quarter:"Q1, 2016", month:"March", region:"Eastern U.S.", product:"Monitors", metric:"Profit", _value:115000, percentNational:39}
	
];

