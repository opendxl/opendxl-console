package com.isomorphic.examples.server.customDownload;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.rpc.RPCManager;

public class CustomDownload {

	public void downloadData(DSRequest dsRequest, RPCManager rpc)
    {
        DSResponse dsResponse = new DSResponse();
        try {
        	rpc.doCustomResponse();
            HttpServletResponse response = rpc.getContext().response;
            response.setHeader("content-disposition", "attachment; filename=downloadDescriptions.txt"); 
            response.setContentType("text/plain");

        	dsResponse = dsRequest.execute();
        	
        	List list = dsResponse.getDataList();
        	String result = "";
        	Iterator iterator = list.iterator();
        	while (iterator.hasNext()) {
        		Map record =  (Map)iterator.next();
        		String itemName = (record.get("itemName") == null)?"":record.get("itemName").toString();
        		String description = (record.get("description") == null)?"":record.get("description").toString();
        		result = result + itemName + " : " + description + "\n\n";  
        	}
        	ServletOutputStream out = response.getOutputStream();
        	out.write(result.getBytes());
        	dsResponse.setStatus(DSResponse.STATUS_SUCCESS);
            rpc.send(dsRequest, dsResponse);
        } catch (Exception e) {
        	try {
        		rpc.sendFailure(dsRequest, e.getMessage());
        	} catch(Exception er) {}
        }
    }
}
 
