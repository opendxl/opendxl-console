<!--------------------------------------------------------------------
	SmartClient SDK
	Demo Application (JS code) + resizeBars

	Copyright 2005 Isomorphic Software, Inc. (www.isomorphic.com)
---------------------------------------------------------------------->

<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>

<HTML><HEAD><TITLE>SmartClient Demo Application</TITLE>
<!--  -->
<isomorphic:loadISC skin="BlackOps"/>
</HEAD><BODY CLASS="pageBackground" STYLE="overflow:hidden">

<SCRIPT>
isc.setAutoDraw(false);

// Load DataSources
// ---------------------------------------------------------------------

<isomorphic:loadDS name="supplyItem"/>
<isomorphic:loadDS name="supplyCategory"/>

// Set up the app img dir so we pick up the example's images
isc.Page.setAppImgDir(isc.Page.getIsomorphicDocsDir()+"exampleImages/");

// Pick up application UI and logic from the .xml UI file
// ---------------------------------------------------------------------
<isomorphic:XML>
<%@include file="demoAppXML.xml" %>
</isomorphic:XML>


</SCRIPT>
</BODY>
</HTML>
