<% 

%><%
// This file allows the execution of "Builtin RPCs" which are unsafe in
// environments where users are not trusted. If Visual Builder is deployed in
// production, this file should be protected by an authentication system and/or
// restricted to adminstrator users.

%><%@ page import="java.io.*"
%><%@ page import="java.util.*"
%><%@ page import="java.lang.reflect.*"

%><%@ page import="javax.servlet.*"
%><%@ page import="javax.servlet.http.*"

%><%@ page import="com.isomorphic.base.*"
%><%@ page import="com.isomorphic.util.*"
%><%@ page import="com.isomorphic.io.*"
%><%@ page import="com.isomorphic.log.*"
%><%@ page import="com.isomorphic.servlet.*"
%><%@ page import="com.isomorphic.xml.*"
%><%@ page import="com.isomorphic.store.*"
%><%@ page import="com.isomorphic.application.*"
%><%@ page import="com.isomorphic.rpc.*"
%><%@ page import="com.isomorphic.js.*"
%><%@ page import="com.isomorphic.datasource.*"

%><%!
    private Config baseConfig;

%><%
ISCInit.go(getClass().getName());
baseConfig = Config.getGlobal();
if (baseConfig.getBoolean("VisualBuilder.useIDACall", false)) {
    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Because VisualBuilder.useIDACall in the server config is set, vbOperations.jsp is disabled.");
    return;
}

// Instantiate an RPCManager so we can get the requests.
//
RPCManager rpc;
try {
    rpc = new RPCManager(request, response, out);
} catch (ClientMustResubmitException e) { 
    return; 
}

for(Iterator i = rpc.getRequests().iterator(); i.hasNext();) {
    Object req = i.next();
    try {
        if (req instanceof RPCRequest) {
            RPCRequest newReq = (RPCRequest)req;
            // See reference documentation on "Tools Deployment" for more information on tool security.
            //
            // To limit access to an explicit set of BuiltinRPC methods, uncomment the following lines:
            //     String[] allowedBuiltIns = {"xmlToJS", "loadFile", "saveFile", "getDefinedDataSources", "downloadClientContent"};
            //     String appID = newReq.getAppID();
            //     if ("isc_builtin".equals(appID)) {
            //         String methodName = newReq.getMethodName();
            //         if (!Arrays.asList(allowedBuiltIns).contains(methodName)) {
            //             throw new Exception("Attempt to execte RPC DMI BuiltIn '" + methodName
            //                  +"' DENIED.");
            //         }
            //     }

            // To limit access to BuiltIn methods defined in server.properties, replace
            // the line below with:
            //     RPCResponse newResp = RPCDMI.execute(newReq, rpc, newReq.context);
            RPCResponse newResp = RPCDMI.execute(newReq, rpc, newReq.context, true);
            if (newResp == null) newResp = newReq.execute();
            rpc.send(newReq, newResp);
        } else {
            DSRequest newReq = (DSRequest)req;
            // some DataSource operations check if builtinRPCs are enabled before allowing 
            // similar operations. Set a flag to cause all such checks to pass
            newReq.setAllowAnyRPC(true);
            rpc.send(newReq, newReq.execute());
        }
    } catch (Throwable e) {
        // Send a special streamlined error message if the problem is missing HB .jars
        if (e instanceof java.lang.NoClassDefFoundError && 
            e.getMessage().indexOf("org/hibernate") != -1) 
        {
            rpc.sendFailure(req, "Hibernate .jars do not appear to be installed. " + 
                                 "Please see the Setup Guide and Deployment Instructions");
        } else {                               
            rpc.sendFailure(req, e);
        }
    }
} // for(requests)

%>