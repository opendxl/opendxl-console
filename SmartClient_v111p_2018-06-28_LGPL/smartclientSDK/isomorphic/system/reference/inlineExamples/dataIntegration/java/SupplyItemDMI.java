//----------------------------------------------------------------------
// Isomorphic SmartClient
//
// SupplyItemDMI implementation
//
//----------------------------------------------------------------------

package com.isomorphic.examples;

import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

import com.isomorphic.log.*;
import com.isomorphic.util.*;
import com.isomorphic.datasource.*;

// the <serverObject> declaration in supplyItemDMI.ds.xml directs the SmartClient Java
// server libraries to find the SupplyItemFetch class.  
// Several ways of finding or creating the DMI target are supported, including via Spring, or
// via session or request attributes.  See ServerObject.lookupStyle in the SmartClient Reference.
// You can also provide your own servlet, invoking SmartClient DMI from a Spring Controller or
// Struts Action.
public class SupplyItemDMI {

    Logger log = new Logger(SupplyItemDMI.class.getName());

    // By default, for a DSRequest of type "fetch", a method named "fetch" is invoked.  You can
    // customize this via the <serverObject> declaration.
    public DSResponse fetch(DSRequest dsRequest) 
        throws Exception 
    {
        log.info("procesing DMI fetch operation");

        // this implementation shows data paging (returning only ranges of requested records)
        long startRow = dsRequest.getStartRow();
        long endRow = dsRequest.getEndRow();

        long totalRows = SupplyItemStore.getMatchingRowcount((Long)dsRequest.getFieldValue("itemID"),
                                                             (String)dsRequest.getFieldValue("itemName"));

        // Fetch a List of matching SupplyItem Beans from some pre-existing Java object model
        // provided by you, represented by "SupplyItemStore" in this example
        List matchingItems =
            SupplyItemStore.findMatchingItems((Long)dsRequest.getFieldValue("itemID"),
                                              (String)dsRequest.getFieldValue("itemName"),
                                              (int)startRow, (int)endRow);

        DSResponse dsResponse = new DSResponse();
        dsResponse.setTotalRows(totalRows);
        dsResponse.setStartRow(startRow);

        endRow = Math.min(endRow, totalRows);
        dsResponse.setEndRow(endRow);
        
        // just return the List of matching beans
        dsResponse.setData(matchingItems);

        return dsResponse;
    }
 
    // Declared parameters of the method are automatically provided.  For example, if your
    // method declares a parameter of type HttpServletRequest, the current HttpServletRequest
    // will be passed.
    // If you declare a parameter that is a Java Bean, SmartClient will create an instance of
    // the bean and apply the DSRequest data to the bean via Java reflection, matching
    // DataSource fields to Java setter methods.  For example, for the DataSource field
    // "itemName", SupplyItem.setItemName() is called.
    public SupplyItem add(SupplyItem record)
        throws Exception
    {
        log.info("procesing DMI add operation");

        // most ORM systems can store a new Object with a single call like this.
        SupplyItemStore.storeItem(record);

        // return the record-as-saved so SmartClient can update client-side caches.  This
        // pattern ensures client-side components receive server-generated fields (such as an
        // auto-generated primaryKey value).  SmartClient can then update caches in place
        // instead of re-fetching data.
        return record;
    }

    // The "update" method declares a parameter of type "Map" and so receives DSRequest.data as
    // a Java Map.  For an "update" operation, the data includes updated fields and always
    // includes the field declared as primaryKey:true.
    public SupplyItem update(Map record)
        throws Exception
    {
        log.info("procesing DMI update operation");

        // look up the existing data by primary key
        SupplyItem existingRecord = SupplyItemStore.getItemByID((Long)record.get("itemID"));

        // DataTools.setProperties() is a SmartClient API that applies a Map of properties to a
        // Bean via reflection, matching Map keys to setter methods on the Bean.
        DataTools.setProperties(record, existingRecord);

        // store it, and return the record-as-saved so SmartClient can update client-side caches.  
        SupplyItemStore.storeItem(existingRecord);
        return existingRecord;
    }


    public SupplyItem remove(SupplyItem record) 
        throws Exception
    {
        log.info("procesing DMI remove operation");

        // on a removal, just return
        return SupplyItemStore.removeItem(record.getItemID());
    }
}
