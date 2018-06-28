//----------------------------------------------------------------------
// Isomorphic SmartClient
//
// CustomExportDMI implementation for the Custom Export example
//
// This example shows one way to insert your own logic into SmartClient's 
// normal client/server flow to export data using a DataSource to collect
// data and reformatting it prior to export. 
//
//----------------------------------------------------------------------

package com.isomorphic.examples.server.customExport;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.log.Logger;

public class CustomExportDMI {

	private static Logger log = new Logger(DSRequest.class.getName());

    public static DSResponse customExport(DSRequest dsRequest, HttpServletRequest servletRequest)
    throws Exception
    {
        DSResponse response = dsRequest.execute();

        List data = response.getDataList();

        List fields = (List)dsRequest.getExportFields();

        fields.add("gdppercapita");

        dsRequest.setExportFields(fields);

        for (Iterator i = data.iterator(); i.hasNext(); ) {
            Map record = (Map)i.next();
            Date dateField = (Date)record.get("independence");
            if (dateField != null) {
            	String field = dateField.toString();
            	record.put("independence", field);
            }
            double population = Double.parseDouble(record.get("population").toString());
            double gdp = Double.parseDouble(record.get("gdp").toString());
            double gdppercapita = (gdp * (double)1000000000) / population;

        	record.put("gdppercapita", new Long(Math.round(gdppercapita)));
        }

        response.setData(data);

        return response;      
    }
}
