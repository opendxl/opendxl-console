package com.isomorphic.examples;

import com.isomorphic.datasource.DataSource;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.log.Logger;
import com.isomorphic.util.DataTools;

import java.util.List;
import java.util.Map;

// The <serverObject> declaration in employeesOpenNodes.ds.xml directs the SmartClient Java
// server libraries create a new instance of the class so that the DMI methods can be invoked.
public class EmployeesOpenNodesDMI {
    private final Logger log = new Logger(EmployeesOpenNodesDMI.class.getName());

    private static final String ID_PROPERTY = "EmployeeId";
    private static final String PARENT_ID_PROPERTY = "ReportsTo";
    private static final String CHILDREN_PROPERTY = "DirectReports";
    private static final String OPEN_PROPERTY = "IsOpen";

    public DSResponse execute(DSRequest dsRequest) throws Exception {
        DSResponse dsResponse = dsRequest.execute();

        if (dsResponse.statusIsSuccess() &&
            DataSource.OP_FETCH.equals(dsResponse.getOperationType()))
        {
            // Go through all returned nodes, and for any that are marked open, perform a new
            // DSRequest to fetch its children and add them under the childrenProperty
            // (recursively).
            addChildrenToRecords(dsRequest, dsResponse.getDataList());
        }

        return dsResponse;
    }

    private void addChildrenToRecords(DSRequest dsRequest, List records) throws Exception {
        if (records != null) {
            DataSource dataSource = dsRequest.getDataSource();
            for (Object record : records) {
                if (Boolean.TRUE.equals(dataSource.getProperties(record).get(OPEN_PROPERTY))) {
                    addChildrenToRecord(dsRequest, record);
                }
            }
        }
    }

    private void addChildrenToRecord(DSRequest dsRequest, Object record) throws Exception {
        DataSource dataSource = dsRequest.getDataSource();
        Object recordId = dataSource.getProperties(record).get(ID_PROPERTY);
        Map criteria = DataTools.buildMap(PARENT_ID_PROPERTY, recordId);
        dsRequest.setCriteria(criteria);
        DSResponse dsResponse = dsRequest.execute();

        List children = dsResponse.getDataList();
        setProperties(dataSource, DataTools.buildMap(CHILDREN_PROPERTY, children), record);

        addChildrenToRecords(dsRequest, children);
    }

    private void setProperties(DataSource dataSource, Map properties, Object target) {
        if (target instanceof Map) {
            DataTools.mapMerge(properties, (Map)target);
        } else {
            dataSource.setProperties(properties, target);
        }
    }
}
