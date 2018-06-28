<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic"

%><%@ page contentType="text/html;charset=UTF-8"

%><%@ page import="com.isomorphic.base.Config"
%><%@ page import="com.isomorphic.base.ISCInit"
%><%@ page import="com.isomorphic.rpc.BuiltinRPC"

%><%@ page import="java.util.HashSet"
%><%@ page import="java.util.Set"

%><%!
    static {
        ISCInit.go();
    }

    private Config baseConfig;
    private boolean allowAnyRPC = false;
    private final Set enabledBuiltinMethods = new HashSet();
    private boolean useIDACall = false;

    private final boolean isBuiltinMethodEnabled(String methodName) {
        return (allowAnyRPC || enabledBuiltinMethods.contains(methodName));
    }

    private final boolean isPrefixEnabled(String methodName, String prefix) {
        try {
            BuiltinRPC.validateFileDir(prefix, methodName);
        } catch (Exception nope) {
            return false;
        }
        return true; 
    }

%><%!

    {
        baseConfig = Config.getGlobal();

        enabledBuiltinMethods.addAll(baseConfig.getList("RPCManager.enabledBuiltinMethods"));
        allowAnyRPC = enabledBuiltinMethods.contains("*");
    }

%><%
useIDACall = (// Use IDACall if the server is explicitly configured to use it rather than bmmlImporterOperations.jsp.
              baseConfig.getBoolean("MockupImporter.useIDACall", false) ||
              // Also use IDACall if bmmlImporterOperations.jsp does not exist.
              application.getResource("/tools/bmmlImporterOperations.jsp") == null);
%><html>
<head>
<title>Standalone Balsamiq Mockup Tool</title>

</head>
<body>
<%
String skin = request.getParameter("skin");
if (skin == null || "".equals(skin.trim())) skin = "Tahoe";
%>

<%
	boolean isc_websiteMode = false;
	// Check if we set a Config property websiteMode in server.properties
	String config_websiteMode = (String)baseConfig.getProperty("websiteMode");
	if(config_websiteMode!=null) {
		isc_websiteMode = Boolean.parseBoolean(config_websiteMode);
	}
%>

<isomorphic:loadISC skin="<%=skin%>" modulesDir="system/development/" includeModules="Drawing,Charts,Analytics,FileLoader,FileBrowser,DocViewer,VisualBuilder" />
<script>
<isomorphic:loadSystemSchema/>

// setting density to Spacious
isc.Canvas.resizeFonts(3);
isc.Canvas.resizeControls(10);
    
var isc_websiteMode = <%=isc_websiteMode%>;

var useIDACall = <%= useIDACall %>,
    saveFileBuiltinIsEnabled = <%= isBuiltinMethodEnabled("saveFile") && isPrefixEnabled("[TOOLS]", "saveFile") %>,
    loadFileBuiltinIsEnabled = <%= isBuiltinMethodEnabled("loadFile") %>;

if (!useIDACall) {
    RPCManager.actionURL = Page.getAppDir() + "bmmlImporterOperations.jsp";
}

var reifyPreviewMode = isc.params.reifyPreview == "yes";

function handleMockupProjectXml (xmlAsString, callback) {
    var self = this;
    isc.DMI.callBuiltin({
        methodName: "xmlToJS",
        arguments: [xmlAsString],
        callback : function (rpcResponse, jsData) {
            xmlAsString = null;
            // if rpcRequest succeeded, return the current screen
            var project = rpcResponse.status >= 0 && isc.eval(jsData);
            if (isc.isA.Project(project)) {
                var screen = project.screens.find("isCurrent", true);
                if (screen) xmlAsString = screen.contents;
            }
            callback(xmlAsString);
        }
    });
};

function requestMockupScreenXml (fileName, screenDS, projectDS, callback) {
    if (fileName) {
        var isScreen  = projectDS == null,
            requestDS = projectDS || screenDS;
        // load the screen or project from the DataSource
        isc.DS.load(requestDS, function () {
            isc.DS.get(requestDS).getFile({
                fileType: isScreen ? 'ui' : 'proj',
                fileName: fileName, fileFormat: 'xml' 
            }, function (dsResponse, data, dsRequest) {
                // send appropriate screen to the callback, if available
                if (dsResponse.status < 0 || !isc.isA.String(data)) callback();
                else if (isScreen) callback(data);
                else handleMockupProjectXml(data, callback);
            })
        });
    } else {
        // retrieve project from an Offline (not OfflineFileSource DataSource) object
        handleMockupProjectXml(isc.Offline.get(isc.Project.AUTOSAVE_MOCKUPS), callback);
    }
};

var refreshItem,
    checkForChangesTmrID = null;

var toolTitle = isc.Label.create(reifyPreviewMode ? {
    contents: "Reify Preview",         width: 80 } : {
    contents: "Reify Mockup Importer", width: 150} , {
    autoDraw: false
});

var tools = isc.ToolStrip.create({
    autoDraw: false,
    width: "100%", height: 24,
    layoutLeftMargin: 10,
    members: [toolTitle],
    autoDraw: false
});

var mockupLayout = isc.VLayout.create({
    width: "100%",
    height: "100%",
    members: [tools]
});

var replaceContainerCanvas = function () {
    if (isc.canvas != null) {
        isc.canvas.destroy();
    }
    isc.canvas = isc.Canvas.create({
        overflow: "auto", autoDraw: false
    });
    mockupLayout.addMember(isc.canvas);
};

var importDialog, importPane;

var createBMMLImportDialog = function (dialogProperties) {
    dialogProperties = dialogProperties || {
        showCloseButton: false
    };
    
    

    isc.addProperties(dialogProperties, {
        showFileNameField: !useIDACall || loadFileBuiltinIsEnabled,
        showAssetsNameField: !useIDACall || saveFileBuiltinIsEnabled,
        showOutputField: !useIDACall || saveFileBuiltinIsEnabled,
        skin: isc.params.skin || "Tahoe"
    });

    dialogProperties.submit = function (filePath, outputFileName, fileContent, skin, dropMarkup,
            trimSpace, fillSpace, fieldNamingConvention, autoRefresh, fileUploaded, artificial)
    {
        isc.showPrompt("Importing mockup... ${loadingImage}");
        // what file to convert
        var mockupParam = filePath;
        // output file to determine js or xml and file name
        var outputFileParam = outputFileName;
        var dropMarkupParam = dropMarkup ? "yes" : "no";
        var trimSpaceParam = trimSpace ? "yes" : "no";
        var fillSpaceParam = fillSpace ? "yes" : "no";
        var autoRefreshParam = String(autoRefresh);
        var fieldNamingConventionParam = fieldNamingConvention;
        var mockupUploadedParam = "yes";

        if (!artificial && !fileContent && !reifyPreviewMode) {
            var workBuilder = isc.URIBuilder.create(isc.Page.getAppDir());
            workBuilder.appendPath("bmmlImporter.jsp");
            workBuilder.setQueryParam("mockup", mockupParam);
            if (outputFileParam) {
                workBuilder.setQueryParam("outputFile", outputFileParam);
            }
            if (skin) {
                workBuilder.setQueryParam("skin", skin);
            }
            if (fieldNamingConvention) {
                workBuilder.setQueryParam("fieldNamingConvention", fieldNamingConventionParam);
            }
            if (!dropMarkup) {
                workBuilder.setQueryParam("dropMarkup", "no");
            }
            if (!trimSpace) {
                workBuilder.setQueryParam("trimSpace", "no");
            }
            if (!fillSpace) {
                workBuilder.setQueryParam("fillSpace", "no");
            }
            if (autoRefresh != null) {
                workBuilder.setQueryParam("autoRefresh", autoRefreshParam);
            }
            if (fileUploaded) {
                workBuilder.setQueryParam("mockupUploaded", "yes");
            }
            window.location = workBuilder.uri;
            // clear the prompt that says "Importing mockup..."
            isc.clearPrompt();
            return;
        }

        var mockupUrl = mockupParam || "";
        if (mockupUrl.startsWith("http://") || mockupUrl.startsWith("https://")) {
            mockupParam = null;
            mockupUrl = mockupUrl.replaceAll(" ", "%20");
        } else {
            mockupUrl = null;
        }
        var bmmlImporter = isc.MockupImporter.create({
            dropMarkup: dropMarkupParam != "no",
            trimSpace:  trimSpaceParam != "no",
            fillSpace:  fillSpaceParam != "no",
            mockupPath: mockupParam,
            fieldNamingConvention: fieldNamingConventionParam,
            bmmlImportFailed : function () {
                importButton.click();
            }
        });
        var autoRefreshDefaultValue = true;
        if (autoRefreshParam == "false") {
            autoRefreshDefaultValue = false;
        }
        var refreshCheckbox = isc.DynamicForm.create({
            autoDraw: false,
            fields: [
                {name: "refresh", type: "checkbox", title: "Refresh automatically",
                 defaultValue: autoRefreshDefaultValue,
                    changed : function (form, item, value) {
                        if (value && form.changeAction) {
                            form.changeAction();
                        }
                    }
                }
            ]
        });
        refreshItem = refreshCheckbox.getItem("refresh");
        var downloadButton = isc.ToolStripButton.create({
            title: "Download Source",
            icon: "[SKIN]actions/download.png",
            autoDraw: false,
            click : function () {
                isc.DMI.callBuiltin({
                    methodName: "downloadClientContent",
                    arguments: [ tools.xml, tools.xmlFileName, "text/xml" ],
                    requestParams: {
                        showPrompt:false,
                        useXmlHttpRequest: false,
                        timeout: 0
                    }
                 });
            }
        });
        var showButton = isc.ToolStripButton.create({
            title: "Show Source",
            icon: "[SKIN]actions/view.png",
            autoDraw: false,
            _showingSource: false,
            click : function () {
                var taForm = isc.DynamicForm.create({
                    width: "100%",
                    height: "100%",
                    numCols: 1,
                    fields: [ {
                        name: "content",
                        type:"textArea", 
                        height: "100%", 
                        width: "*",
                        showTitle: false,
                        value: tools.xml} ]
                });
                var _this = this;
                this._showingSource = true;
                var wnd = isc.Window.create({
                    title: "Content",
                    height: "85%",
                    width: "85%",
                    autoCenter: true,
                    items: [taForm],
                    closeClick : function () {
                        _this._showingSource = false;
                        return this.Super("closeClick", arguments);
                    }
                });
                wnd.show();
                taForm.getItem("content").delayCall("selectValue", [], 100);
            }
        });
        var importButton = isc.ToolStripButton.create({
            title: "Import..",
            icon: "[SKIN]/actions/configure.png",
            autoDraw: false,
            click : function () {
                if (isc.canvas != null) {
                    isc.canvas.destroy();
                }
                if (tools) {
                    tools.removeMember(toolTitle);
                    tools.destroy();
                    tools = isc.ToolStrip.create({
                        autoDraw: false,
                        width: "100%", height:24,
                        layoutLeftMargin: 10,
                        members: [toolTitle],
                        autoDraw: true
                    });
                    mockupLayout.addMember(tools);
                }
                if (importDialog) {
                    importDialog.destroy();
                    importDialog = createBMMLImportDialog({
                        showCloseButton: true,
                        showSkinSelector: true,
                        fileUrl: mockupUrl,
                        fileName: mockupParam,
                        outputFileName: outputFileParam,
                        skin: skin,
                        dropMarkup: dropMarkupParam != "no",
                        trimSpace: trimSpaceParam != "no",
                        fillSpace: fillSpaceParam != "no",
                        fieldNamingConvention: fieldNamingConventionParam,
                        autoRefresh: autoRefreshParam != "false",
                        _fileUploaded: mockupUploadedParam == "yes"
                    });
                    importPane.addMember(importDialog);
                }
            }
        });
        var toolStripMembers = [ toolTitle, importButton, downloadButton, showButton ];
        if (saveFileBuiltinIsEnabled) {
            toolStripMembers.push(refreshCheckbox);
        }
        tools.setMembers(toolStripMembers);
        importButton.focus();

        var errLabel = isc.Label.create({
            width: 400,
            height: 20,
            top: 25,
            padding: 10,
            visibility: isc.Canvas.HIDDEN,
            animateShowEffect: "fade",
            animateHideEffect: "fade",
            contents: "<font color='red'>Can't auto-refresh mockup</font>" 
        });

        if (mockupUrl) {
            isc.RPCManager.sendProxied({
                actionURL: mockupUrl,
                httpMethod: "GET",
                callback: function (resp) {
                    refreshItem.enable();
                    refreshItem.show();

                    var lastChangeDate = resp.httpHeaders["Last-Modified"];
                    if (mockupUrl.endsWith("/")) {
                        mockupUrl = mockupUrl.substring(0, url.length - 1);
                    }
                    var tmp = decodeURI(mockupUrl.replace(/\+|%20/g, " "));
                    var fileName = tmp.substring(tmp.lastIndexOf("/") + 1);
                    fileName = fileName.replace(/[^- _.,$0-9A-Za-z]/g, "");
                    var contents = resp.data;

                    var checkForChanges = function () {
                        if (!refreshItem.disabled && refreshItem.getValue() && !showButton._showingSource) {
                            isc.RPCManager.sendProxied({
                                actionURL: mockupUrl,
                                httpMethod: "GET",
                                callback: function (resp) {
                                    if (resp.status == 0) {
                                        var dataLastChangeDate = resp.httpHeaders["Last-Modified"];
                                        var changed = false;
                                        if (lastChangeDate && dataLastChangeDate) {
                                            changed = lastChangeDate != dataLastChangeDate;
                                        } else {
                                            changed = contents != resp.data;
                                        }
                                        if (changed) {
                                            var href = window.location.href;
                                            if (href.contains("autoRefresh=false")) {
                                                href = href.replace("autoRefresh=false", "autoRefresh=true");
                                                window.location.replace(href);
                                            } else {
                                                window.location.reload();
                                            }
                                        }
                                    } else {
                                        errLabel.bringToFront();
                                        errLabel.animateShow();
                                        isc.Timer.setTimeout(function () {
                                            errLabel.animateHide();
                                        }, 5000);
                                    }
                                }
                            });
                        }
                    };

                    var checkForChangesScheduler = function () {
                        checkForChanges();
                        if (checkForChangesTmrID != null) isc.Timer.clearTimeout(checkForChangesTmrID);
                        checkForChangesTmrID = isc.Timer.setTimeout(checkForChangesScheduler, 10000);
                    };
                    if (checkForChangesTmrID != null) isc.Timer.clearTimeout(checkForChangesTmrID);
                    checkForChangesTmrID = isc.Timer.setTimeout(checkForChangesScheduler, 10000);

                    refreshCheckbox.changeAction = function () {
                        if (checkForChangesTmrID != null) {
                            isc.Timer.clearTimeout(checkForChangesTmrID);
                            checkForChangesTmrID = null;
                        }
                        checkForChangesScheduler();
                    };

                    // convert bmml to smartclient
                    bmmlImporter.bmmlToXml(contents, function (xmlContent, layout, layoutIds) {
                        if (xmlContent == null) {
                            window.location = "bmmlImporter.jsp";
                            // clear the prompt that says "Importing mockup..."
                            isc.clearPrompt();
                            return;
                        }
                        tools.xml = xmlContent;
                        var onScriptEvaluated = function () {
                            replaceContainerCanvas();
                            for (var i = 0; i < layout.length; i++) {
                                var widget = layout[i];
                                if (widget._constructor != "ValuesManager" &&
                                    widget._constructor != "MockDataSource" &&
                                    window[widget.ID].parentElement == null) {
                                    isc.canvas.addChild(window[widget.ID]);
                                }
                            }
							if(layoutIds) {
		                        for (var i = 0; i < layoutIds.length; i++) {
		                            var canvas = isc.Canvas.getById(layoutIds[i]);
	    	                        if (canvas && canvas.parentElement == null) {
	        	                        // need to move all canvases down, so they will not overlap toolbar
	            	                    canvas.moveBy(0, 25);
	                	            }
	                    	    }
	                        }
                            // clear the prompt that says "Importing mockup..."
                            isc.clearPrompt();
                        }

                        var ind = fileName.lastIndexOf(".");
                        var mockupFilePrefix = null;
                        if (ind > 0) {
                            mockupFilePrefix = fileName.substring(0, ind);
                        }
                        tools.xmlFileName = mockupFilePrefix + ".xml";

                        if (outputFileParam) {
                            if (outputFileParam.substr(outputFileParam.length - 4) == ".xml") {
                                var path = outputFileParam;
                                if (!path.startsWith("[")) path = "[TOOLS]/" + path;
                                if (saveFileBuiltinIsEnabled) {
                                    isc.DMI.callBuiltin({
                                        methodName: "saveFile",
                                        arguments: [path, xmlContent]
                                    });
                                }
                                tools.xmlFileName = outputFileParam;
                            } else {
                                ind = outputFileParam.lastIndexOf(".");
                                if (ind > 0) {
                                    tools.xmlFileName = outputFileParam.substring(0, ind);
                                } else {
                                    tools.xmlFileName = outputFileParam;
                                }
                                tools.xmlFileName += ".xml";
                            }
                            isc.DMI.callBuiltin({
                                methodName: "xmlToJS",
                                arguments: xmlContent,
                                callback : function (rpcResponse) {
                                    if (!outputFileParam ||
                                        outputFileParam.substr(outputFileParam.length - 3) == ".js") {
                                        var path = outputFileParam;
                                        if (!path.startsWith("[")) path = "[TOOLS]/" + path;
                                        if (saveFileBuiltinIsEnabled) {
                                            isc.DMI.callBuiltin({
                                                methodName: "saveFile",
                                                arguments: [
                                                    path,
                                                    rpcResponse.data
                                                ]
                                            });
                                        }
                                    }
                                    isc.Class.evaluate(rpcResponse.data);
                                    onScriptEvaluated();
                                } 
                            });
                        } else {
                            if (saveFileBuiltinIsEnabled) {
                                isc.DMI.callBuiltin({
                                    methodName: "saveFile",
                                    arguments: ["[TOOLS]/" + mockupFilePrefix + ".xml", xmlContent]
                                });
                            }
                            isc.DMI.callBuiltin({
                                methodName: "xmlToJS",
                                arguments: xmlContent,
                                callback : function (rpcResponse) {
                                    if (saveFileBuiltinIsEnabled) {
                                        isc.DMI.callBuiltin({
                                            methodName: "saveFile",
                                            arguments: [
                                                "[TOOLS]/" + mockupFilePrefix + ".js",
                                                rpcResponse.data
                                            ]
                                        });
                                    }
                                    isc.Class.evaluate(rpcResponse.data);
                                    onScriptEvaluated();
                                }
                            });
                        }
                    });
                }
            });
        } else {
            var processContents = function processContents(contents, path) {
                if (saveFileBuiltinIsEnabled) {
                    var ds = isc.DataSource.get("SCUploadSaveFile");

                    var lastChangeDate = null;

                    var checkForChanges = function () {
                        if (!refreshItem.disabled && refreshItem.getValue() && !showButton._showingSource) {
                            ds.fetchData({path: path}, function(dsResponse, data) {
                                if (dsResponse.status == 0) {
                                    if (lastChangeDate != data.lastChangeDate) {
                                        window.location.reload()
                                    }
                                } else {
                                    errLabel.bringToFront();
                                    errLabel.animateShow();
                                    isc.Timer.setTimeout(function () {
                                        errLabel.animateHide();
                                    }, 5000);
                                }
                            }, {willHandleError: true});
                        }
                    };

                    // Updates to the Reify Preview are driven via a separate mechanism
                    if (!reifyPreviewMode) {

                        var checkForChangesScheduler = function () {
                            checkForChanges();
                            if (checkForChangesTmrID != null) isc.Timer.clearTimeout(checkForChangesTmrID);
                            checkForChangesTmrID = isc.Timer.setTimeout(checkForChangesScheduler, 10000);
                        };
                        if (checkForChangesTmrID != null) isc.Timer.clearTimeout(checkForChangesTmrID);
                        checkForChangesTmrID = isc.Timer.setTimeout(checkForChangesScheduler, 10000);

                        refreshCheckbox.changeAction = function () {
                            if (checkForChangesTmrID != null) {
                                isc.Timer.clearTimeout(checkForChangesTmrID);
                                checkForChangesTmrID = null;
                            }
                            checkForChangesScheduler();
                        };
                    }
                }

                // The Mockup Mode screen for the Reify Preview is just Component XML
                var xmlConverter = reifyPreviewMode ? "reifyComponentXml" : "bmmlToXml";

                // convert bmml to smartclient
                bmmlImporter[xmlConverter](contents, function (xmlContent, layout, layoutIds) {
                    if (xmlContent == null) {
                        window.location = "bmmlImporter.jsp";
                        // clear the prompt that says "Importing mockup..."
                        isc.clearPrompt();
                        return;
                    }
                    tools.xml = xmlContent;
                    var onScriptEvaluated = function () {
                        replaceContainerCanvas();
                        for (var i = 0; i < layout.length; i++) {
                            var widget = layout[i];
                            if (widget._constructor != "ValuesManager" &&
                                widget._constructor != "MockDataSource" &&
                                window[widget.ID].parentElement == null) {
                                isc.canvas.addChild(window[widget.ID]);
                            }
                        }
                        if(layoutIds) {
							for (var i = 0; i < layoutIds.length; i++) {
								var canvas = isc.Canvas.getById(layoutIds[i]);
								if (canvas && canvas.parentElement == null) {
	        	                    // move all canvii down so they will not overlap toolbar
	            	                canvas.moveBy(0, 25);
								}
							}
                        }
                        // clear the prompt that says "Importing mockup..."
                        isc.clearPrompt();
                    };

                    if (!reifyPreviewMode) {
                        var mockupFilePrefix = mockupParam;
                        var ind;
                        ind = mockupParam.lastIndexOf("/");
                        if (ind > 0) {
                            mockupFilePrefix = mockupFilePrefix.substring(ind);
                        }
                        ind = mockupFilePrefix.lastIndexOf("\\");
                        if (ind > 0) {
                            mockupFilePrefix = mockupFilePrefix.substring(ind);
                        }
                        ind = mockupFilePrefix.lastIndexOf(".");
                        if (ind > 0) {
                            mockupFilePrefix = mockupFilePrefix.substring(0, ind);
                        }
                        tools.xmlFileName = mockupFilePrefix + ".xml";
                    }
                    if (reifyPreviewMode) {
                        // create JS to display
                        isc.DMI.callBuiltin({
                            methodName: "xmlToJS",
                            "arguments": xmlContent,
                            callback : function (rpcResponse) {
                                isc.Class.evaluate(rpcResponse.data);
                                onScriptEvaluated();

                                var children = isc.canvas.children || [],
                                    topLevelIds = children.map("getID"),
                                    dataViewXml = isc.MockupImporter.getDataViewXml(topLevelIds);

                                // save Reify Preview to the Screen DataSource/OfflineFileSource
                                var fileName = outputFileParam ? 
                                               outputFileParam : "Reify Preview";
                                isc.DS.load(screenDSParam, function () {
                                    isc.DS.get(screenDSParam).saveFile({
                                        fileName: fileName, fileType: 'ui', fileFormat: 'xml'
                                    }, xmlContent + dataViewXml);
                                });
                            }
                        });
                    } else if (outputFileParam) {
                        if (outputFileParam.substr(outputFileParam.length - 4) == ".xml") {
                            var path = outputFileParam;
                            if (!path.startsWith("[")) path = "[TOOLS]/" + path;
                            if (saveFileBuiltinIsEnabled) {
                                isc.DMI.callBuiltin({
                                    methodName: "saveFile",
                                    "arguments": [ path, xmlContent ]
                                });
                            }
                            tools.xmlFileName = outputFileParam;
                        } else {
                            ind = outputFileParam.lastIndexOf(".");
                            if (ind > 0) {
                                tools.xmlFileName = outputFileParam.substring(0, ind);
                            } else {
                                tools.xmlFileName = outputFileParam;
                            }
                            tools.xmlFileName += ".xml";
                        }
                        isc.DMI.callBuiltin({
                            methodName: "xmlToJS",
                            "arguments": xmlContent,
                            callback : function (rpcResponse) {
                                if (!outputFileParam ||
                                    outputFileParam.substr(outputFileParam.length - 3) == ".js") {
                                    var path = outputFileParam;
                                    if (!path.startsWith("[")) path = "[TOOLS]/" + path;
                                    if (saveFileBuiltinIsEnabled) {
                                        isc.DMI.callBuiltin({
                                            methodName: "saveFile",
                                            "arguments": [
                                                path,
                                                rpcResponse.data
                                            ]
                                        });
                                    }
                                }
                                isc.Class.evaluate(rpcResponse.data);
                                onScriptEvaluated();
                            }
                        });
                    } else {
                        var toolsMockupFilePrefix = "[TOOLS]";
                        if (mockupFilePrefix && mockupFilePrefix[0] == '/') {
                            toolsMockupFilePrefix += "/";
                        }
                        toolsMockupFilePrefix += mockupFilePrefix;
                        if (saveFileBuiltinIsEnabled) {
                            isc.DMI.callBuiltin({
                                methodName: "saveFile",
                                "arguments": [toolsMockupFilePrefix + ".xml", xmlContent]
                            });
                        }
                        isc.DMI.callBuiltin({
                            methodName: "xmlToJS",
                            "arguments": xmlContent,
                            callback : function (rpcResponse) {
                                if (saveFileBuiltinIsEnabled) {
                                    isc.DMI.callBuiltin({
                                        methodName: "saveFile",
                                        "arguments": [
                                            toolsMockupFilePrefix + ".js",
                                            rpcResponse.data
                                        ]
                                    });
                                }
                                isc.Class.evaluate(rpcResponse.data);
                                onScriptEvaluated();
                            }
                        });
                    }
                });
            };

            var contents = fileContent;
            var path = filePath;
            if (contents != null) {
                // If the browser supports HTML5 history.pushState(), use it to change the URL
                // to the generic `bmmlImporter.jsp' URL because the previous bookmarkable URL
                // does not represent the import of an uploaded BMML file.
                if (isc.isA.Function(history.pushState)) {
                    var workBuilder = isc.URIBuilder.create(isc.Page.getAppDir());
                    workBuilder.appendPath("bmmlImporter.jsp");
                    if (skin) {
                        workBuilder.setQueryParam("skin", skin);
                    }
                    history.pushState(null, null, workBuilder.uri);
                }

                refreshItem.disable();
                refreshItem.hide();
                processContents(contents, path);

            } else if (reifyPreviewMode) {
                // support OfflineFileSource for screen/project loading
                if (!screenDSParam) screenDSParam = isc.OfflineFileSource.create();
                // pass the Mockup Mode string to processContents()
                requestMockupScreenXml(mockupParam, screenDSParam, projectDSParam,
                    function (data) {
                        refreshItem.enable();
                        refreshItem.show();
                        processContents(data, mockupParam);
                    }
                );
            } else {
                // Load from file
                var fileSystemDs = isc.DataSource.getDataSource("Filesystem");
                fileSystemDs.fetchData({
                    path: mockupParam,
                    webrootOnly: false
                }, function (rpcResponse, data) {
                    // if an error occurs, warn and launch import dialog
                    if (rpcResponse.status < 0) {
                        isc.clearPrompt();
                        isc.warn(data, function () {importButton.click();});
                        return;
                    }
                    var contents = data[0].contents;
                    var path = data[0].path;
                    refreshItem.enable();
                    refreshItem.show();
                    processContents(contents, path);
                }, { operationId: "loadFile", willHandleError: true });
            }
        }
    };

	isc.addProperties(dialogProperties, {_constructor: "BMMLImportDialog"});

    if (reifyPreviewMode) isc.addProperties(dialogProperties, {
        title: "Reify Settings", showImportForm: false, outputFieldTitle: "Output Screen Name"
    });
	
	importPane = isc.HLayout.create({
		autoDraw: false,
		align: "center",
		defaultLayoutAlign: "center",
		vPolicy: "none",
		membersMargin: 20,
	    importDialogDefaults: dialogProperties,
 	    autoChildren: ["importDialog"]
    });
	mockupLayout.addMember(importPane);

	// Now observe and handle importDialog hide() and closeClick()
	importPane.observe(importPane.importDialog, "hide",       "observer.hide();");
	importPane.observe(importPane.importDialog, "closeClick", "window.location.reload();");

    if(isc_websiteMode) {
        var example1_link = "\"/examples/shared/bmml/example%20mockup%20for%20Balsamiq%20resizebars%20and%20layouts.bmml\"";
        var example2_link = "\"/examples/shared/bmml/example%20mockup%20for%20demo%203%20v1.0.bmml\"";
	    sampleFiles = isc.VLayout.create({
			width: 170,
			height: 340,
			membersMargin: 0,
			border: "1px solid grey",
			backgroundColor: "#f5f5f5",
			autoDraw: false,
			titleDefaults: {
				_constructor: "Label",
				align: "center",
				height: 10,
				margin: 5,
				contents: "<h3>Sample Balsamiq files</h3>"
			},
			textDefaults: {
				_constructor: "Label",
				valign: "top",
				contents: "<div style='margin-left:10px'>" +
					"If you don't have any Balsamiq files, try using these to test out Reify. " +
                    "Click a link to populate the form's fetch URL, then click the 'Import' " +
                    "button" +
					"</div>" +
					"<ul style=\"margin-left: -1em;\">" +
					"<li><a href=" + example1_link + " onClick='return populateFormField(" + example1_link + ")' " +
					    ">Resize bars & Layouts</a></li>" +
					"<li><a href=" + example2_link + " onClick='return populateFormField(" + example2_link + ")' " +
					    ">Navigation, Charts</a></li>" +
					"</ul>"
			},
 	    	autoChildren: ["title", "text"]
    	});
 		importPane.addMember(sampleFiles);
 	}
    
    importDialog = importPane.importDialog;
    return (importDialog);
};

createBMMLImportDialog();

function populateFormField(url) {
    importDialog.vm.setValue("fileURL", location.host + url);
    return false;
}

var mockupParam = isc.params.mockup;
var outputFileParam = isc.params.outputFile;
var dropMarkupParam = isc.params.dropMarkup;
var trimSpaceParam = isc.params.trimSpace;
var fillSpaceParam = isc.params.fillSpace;
var autoRefreshParam = isc.params.autoRefresh;
var fieldNamingConventionParam = isc.params.fieldNamingConvention;
var mockupUploadedParam = isc.params.mockupUploaded;
var screenDSParam = isc.params.screenDS;
var projectDSParam = isc.params.projectDS;

function invokeReify() {
    importDialog.hide();
    importDialog.submit(mockupParam, outputFileParam, null, isc.params.skin || "Tahoe",
                        dropMarkupParam != "no", trimSpaceParam != "no", fillSpaceParam != "no",
                        fieldNamingConventionParam, autoRefreshParam, false, true);
}

if (mockupParam || reifyPreviewMode) invokeReify();

// scheduleReifyUpdate() is globally visible to VisualBuilder
var updateTimer;
scheduleReifyUpdate = function () {
    if (updateTimer || !refreshItem.getValue()) return;
    
    updateTImer = isc.Timer.setTimeout(function () {
        invokeReify();
        updateTimer = null;
    });
}

</script>
</body>
</html>
