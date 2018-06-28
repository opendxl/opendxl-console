<% 

%>
<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>
<%@ page import="com.isomorphic.base.*" %>
<%@ page import="com.isomorphic.rpc.*" %>
<%@ page import="com.isomorphic.auth.*" %>
<%@ page import="com.isomorphic.servlet.*" %>
<%@ page import="java.util.*" %>
<%
    RequestContext requestContext = RequestContext.instance(this, request, response, out);
    String username = requestContext.request.getRemoteUser();
    boolean authenticated = username != null;
%>
<%!

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
%>

<%
    // Lets get the path of the current page and replace index.jsp with vbOperations.jsp
    final String vbOperationsPath = request.getRequestURI().replace("/index.jsp", "/vbOperations.jsp");
    // Now we can fetch the vbOperations.jsp resource, if null it's not there.
    final boolean vbOperationsDoesNotExist = application.getResource(vbOperationsPath) == null;

    ISCInit.go(getClass().getName());
    baseConfig = Config.getGlobal();

    enabledBuiltinMethods.addAll(baseConfig.getList("RPCManager.enabledBuiltinMethods"));
    allowAnyRPC = enabledBuiltinMethods.contains("*");

    // Use IDACall if the server is explicitly configured to use it or if vbOperations.jsp does not exist.
    useIDACall = baseConfig.getBoolean("VisualBuilder.useIDACall", false) || vbOperationsDoesNotExist;

    // if currentScreen param has been provided, it will override normal screen selection logic
    final String initialScreen = request.getParameter("currentScreen");

    // If the mockups param is present, and is anything but "0" or (case-insensitive) "no", then
    // consider it be a request to run VB in Mockup Mode
    String mockups = request.getParameter("mockups");
    final boolean mockupMode = mockups != null && !"0".equals(mockups) && 
                                       !"no".equalsIgnoreCase(mockups);

    final String title = (mockupMode ? "SmartMockups" : "SmartClient Visual Builder");
%>
<!DOCTYPE html>
<HTML>
<HEAD>
<TITLE><%=title%></TITLE>
<LINK REL=StyleSheet HREF="visualBuilder.css" TYPE="text/css">
</HEAD>
<BODY STYLE="overflow:hidden">

<%
if (authenticated) {
   requestContext.jsTrans.toJSVariableInScript(new Boolean(authenticated), "authenticated", out);    
   requestContext.jsTrans.toJSVariableInScript(username, "username", out);    
}

String skin = request.getParameter("skin");
if (skin == null || "".equals(skin)) skin = "Graphite";

String nSkin = request.getParameter("useNativeSkin");
boolean useNativeSkin = nSkin == null || "1".equals(nSkin);
%>
<!-- load Isomorphic SmartClient -->
<isomorphic:loadISC modulesDir="system/development/" skin="<%=skin%>" includeModules="AdminConsole,FileLoader,DocViewer,FileBrowser,Drawing,Charts,Analytics"/>
<SCRIPT>
isc.nativeSkin = <%=useNativeSkin%>;
if (!<%= useIDACall %>) {
    RPCManager.actionURL = Page.getAppDir() + "vbOperations.jsp";
}

isc.isVisualBuilderSDK = true;
isc.Page.setAppImgDir("graphics/");
isc.Page.leaveScrollbarGap = false;

if (isc.Browser.isSafari) {
    isc.FileLoader.loadFile("referenceDocs.js", "isc.jsdoc.init(docItems)");
} else {
    isc.xml.loadXML("referenceDocs.xml", "isc.jsdoc.init(xmlDoc)");
}
// load datasource files
<isomorphic:loadSystemSchema/>

// load FileSources
<isomorphic:loadDS ID="vbScreens,vbSettings,vbProjects,vbDataSources" />
</SCRIPT>

<!-- load Tools resources -->
<isomorphic:loadModules modulesDir="system/development/" modules="Tools"/>

<!-- Additional ToolSkin to apply to Tools controls -->

<%if (useNativeSkin) {%>
<SCRIPT src=../../isomorphic/skins/ToolSkinNative/load_skin.js></SCRIPT>
<%} else {%>
<SCRIPT src=../../isomorphic/skins/ToolSkin/load_skin.js></SCRIPT>
<%}%>
<!-- load application logic -->
<isomorphic:loadModules modulesDir="system/development/" modules="VisualBuilder,SalesForce"/>

<SCRIPT>var screenConfiguration = null;</SCRIPT>
<%if (initialScreen == null) {%>
<SCRIPT>var screenConfiguration;</SCRIPT>
<%} else {%>
<SCRIPT>var screenConfiguration = {initialScreen: "<%=initialScreen%>"};</SCRIPT>
<%}%>

<SCRIPT>

var useIDACall = <%= useIDACall %>;
window.builder = isc.VisualBuilder.create({
    width: "100%",
    height: "100%",
    autoDraw: true,
    userId: <% requestContext.jsTrans.toJS(username, out); %>,

    saveFileBuiltinIsEnabled: !useIDACall || <%= isBuiltinMethodEnabled("saveFile")  && isPrefixEnabled("[TOOLS]", "saveFile") %>,
    loadFileBuiltinIsEnabled: !useIDACall || <%= isBuiltinMethodEnabled("loadFile") %>,
    filesystemDataSourceEnabled: !useIDACall || <%= baseConfig.getBoolean("FilesystemDataSource.enabled", false) %>,

	skin: "<%=skin%>",
    defaultApplicationMode: "edit",
    showModeSwitcher: true,
    mockupMode: <%=mockupMode%>,
    singleScreenMode: false,
    
    // provide an initial top-level VLayout that is appropriate for a fullscreen app:
    // take up whole browser, never overflow
    initialComponent: {
        type: "DataView",
        defaults: {
            autoDraw: true,
            overflow: "hidden",
            width: "100%",
            height: "100%",
            // this is enough to make it obvious that a badly scrunched component
            // such as a ListGrid is actually a scrunched ListGrid and not just a
            // 1px black line (which happens with the default minMemberSize of 1)
            minMemberSize: 18
        }
    }
}, screenConfiguration);

<% if (request.getParameter("mockup") != null) { %>
var mockupParam = '<% out.write(request.getParameter("mockup")); %>';
<% } else { %>
var mockupParam = "";
<% } %>

if (mockupParam != "") {
    window.builder.loadBMMLMockup(mockupParam);
}

</SCRIPT>

</BODY>
</HTML>
