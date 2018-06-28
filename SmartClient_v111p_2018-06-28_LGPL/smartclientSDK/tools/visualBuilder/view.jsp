<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>
<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isc" %>
<%
    RequestContext context = RequestContext.instance(this, request, response, out);        
    Config iscConfig = Config.getGlobal();
    String webRoot = iscConfig.getPath("webRoot");
    String toolsDir = iscConfig.getPath("toolsDir");

    String screen = request.getParameter("screen");
    if (screen == null) screen = "default";

    String workspaceFile = toolsDir+"/visualBuilder/workspace/"+screen+".xml";

    String skin = request.getParameter("skin");
    if (skin == null) skin = "SmartClient";

%>
<HTML><HEAD><TITLE><%=isc_getShortURI(request)%></TITLE>
<isomorphic:loadISC includeModules="SalesForce" skin="<%=skin%>"/>
</HEAD><BODY>

<SCRIPT>
<%
// Put an outer tag around the contained XML, to allow multiple top-level elements        
Reader reader = new SequenceReader("<isomorphicXML xmlns:xsi=\"nativeType\">",
                                   new FileReader(workspaceFile),
                                   "</isomorphicXML>");
XML.toJS(reader, out);        
%>
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
