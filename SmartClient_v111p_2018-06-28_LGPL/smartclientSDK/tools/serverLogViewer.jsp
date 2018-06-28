<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>
<HTML><HEAD>
<STYLE>
.normal			{font-family:Verdana; font-size:12px;}
.pageHeader2	{font-family:Verdana; font-size:24px; font-weight:bold;}
</STYLE>
<TITLE>ISC Server Log Viewer</TITLE>
</HEAD><BODY BGCOLOR='#DDDDDD' CLASS=normal STYLE="overflow:hidden">

<LINK REL="stylesheet" TYPE="text/css" HREF="..//isomorphic/system/reference/serverLogStyles.css">

<!-- load Isomorphic SmartClient -->
<isomorphic:loadISC modulesDir="system/development/" includeModules="ServerLogViewer" skin="Enterprise"/>

<SCRIPT>
Page.leaveScrollbarGap = false;

isc.ServerLogViewer.create({
    width: "100%",
    height: "100%"        
});

</SCRIPT>

</BODY>
</HTML>
