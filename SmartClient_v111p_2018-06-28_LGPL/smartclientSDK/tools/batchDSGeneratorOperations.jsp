<%
// This file allows the execution of "Builtin RPCs" which are unsafe in
// environments where users are not trusted. If Visual Builder is deployed in
// production, this file should be protected by an authentication system and/or
// restricted to adminstrator users.

%><%@ page import="java.util.*"
%><%@ page import="com.isomorphic.rpc.*"
%><%@ page import="com.isomorphic.datasource.*" 
%><%


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
            //     String[] allowedBuiltIns = {"getDefinedDatabases", "getTables"};
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
            rpc.send(newReq, newReq.execute());
        }
    } catch (Throwable e) {
        rpc.sendFailure(req, e);
    }

} // for(requests)

%>