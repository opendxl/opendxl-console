//----------------------------------------------------------------------
// Isomorphic SmartClient
//
// CartDMI implementation for the User-Specific Data example
//
// This example shows one way to insert your own logic into SmartClient's 
// normal client/server flow.  All operations of the cartItem DataSource 
// are routed to this class's enforceUserAccess() method, which simply 
// stamps the user's session ID onto the DSRequest and then executes it
// (which calls back into the normal SmartClient flow).  This provides a 
// robust way to ensure that all DataSource requests have the requesting
// session's ID passed to all operations; since cartItem is a SmartClient
// SQL DataSource, the session ID will be used to filter fetch-type 
// operations, and will be persisted in update- and add-type operations. 
//
//----------------------------------------------------------------------

package com.isomorphic.examples.server.userSpecificData;

import javax.servlet.http.HttpServletRequest;

import com.isomorphic.datasource.DataSource;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;

public class CartDMI {

    public DSResponse enforceUserAccess(DSRequest dsRequest, HttpServletRequest servletRequest)
    throws Exception
    {
        String sessionId = servletRequest.getSession().getId();
        if (DataSource.isAdd(dsRequest.getOperationType()))
            dsRequest.setFieldValue("sessionId", sessionId);
        else
            dsRequest.setCriteriaValue("sessionId", sessionId);
        
        return dsRequest.execute();
    }
}
