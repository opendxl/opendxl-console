<%
// This file allows the execution of "Builtin RPCs" which are unsafe in
// environments where users are not trusted. If Visual Builder is deployed in
// production, this file should be protected by an authentication system and/or
// restricted to adminstrator users.

%><%@ page import="java.util.*"
%><%@ page import="com.isomorphic.rpc.*"
%><%@ page import="com.isomorphic.datasource.*" 
%><%

// this code sets the response contentType, so do this first before any JSP output is flushed
// to the response stream.  Some (arguaby broken) app servers may fail to let us set the
// contentType here even though it's the very first line of code - which is ok
// because the browser will still execute the code as JS - it just may carp about it.
if (Boolean.valueOf(request.getParameter("checkPresent"))) {
    response.setContentType("application/javascript");

    out.print("window.consoleOperationsEnabled=true;");
    out.print(String.format("isc.RPCManager.actionURL='%s';", request.getRequestURI()));
    return;
}

RPCManager rpc;
try {
    rpc = new RPCManager(request, response, out);
    // Enable access to FilesystemDataSource
    rpc.enableAllDataSources();
} catch (ClientMustResubmitException e) { 
    return; 
}

for(Iterator i = rpc.getRequests().iterator(); i.hasNext();) {
    Object req = i.next();
    try {
	    if(req instanceof RPCRequest) {
	        RPCRequest newReq = (RPCRequest)req;
            // See reference documentation on "Tools Deployment" for more information on tool security.
            //
            // To limit access to an explicit set of BuiltinRPC methods, uncomment the following lines:
            //     String[] allowedBuiltIns = {"getDefinedDatabases", "getDefinedDataSources", "importDataSources",
            //         "downloadClientContent", "setDefaultDB", "testDB", "saveDBConfig", "discoverJNDIDatabases"};
            //     String appID = newReq.getAppID();
            //     if ("isc_builtin".equals(appID)) {
            //         String methodName = newReq.getMethodName();
            //         if (!Arrays.asList(allowedBuiltIns).contains(methodName)) {
            //             throw new Exception("Attempt to execte RPC DMI BuiltIn '" + methodName
            //                  +"' DENIED.");
            //         }
            //     }

	        RPCResponse newResp;
	        try {
	            // To limit access to BuiltIn methods defined in server.properties, replace
	            // the line below with:
	            //     newResp = RPCDMI.execute(newReq, rpc, newReq.context);
	            newResp = RPCDMI.execute(newReq, rpc, newReq.context, true);
	            if (newResp == null) newResp = newReq.execute();
	        } catch (Exception e) {
                e.printStackTrace();
	            newResp = new RPCResponse();
	            newResp.setStatus(RPCResponse.STATUS_FAILURE);
	            newResp.setData("An error occurred when executing this operation on the server.\n"+
	                "Exception details are as follows:\n\n" + e);
	        }
	
	        rpc.send(newReq, newResp);
	    } else {
	        DSRequest newReq = (DSRequest)req;
	        try {
	            rpc.send(newReq, newReq.execute());
	        } catch (Exception e) {            
	            rpc.sendFailure(newReq, e);
	        }
	    }
    } catch (Throwable e) {
        rpc.sendFailure(req, e);
    }

} // for(requests)

%>