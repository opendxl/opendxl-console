//----------------------------------------------------------------------
// Isomorphic SmartClient
//
// CustomExportCustomResponseDMI implementation for a Custom Export example
//
// This example shows one way to insert your own logic into SmartClient's 
// normal client/server flow to export entirely arbitrary data without a 
// front-end component supplying the data.
//
//----------------------------------------------------------------------

package com.isomorphic.examples.server.customExport;

import java.text.SimpleDateFormat;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletOutputStream;

import com.isomorphic.servlet.*;
import com.isomorphic.rpc.*;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.log.Logger;

public class CustomExportCustomResponseDMI {

	private static Logger log = new Logger(DSRequest.class.getName());

    public static void customExport(RPCManager rpc, HttpServletResponse response)
    throws Exception
    {
        try {
        // setting doCustomResponse() notifies the RPCManager that we'll bypass RPCManager.send
        // and instead write directly to the servletResponse output stream
        rpc.doCustomResponse();

        RequestContext.setNoCacheHeaders(response);

        response.setContentType("text/plain");

        DSRequest request = rpc.getDSRequest();
        String filename = request.getExportFilename();
        response.addHeader("content-disposition", "attachment; filename="+ filename);

        log.warn("about to fetch data");
        // fetch some data - this need not be from the dataSource this DMI was called from
        DSRequest req = new DSRequest("supplyItem", "fetch");
        Map criteria = new HashMap();
        criteria.put("category", "General Office Products");
        criteria.put("inStock", true);
        req.setCriteria(criteria);
        List results = req.execute().getDataList();

        StringBuilder content = new StringBuilder("" + results.size() + " 'General Office Products' in stock:\n\n");
        for (Iterator i = results.iterator(); i.hasNext(); ) {
            Map record = (Map)i.next();
            content.append((String)record.get("itemName"));
            content.append("\n");
        }

        log.warn("FINDME - content is " + content.toString());

        ServletOutputStream os = response.getOutputStream();
        os.print(content.toString());
        os.flush();
        } catch (Exception e) {
            log.warn(e.getStackTrace());
        }

        return;
    }

}
