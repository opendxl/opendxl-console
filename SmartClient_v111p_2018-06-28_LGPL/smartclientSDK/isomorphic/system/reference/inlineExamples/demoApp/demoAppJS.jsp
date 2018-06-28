<!--------------------------------------------------------------------
	SmartClient SDK
	Demo Application (JS code) + resizeBars

	Copyright 2005 Isomorphic Software, Inc. (www.isomorphic.com)
---------------------------------------------------------------------->

<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>

<HTML><HEAD><TITLE>SmartClient Demo Application</TITLE>
<!--  -->
<isomorphic:loadISC skin="Tahoe"/>
</HEAD><BODY CLASS="pageBackground" STYLE="overflow:hidden">

</STYLE>
<SCRIPT>
isc.setAutoDraw(false);

// Load DataSources
// ---------------------------------------------------------------------

<isomorphic:loadDS name="supplyItem"/>
<isomorphic:loadDS name="supplyCategory"/>

// Set up the app img dir so we pick up the example's images
isc.Page.setAppImgDir(isc.Page.getIsomorphicDocsDir()+"exampleImagesTahoe/");

// Set the density to Spacious:
isc.Canvas.resizeFonts(3);
isc.Canvas.resizeControls(10);

</SCRIPT>

<!--  Pick up application UI and logic from the .js UI file
  ======================================================================
-->
<script src="demoAppJS.js"></script>
</BODY>
</HTML>
