<HTML>
<HEAD>
<STYLE>
.normal				{font-family:Verdana; font-size:12px;}
.pageHeader2			{font-family:Verdana; font-size:24px; font-weight:bold;}
</STYLE>
<TITLE>Isomorphic Software - Configuration Viewer</TITLE>
</HEAD>
<BODY BGCOLOR='white' CLASS=normal>
<TABLE WIDTH=100% CELLSPACING=0 CELLPADDING=5 BORDER=0>
	<TR>
		<TD HEIGHT=125><a href="http://www.isomorphic.com"><IMG SRC="http://www.isomorphic.com/images/iso_top_logo.gif" WIDTH="256" HEIGHT="100" ALT="Isomorphic Software Logo" border="0"></a></TD>
		<TD VALIGN=MIDDLE ALIGN=RIGHT><SPAN CLASS=pageHeader2>Isomorphic SmartClient SDK<BR>
		Configuartion Viewer </SPAN><BR>
		</TD>
	</TR>
</TABLE>
<BR><TABLE WIDTH=100% CELLSPACING=0 CELLPADDING=0 BORDER=0><TR><TD BGCOLOR=336666><IMG SRC=images/blank.gif WIDTH=1 HEIGHT=4></TD></TR></TABLE><BR><BR>
<pre>
<%
DataTools.dumpConfig(out);
%>
</pre>
<%@ page import="com.isomorphic.util.*" %>
<%@ page import="com.isomorphic.base.*" %>
