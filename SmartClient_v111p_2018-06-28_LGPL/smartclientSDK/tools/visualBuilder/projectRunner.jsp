<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>
<%
    boolean hosted = "1".equals(request.getParameter("hosted"));

    RequestContext context = RequestContext.instance(this, request, response, out);        
    Config iscConfig = Config.getGlobal();
    String webRoot = iscConfig.getPath("webRoot");
    String toolsDir = iscConfig.getPath("toolsDir");


    String locale = request.getParameter("locale");
 
    String viewType = request.getParameter("type");
    String screenName = request.getParameter("screen");
    String projectName = request.getParameter("project");

    String shareId = request.getParameter("shareId");

    boolean isShared = false;
    if (shareId != null) {
        DSRequest sharedDSRequest = new DSRequest("sharedProjects", "fetch");
        sharedDSRequest.setCriteria(DataTools.buildMap("shareId", shareId));
        DSResponse sharedDSResponse = sharedDSRequest.execute();
        Map record = sharedDSResponse.getRecord();
        if (record == null) throw new Exception("Invalid shareId");
        String paramString = (String)record.get("parameters");
        Map params = ServletTools.parseQueryString(paramString);
        viewType = (String)params.get("type");
        screenName = (String)params.get("screen");
        projectName = (String)params.get("project");
        isShared = true;
    }
    String skin = request.getParameter("skin");
    if (skin == null) skin = "Graphite";
%>
<HTML><HEAD><TITLE><%=isc_getShortURI(request)%></TITLE>
</HEAD><BODY>
<isomorphic:loadISC includeModules="SalesForce,Drawing,Charts,Analytics" skin="<%=skin%>"/>

<SCRIPT>
<%
if ("screen".equals(viewType)) {
    Screen screen = null;
    if (isShared) {
        screen = Screen.load(screenName);
    } else {
        screen = Screen.load(screenName, request.getRemoteUser());
    }
    if (screen == null) throw new Exception ("Unable to find screen: "+screenName);                                    
    context.jsTrans.toJS(screen, out);
} else if ("project".equals(viewType)) {
    Project project = null;
    if (isShared) {
        project = Project.load(projectName);
    } else {
        project = Project.load(projectName, request.getRemoteUser());
    }
    if (project == null) throw new Exception ("Unable to find project: "+projectName);                                    

    context.jsTrans.toJSVariable(project.getScreenNames(), "projectScreens", out);

    String currentScreenName = request.getParameter("currentScreen");
    if (currentScreenName == null) currentScreenName = project.getCurrentScreenName();
    context.jsTrans.toJSVariable(currentScreenName, "currentScreen", out);

    context.jsTrans.toJSVariable(locale, "locale", out);    
    context.jsTrans.toJSVariable(shareId, "shareId", out);    
 %>                                           
var requestParams = null;
if (shareId != null) requestParms = {params:{shareId:shareId}};
isc.RPCManager.cacheScreens(projectScreens, function (screen) {
    var screen = isc.RPCManager.createScreen(currentScreen);
    screen.draw();
}, locale, requestParams);
<% } else { %>
    throw new Exception("Invalid viewType: " + viewType);
<% } %>
        
</SCRIPT>

</BODY>
</HTML>
<%!
public String isc_getShortURI(HttpServletRequest request) {
    String uri = request.getRequestURI();
    int slashIndex = uri.lastIndexOf("/");
    if(slashIndex != -1) uri = uri.substring(slashIndex+1);
    return uri;
}
%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>

<%@ page import="com.isomorphic.base.*" %>
<%@ page import="com.isomorphic.util.*" %>
<%@ page import="com.isomorphic.js.*" %>
<%@ page import="com.isomorphic.servlet.*" %>
<%@ page import="com.isomorphic.datasource.*" %>
<%@ page import="com.isomorphic.io.*" %>
<%@ page import="com.isomorphic.rpc.*" %>
<%@ page import="com.isomorphic.xml.*" %>
<%@ page import="com.isomorphic.tools.*" %>
<%@ page import="com.isomorphic.log.*" %>
<%@ page import="com.isomorphic.collections.*" %>

