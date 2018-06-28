<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>
<HTML><HEAD>
<TITLE>DataSource Builder</TITLE>
</HEAD><BODY BGCOLOR='#DDDDDD' CLASS=normal>
<LINK REL="stylesheet" TYPE="text/css" HREF="sourceColorizer.css">
<isomorphic:loadISC modulesDir="system/modules/" includeModules="SQLBrowser,DSBrowser" skin="BlackOps"/>
<SCRIPT>
<isomorphic:loadDS name="RepoRegistry"/>
isc.DSBrowser.showWindow();
</SCRIPT>
</BODY>
</HTML>
