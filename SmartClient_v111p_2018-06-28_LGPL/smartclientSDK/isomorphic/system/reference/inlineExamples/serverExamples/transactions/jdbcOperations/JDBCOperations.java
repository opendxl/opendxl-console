//----------------------------------------------------------------------
// Isomorphic SmartClient
//
// DMI implementation for the Transactional User Operations sample
//
//----------------------------------------------------------------------

package com.isomorphic.examples.server.transactions;

import java.sql.*;
import com.isomorphic.datasource.*;

public class JDBCOperations {

    public DSResponse goodJDBCUpdate(DSRequest req) throws Exception {
        return update(req, "UPDATE lastUpdated SET lastUpdatedTime = ? WHERE pk = ?");
    }

    public DSResponse badJDBCUpdate(DSRequest req) throws Exception {
        // Deliberately broken - misspelt column name
        return update(req, "UPDATE lastUpdated SET lastUpatedTime = ? WHERE pk = ?");
    }
    
    public DSResponse update(DSRequest req, String sql) throws Exception {

        DSResponse resp = new DSResponse();

        // We must mark the DSRequest as transactional, so that SmartClient Server knows whether
        // to mark it as failed if another transactional update fails
        req.setPartOfTransaction(true);
        
        // We make the update part of the transaction by using the dataSource's transaction
        // object, which in the case of a SQLDataSource will be a java.sql.Connection
        Connection conn = (Connection)((BasicDataSource)req.getDataSource()).getTransactionObject(req);
        if (conn == null) {
            resp.setStatus(-1);
            resp.setData("No transaction to join.  Please make some changes before clicking " +
                         "the Save buttons");
            return resp;
        }
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setTimestamp(1, new Timestamp(System.currentTimeMillis()));
        Object pk = req.getValues().get("pk");
        stmt.setInt(2, Integer.parseInt(pk.toString()));
        stmt.executeUpdate();
        stmt.close();
        resp.setStatus(DSResponse.STATUS_SUCCESS);
        return resp;
    }
}
