<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>
<HTML><HEAD>
<TITLE>Class Browser</TITLE>
</HEAD><BODY BGCOLOR='#DDDDDD' CLASS=normal>
<LINK REL="stylesheet" TYPE="text/css" HREF="sourceColorizer.css">
<isomorphic:loadISC modulesDir="system/modules/" includeModules="SyntaxHiliter,ClassBrowser" skin="Enterprise"/>
<SCRIPT>
isc.ClassBrowser.showWindow();
</SCRIPT>

</BODY>
</HTML>