// SmartClient SDK resource tree
//    configuration for SDK explorer, navigation, generated docs
// Copyright 2005 Isomorphic Software, Inc.

/*
Notes:
	* needServer -> requires the SDK server to be running
*/

Tree.create({
    ID:"sdkTree",
    modelType:"parent",
    isFolderProperty:"isFolder",
    data:[

	// TOP-level SDK categories
	{id:"top",            title:"SmartClient&trade; SDK Explorer",
	                      isFolder:true,                          
	                      windowIconSrc:"window/isomorphic.png"
	},
	{id:"quickstart",     title:"Quick Start Guide <br><i>(start here)</i>",    parentId:"top",
	                      isFolder:false,
	                      iconSrc:"other/doc_start.png",
	                      link:"docs/SmartClient_Quick_Start_Guide.pdf",
	                      description:"Your best starting point for an overview of the SmartClient SDK, system, and capabilities. Also covers installation and configuration issues."
	},
	{id:"exFeatureExplorer",  title:"Showcase",                    parentId:"top",
	                      needServer:true,
	                      isFolder:false,
	                      link:"isomorphic/system/reference/SmartClient_Explorer.html",
	                      iconSrc:"example/features.png",
	                      description:"Live examples of the full range of SmartClient features",
	                      disabledDescription:"Live examples of the full range of SmartClient features<P>" + 
	                            "Also available online at SmartClient.com"
    },
    {id:"docs",           title:"Docs",                                    parentId:"top",
	                      isFolder:true,
                          predraw:true,
	                      iconSrc:"folder/folder_docs_closed.png",
	                      //openIconSrc:"folder/folder_docs_open.png",
	                      windowIconSrc:"window/docs.png",
	                      description:"Online documentation of SmartClient concepts, APIs, and options, in PDF, HTML, and SmartClient formats.<br><br>You may also access these docs from the <code>docs/</code> directory of this SDK distribution."
	},
	{id:"tools",          title:"Tools",                                   parentId:"top",
	                      isFolder:true,
                          predraw:true,
                          iconSrc:"folder/folder_tools_closed.png",
	                      //openIconSrc:"folder/folder_tools_open.png",
	                      windowIconSrc:"window/tools.png",
	                      description:"Developer tools for SmartClient application prototyping, development, and debugging."
	},
	{id:"online",         title:"Online",                                  parentId:"top",
	                      isFolder:true,
                          predraw:true,
                          iconSrc:"folder/folder_online_closed.png",
	                      //openIconSrc:"folder/folder_online_open.png",
	                      windowIconSrc:"window/online.png",
	                      description:"Internet resources for SmartClient application developers."
	},
	{id:"license",        title:"License",                                 parentId:"top",
	                      isFolder:false,
	                      iconSrc:"other/license.png",
	                      loadPage:"docs/license.html",
	                      description:"SmartClient SDK Evaluation License Agreement or customer license notice."
	},

    // DOCS resources
	{id:"docQuickstart",  title:"Quick Start Guide",    parentId:"docs",
	                      isFolder:false,
	                      iconSrc:"other/doc_start.png",
	                      link:"docs/SmartClient_Quick_Start_Guide.pdf",
	                      description:"Your best starting point for an overview of the SmartClient SDK, system, and capabilities. Also covers installation and configuration issues. (PDF format)"
	}, // TODO single-source repeated resource?
	{id:"docReference",   title:"SmartClient Reference",            parentId:"docs",
	                      isFolder:false,
	                      iconSrc:"other/doc_reference.png",
	                      link:"docs/SmartClient_Reference.html",
	                      description:"Covers all public client APIs in this release, and links to other documents. (SmartClient format)"
	},
    {id:"relNotes",       title:"Release Notes",                           parentId:"docs",
	                      isFolder:false,
	                      iconSrc:"other/release_notes.png",
	                      loadPage:"docs/readme.html",
	                      description:"Important notes for this SmartClient release, including:<ul style='margin-top:0;margin-bottom:0;'><li>major new features<li>supported platforms<li>upgrade notes<li>known issues</ul>"
	},
	{id:"helloworld",     title:"Hello World example",                     parentId:"docs",
	                      isFolder:false,
	                      iconSrc:"example/example_helloworld.png",
	                      link:"templates/helloworld.html",
	                      jssrc:"templates/helloworld.html",
	                      xmlsrc:"templates/helloworldXML.jsp",
	                      description:"Tiny SmartClient example. Creates a button that shows a dialog with the 'Hello World' message when clicked."
	},
	{id:"demoapp2",       title:"Demo App",                        parentId:"docs",
	                      isFolder:false,
	                      needServer:true,
	                      iconSrc:"example/example_demo.png",
	                      link:"isomorphic/system/reference/inlineExamples/demoApp/demoAppJS.jsp",
                          noSCServerLink: "isomorphic/system/reference/SmartClient_Explorer.html#showcaseApp",
	                      jssrc:"isomorphic/system/reference/inlineExamples/demoApp/demoAppJS.jsp",
	                      xmlsrc:"isomorphic/system/reference/inlineExamples/demoApp/demoAppXML.jsp",
	                      dssrc:"examples/shared/ds/supplyItem.ds.xml",
	                      description:"A complete application demonstrating a range of visual components, data binding operations, and layout managers."
	},

/* 20060116 removing all other doc items
	{id:"docServer",      title:"SmartClient Server API Reference",        parentId:"docs",
	                      isFolder:false,
                          requiresModules: ["SCServer"],
	                      iconSrc:"other/doc_reference.png",
	                      link:"isomorphic/system/reference/server/javadoc/index.html",
	                      description:"Covers all public server APIs in this release. (Javadoc format) "
	},
	{id:"docAnalytics",   title:"CubeGrid Quick Reference",                parentId:"docs",
	                      isFolder:false,
                          requiresModules: ["Analytics"],
	                      iconSrc:"other/doc_option.png",
	                      link:"docs/resources/Analytics_QuickRef.pdf",
	                      description:"Quick reference and client API summary for the <code>CubeGrid</code> component, in the optional SmartClient Analytics module. (PDF format)"
	},
	{id:"docMessaging",   title:"Messaging Quick Reference",               parentId:"docs",
	                      isFolder:false,
                          requiresModules: ["RealtimeMessaging"],
	                      iconSrc:"other/doc_option.png",
	                      link:"docs/resources/Messaging_QuickRef.pdf",
	                      description:"Quick reference and client/server API summary for the optional SmartClient Real-Time Messaging module. (PDF format)"
	},
*/
	// EXAMPLES resources
/*
	{id:"exComponents",   title:"Visual Components",                       parentId:"examples",
	                      isFolder:false,
	                      iconSrc:"folder/folder_components_closed.png",
	                      openIconSrc:"folder/folder_components_open.png",
	                      windowIconSrc:"window/components.png",
	                      link:"examples/components/index.html", // TODO expand detail
	                      description:"Live examples of most SmartClient visual components."
	},
*/
/*
	{id:"exAnimation",    title:"Animation",                               parentId:"examples",
	                      isFolder:true,
	                      iconSrc:"folder/folder_examples_closed.png",
	                      windowIconSrc:"window/examples.png",
	                      description:"Live examples of SmartClient animation capabilities."
	},
	{id:"exDatabinding",  title:"Data Binding",                            parentId:"examples",
	                      isFolder:true,
	                      iconSrc:"folder/folder_databinding_closed.png",
	                      openIconSrc:"folder/folder_databinding_open.png",
	                      windowIconSrc:"window/databinding.png",
	                      description:"Live examples of data-binding visual components to list, tree, and cube datasources."
	},
	{id:"exServerInt",    title:"Java Integration",                      parentId:"examples",
	                      needServer:true,
                          requiresModules: ["SCServer"],
	                      isFolder:false,
	                      iconSrc:"folder/folder_server_closed.png",
	                      openIconSrc:"folder/folder_server_open.png",
	                      windowIconSrc:"window/server.png",
	                      link:"examples/server_integration/index.html", // TODO expand detail
	                      description:"Live examples of server-side integration with SmartClient RPCs and DataSources using the SmartClient Server."
	},
	{id:"exWebservices",  title:"Web Services",                            parentId:"examples",
	                      isFolder:true,
	                      iconSrc:"folder/folder_databinding_closed.png",
	                      openIconSrc:"folder/folder_databinding_open.png",
	                      windowIconSrc:"window/databinding.png",
	                      description:"Live examples of web service data-binding and web service operation calls."
	},
	{id:"exExtensions",   title:"Component Development",                   parentId:"examples",
	                      isFolder:false,
	                      iconSrc:"folder/folder_plugin_closed.png",
	                      openIconSrc:"folder/folder_plugin_open.png",
	                      windowIconSrc:"window/plugin.png",
	                      link:"examples/custom_components/index.html", // TODO expand detail
	                      description:"Live examples of custom visual component development, with complete source code."
	},

	{id:"exExperimental", title:"Experimental",                            parentId:"examples",
                          needServer: true,
                          requiresModules: ["SCServer"],
	                      isFolder:true,
	                      iconSrc:"folder/folder_experimental_closed.png",
	                      openIconSrc:"folder/folder_experimental_open.png",
	                      windowIconSrc:"window/experimental.png",
	                      link:"examples/experimental/index.html", // TODO expand detail
	                      description:"Examples of <i>experimental</i> SmartClient features. NOTE: Experimental features and interfaces are not frozen or supported."
	},
*/
    // Animation detailed links
	{id:"exExpRelEdit",   title:"Relational Editing",                   parentId:"exExperimental",
	                      isFolder:false,
	                      iconSrc:"example/example_demo.png",
	                      link:"examples/experimental/relation_item/relation_item.jsp",
	                      description:"Demonstrates editing relational entries in a single form."
	},
	{id:"exSecureApp",   title:"Secure Application",                   parentId:"exExperimental",
	                      isFolder:false,
	                      iconSrc:"example/example_demo.png",
	                      link:"examples/secureApp/index.jsp",
	                      description:"Demonstrates protection of server content."
	},
/*
	{id:"exExpBinary",    title:"Binary Interfaces",                     parentId:"exExperimental",
	                      isFolder:false,
                          needServer: true,
                          requiresModules: ["SCServer"],
	                      iconSrc:"example/example_demo.png",
	                      link:"examples/experimental/binary_data/binary_data.jsp",
	                      description:"Demonstrates various interfaces to binary data handling in SmartClient. Uploading multiple files with a progress bar and cancellation, previewing and viewing binary data. ."
	},
*/

	// Data Binding detailed links
	{id:"exDataTrees",    title:"Trees (TreeGrid)",                        parentId:"exDatabinding",
	                      isFolder:false,
	                      needServer:true,
	                      iconSrc:"example/example_databinding.png",
	                      link:"examples/databinding/tree_databinding.jsp",
                          noSCServerLink: "isomorphic/system/reference/SmartClient_Explorer.html#_Data.Binding_Trees",
	                      codesrc:"examples/databinding/tree_databinding.jsp",
	                      description:"Demonstrates binding of a TreeGrid to a hierarchical datasource."
	},
	{id:"exDataRecords",  title:"Records (Grid, Form, Detail)",            parentId:"exDatabinding",
	                      isFolder:false,
	                      needServer:true,
	                      iconSrc:"example/example_databinding.png",
	                      link:"examples/databinding/component_databinding.jsp",
                          noSCServerLink: "isomorphic/system/reference/SmartClient_Explorer.html#patternReuse",
	                      codesrc:"examples/databinding/component_databinding.jsp",
	                      description:"Demonstrates dynamic data binding of ListGrid, DynamicForm, and DetailViewer components to multiple datasources."
	},
	{id:"exRSSgrid",      title:"RSS ListGrid binding",                          parentId:"exDatabinding",
	                      isFolder:false,
	                      needServer:true,
                          needXML: true,
	                      iconSrc:"example/example_databinding.png",
	                      link:"examples/databinding/rss_databinding.html",
                          codesrc:"examples/databinding/rss_databinding.html",
	                      description:"Client-side binding of DataSource to RSS feed, for display of headlines in a ListGrid."
	},
/*
	{id:"exRSSportlet",   title:"RSS Portlet UI",                            parentId:"exDatabinding",
	                      isFolder:false,
	                      needServer:true,
	                      iconSrc:"example/example_databinding.png",
	                      link:"examples/databinding/RSS_portlets_JS.html",
	                      //codesrc:"examples/databinding/RSS_portlets_JS.html",
	                      description:"Extends the RSS ListGrid binding example with extra UI features."
	},
*/

    // duplicated resource - also under Web Services
	{id:"exWSDLFetch2",   title:"WSDL web service (Grid&nbsp;Fetch)",                       parentId:"exDatabinding",
	                      isFolder:false,
	                      needServer:true,
	                      needXML:true,
	                      iconSrc:"example/example_databinding.png",
	                      link:"examples/databinding/webService_dataBinding.html",
	                      codesrc:"examples/databinding/webService_dataBinding.html",
	                      description:"Demonstrates binding a ListGrid to a WSDL-defined XML web service for Fetch operations."
	},
	{id:"exDataCubes",    title:"Multi-dimensional (Analytics option)",    parentId:"exDatabinding",
	                      isFolder:false,
	                      needServer:true,
                          requiresModules: ["Analytics"],
	                      iconSrc:"example/example_databinding.png",
	                      link:"examples/analytics/databound_cubegrid.jsp",
	                      //codesrc:"examples/analytics/databound_cubegrid.jsp",
	                      description:"Demonstrates binding of a CubeGrid to a multidimensional datasource."
	},

	// Web Services detailed links
	{id:"exWSCallOp",     title:"WSDL operation (generic)",                        parentId:"exWebservices",
	                      isFolder:false,
	                      needServer:true,
	                      needXML:true,
	                      iconSrc:"example/example_databinding.png",
	                      link:"examples/databinding/webService_operation.html",
	                      codesrc:"examples/databinding/webService_operation.html",
	                      description:"Demonstrates calling a WSDL-defined web service."
	},
	{id:"exWSDLFetch",    title:"WSDL databinding (Fetch)",                        parentId:"exWebservices",
	                      isFolder:false,
	                      needServer:true,
	                      needXML:true,
	                      iconSrc:"example/example_databinding.png",
	                      link:"examples/databinding/webService_dataBinding.html",
	                      codesrc:"examples/databinding/webService_dataBinding.html",
	                      description:"Demonstrates binding a ListGrid to a WSDL-defined web service for Fetch operations."
	},

    // Animation detailed links
	{id:"exAnimPortal",   title:"Portal Animation",                        parentId:"exAnimation",
	                      isFolder:false,
	                      iconSrc:"example/example_demo.png",
	                      link:"examples/animation/portal_animation.html",
	                      description:"Demonstrates both built-in and programmed animations in an interactive portal layout."
	},
	{id:"exAnimAPIs",     title:"Animation Programming",                   parentId:"exAnimation",
	                      isFolder:false,
	                      iconSrc:"example/example_demo.png",
	                      link:"examples/animation/animation_programming.html",
	                      description:"Demonstrates programming interfaces for custom animations."
	},

	// TOOLS resources
	{id:"adminConsole",   title:"Admin Console",                           parentId:"tools",
	                      isFolder:false,
	                      needServer:true,
                          requiresModules: ["SCServer"],
	                      iconSrc:"other/admin_console.png",
	                      link:"tools/adminConsole.jsp",
	                      description:"Browser-based GUI for server configuration and datasource management, including database table creation and import for rapid prototyping."
	},
	{id:"devConsole2",    title:"Developer Console",                       parentId:"tools",
	                      isFolder:false,
	                      iconSrc:"other/dev_console.png",
	                      exec:"showLog()", // TODO easy bookmark icon/link; single-source repeated resource
	                      description:"Client-side development &amp; debugging tools, including:<ul style='margin-top:0;margin-bottom:0;'><li>log viewer<li>code evaluation<li>component inspection<li>tracing and profiling tools<li>online API reference</ul>"
	},
	{id:"visualBuilder",  title:"Visual Builder",                          parentId:"tools",
	                      isFolder:false,
	                      needServer:true,
                          requiresModules: ["SCServer"],
	                      iconSrc:"other/builder.png",
	                      link:"tools/visualBuilder/",
	                      description:"Prototype visual development environment for SmartClient applications."
	},
	{id:"reify",  title:"Reify (Balsamiq Importer)",                          parentId:"tools",
	                      isFolder:false,
	                      needServer:true,
                          requiresModules: ["SCServer"],
	                      iconSrc:"other/reify.png",
	                      link:"tools/bmmlImporter.jsp",
	                      description:"Take exported Balsamiq mockups (.bmml files) and instantly turn them into interactive SmartClient applications backed by clean, clear code."
	},
	{id:"dsGenerator",   title:"DataSource Generator",                           parentId:"tools",
	                      isFolder:false,
	                      needServer:true,
                          requiresModules: ["SCServer"],
	                      iconSrc:"other/ds_generator.png",
	                      link:"tools/dsGenerator.jsp",
	                      description:"Tool for generating SmartClient DataSources and test data files from existing metadata in database tables, Hibernate mappings and Java classes."
	},


	// ONLINE resources
	{id:"wiki",   title:"Isomorphic Public Wiki",            parentId:"online",
	                      isFolder:false,
	                      iconSrc:"other/online.png",
	                      link:"http://isomorphic.atlassian.net/wiki/",
	                      description:"A place to collaborate on ideas, share best practices, and learn more about Isomoprhic products in a community environment."
	},
	{id:"forums",         title:"Isomorphic Forums",                      parentId:"online",
	                      isFolder:false,
	                      iconSrc:"other/forums.png",
	                      link:"http://forums.isomorphic.com",
	                      description:"Go to&nbsp;<b>http://forums.smartclient.com</b> for technical assistance."
	},
	{id:"blog",   title:"Isomorphic Blog",            parentId:"online",
	                      isFolder:false,
	                      iconSrc:"other/blog.png",
	                      link:"http://blog.isomorphic.com/"
	},
	{id:"wwwSupport",     title:"Secure support extranet (customers only)",       parentId:"online",
	                      isFolder:false,
	                      iconSrc:"other/extranet.png",
	                      link:"http://support.isomorphic.com",
	                      description:"Secure reporting and tracking systems for SmartClient customer support inquiries."
	}
]

}); // end sdkTree

