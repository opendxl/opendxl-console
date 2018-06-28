<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>
<HTML><HEAD>
<STYLE>
.normal			{font-family:Verdana; font-size:12px;}
.pageHeader2	{font-family:Verdana; font-size:24px; font-weight:bold;}
</STYLE>
<TITLE>SmartClient Admin Console</TITLE>
</HEAD><BODY BGCOLOR='#DDDDDD' CLASS=normal>

<!-- load Isomorphic SmartClient -->
<isomorphic:loadISC modulesDir="system/development/" includeModules="AdminConsole,FileBrowser,Tools,ServerLogViewer,History,Scheduler" skin="Enterprise"/>

<script><isomorphic:loadSystemSchema /></script>

<SCRIPT>
RPCManager.actionURL = Page.getAppDir() + "adminConsoleOperations.jsp";

<isomorphic:loadDS ID="Filesystem"/>

isc.AdminConsole.create({
    width: "100%",
    height: "100%"        
});

</SCRIPT>

</BODY>
</HTML>
