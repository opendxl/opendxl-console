//----------------------------------------------------------------------
// Isomorphic SmartClient
//
// SupplyItemFetch implementation
//
//----------------------------------------------------------------------

package com.isomorphic.examples;

import java.util.*;

import com.isomorphic.log.*;
import com.isomorphic.util.*;
import com.isomorphic.datasource.*;



public class SupplyItemFetch {

    // This method receives a SmartClient DSRequest object and returns a valid DSResponse,
    // fulfilling the "fetch" operation for the SupplyItem DataSource.
    // There are multiple ways to direct incoming requests to this method - SmartClient DMI is
    // one - this example focuses on fulfilling the request.
    public DSResponse fetch(DSRequest dsRequest) 
        throws Exception 
    {
        // for a fetch, the DSRequest contains search criteria.
        // Fetch a List of matching SupplyItem Beans from some pre-existing Java object model
        // provided by you, represented by "SupplyItemStore" in this example.
        List matchingItems =
            SupplyItemStore.findMatchingItems((Long)dsRequest.getFieldValue("itemID"),
                                              (String)dsRequest.getFieldValue("itemName"));

        // provide the List of Beans as the data for the DSResponse.  SmartClient automatically
        // converts these Beans to JavaScript Objects and provides them to the component that
        // made the request.  All you need to do is name your DataSource fields after Java Bean
        // properties.
        DSResponse dsResponse = new DSResponse(dsRequest == null ? (DataSource)null :
                                                                   dsRequest.getDataSource());
        dsResponse.setData(matchingItems);
        return dsResponse;
    }
}
