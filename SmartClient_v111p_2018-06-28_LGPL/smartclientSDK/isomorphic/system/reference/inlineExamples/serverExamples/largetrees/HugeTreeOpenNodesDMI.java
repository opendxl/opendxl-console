package com.isomorphic.examples;

import com.isomorphic.datasource.DataSource;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.log.Logger;
import com.isomorphic.util.DataTools;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

// The <serverObject> declaration in hugeTreeOpenNodes.ds.xml directs the SmartClient Java
// server libraries create a new instance of the class so that the DMI methods can be invoked.
public class HugeTreeOpenNodesDMI {
    private final Logger log = new Logger(HugeTreeOpenNodesDMI.class.getName());

    private static final String ID_PROPERTY = "id";
    private static final String PARENT_ID_PROPERTY = "parent";
    private static final String CHILDREN_PROPERTY = "children";
    private static final String OPEN_PROPERTY = "isOpen";
    private static final String CHILD_COUNT_PROPERTY = "childCount";
    private static final String CAN_RETURN_OPEN_SUBFOLDERS_PROPERTY = "canReturnOpenSubfolders";

    // Request at most 50 children for each open folder that is returned.
    private static final long CHILDREN_PAGE_SIZE = 50L;

    public DSResponse execute(DSRequest dsRequest) throws Exception {
        DSResponse dsResponse = dsRequest.execute();

        if (dsResponse.statusIsSuccess() &&
            DataSource.OP_FETCH.equals(dsResponse.getOperationType()))
        {
            // Make two copies of the criteria Map.  The code will add an entry for the
            // PARENT_ID_PROPERTY key to both maps.  The second map will also be modified
            // to select only records with the OPEN_PROPERTY set to true.
            Map criteria = dsRequest.getCriteria();
            if (criteria == null) {
                criteria = new HashMap();
            } else {
                criteria = new HashMap(criteria);
            }
            Map openCriteria = new HashMap(criteria);
            openCriteria.put(OPEN_PROPERTY, true);

            // Go through all returned nodes, and for any that are marked open, perform a new
            // DSRequest to fetch at most 50 of its children and add them under the
            // childrenProperty (recursively).  Set the childCountProperty on each node where
            // the number of children is greater than 50.
            addChildrenToRecords(dsRequest, criteria, openCriteria, dsResponse.getDataList());
        }

        return dsResponse;
    }

    private void addChildrenToRecords(
                DSRequest dsRequest, Map criteria, Map openCriteria, List records)
        throws Exception
    {
        if (records != null) {
            DataSource dataSource = dsRequest.getDataSource();
            for (Object record : records) {
                if (Boolean.TRUE.equals(dataSource.getProperties(record).get(OPEN_PROPERTY))) {
                    addChildrenToRecord(dsRequest, criteria, openCriteria, record);
                }
            }
        }
    }

    private void addChildrenToRecord(
            DSRequest dsRequest, Map criteria, Map openCriteria, Object record)
        throws Exception
    {
        DataSource dataSource = dsRequest.getDataSource();
        Object recordId = dataSource.getProperties(record).get(ID_PROPERTY);
        criteria.put(PARENT_ID_PROPERTY, recordId);
        dsRequest.setCriteria(criteria);
        dsRequest.setStartRow(0L);
        dsRequest.setEndRow(CHILDREN_PAGE_SIZE);
        DSResponse dsResponse = dsRequest.execute();
        long startRow = dsResponse.getStartRow();
        long endRow = dsResponse.getEndRow();
        long totalRows = dsResponse.getTotalRows();
        long size = (endRow - startRow + 1);
        List children = dsResponse.getDataList();

        openCriteria.put(PARENT_ID_PROPERTY, recordId);
        dsRequest.setStartRow(0L);
        dsRequest.setEndRow(1L);
        dsRequest.setCriteria(openCriteria);
        dsResponse = dsRequest.execute();
        List data = dsResponse.getDataList();
        boolean canReturnOpenSubfolders = (data != null && !data.isEmpty());

        Map properties;
        if (totalRows != -1 && (startRow == -1 || endRow == -1 || size < totalRows)) {
            // Set the childCountProperty on the record.
            properties = DataTools.buildMap(
                CHILDREN_PROPERTY, children,
                CHILD_COUNT_PROPERTY, totalRows,
                CAN_RETURN_OPEN_SUBFOLDERS_PROPERTY, canReturnOpenSubfolders);
        } else {
            properties = DataTools.buildMap(
                CHILDREN_PROPERTY, children,
                CAN_RETURN_OPEN_SUBFOLDERS_PROPERTY, canReturnOpenSubfolders);
        }
        setProperties(dataSource, properties, record);

        //addChildrenToRecords(dsRequest, criteria, openCriteria, children);
        if (children != null) {
            for (Object child : children) {
                if (Boolean.TRUE.equals(dataSource.getProperties(child).get(OPEN_PROPERTY))) {
                    addChildrenToRecord(dsRequest, criteria, openCriteria, child);
                }
            }
        }
    }

    private void setProperties(DataSource dataSource, Map properties, Object target) {
        if (target instanceof Map) {
            DataTools.mapMerge(properties, (Map)target);
        } else {
            dataSource.setProperties(properties, target);
        }
    }
}
