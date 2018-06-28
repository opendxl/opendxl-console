package com.isomorphic.examples.server.customBinaryField;

import com.isomorphic.datasource.BasicDataSource;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.servlet.ISCFileItem;

import javax.servlet.http.HttpSession;
import java.util.*;

public class CustomBinaryFieldDataSource extends BasicDataSource {

    private static final List<Map<String, Object>> DEFAULT_DATA = new ArrayList<Map<String, Object>>();

    static {
        final Map<String, Object> record1 = new HashMap<String, Object>();
        String desc1 = "Australian Made parchment paper offering archival life and laser compatibility in a range of six pastel shades and white. Centurion is manufactured from woodfree pulp under the strictest of conditions to comply with the interim standard for permanent pape";
        record1.put("id", 1);
        record1.put("file", desc1.getBytes());
        record1.put("file_filename", "Copy_laser_Paper_Parchment_A4_110GSM_Buff.txt");
        record1.put("file_filesize", (desc1.getBytes()).length);
        record1.put("file_date_created", new Date());
        record1.put("description", desc1);
        DEFAULT_DATA.add(record1);

        final Map<String, Object> record2 = new HashMap<String, Object>();
        String desc2 = "Makes copies of meetings in seconds. Features a rotating Mylar writing surface, uses standard thermal fax paper, includes an accessory tray that holds markers etc moves easily on durable castors, push button operation. Copying area is 830mm(h)x1300mm(w).";
        record2.put("id", 2);
        record2.put("file", desc2.getBytes());
        record2.put("file_filename", "Whiteboard_Quartet_Electronic.txt");
        record2.put("file_filesize", (desc2.getBytes()).length);
        record2.put("file_date_created", new Date());
        record2.put("description", desc2);
        DEFAULT_DATA.add(record2);

        final Map<String, Object> record3 = new HashMap<String, Object>();
        String desc3 = "The highest degree of writing comfort. PhD reduces gripping pressure by increasing the hand-to-grip surface with a large cushioned triangular grip. This provides exceptional control and balance, as well as less hand fatigue. Refillable and retractable. Al";
        record3.put("id", 3);
        record3.put("file", desc3.getBytes());
        record3.put("file_filename", "Pens_Sanford_Phd_Ballpoint_Black_Barrel.txt");
        record3.put("file_filesize", (desc3.getBytes()).length);
        record3.put("file_date_created", new Date());
        record3.put("description", desc3);
        DEFAULT_DATA.add(record3);
    }

    @Override
    public DSResponse executeFetch(DSRequest dsRequest) throws Exception {
        final List<Map<String, Object>> list = getRecordsForSession(dsRequest.context.request.getSession());

        final DSResponse dsResponse = new DSResponse(this);
        // A normal fetch should generally *not* return binary data for the binary
        // field, because in most cases JavaScript logic in the browser would not be able to do
        // anything with it (there would be no way to, for example, launch a PDF viewer for a PDF
        // file included in Record data).  However the fetch operation is allowed to return binary
        // data encoded as text (generally base64) for the cases where this is useful (for example
        // some browsers support providing images as base64 encoded text).
        // _filename, _filesize and _date_created are implied whenever a field of type "binary" is declared.
        final List<Map<String, Object>> data = new LinkedList<Map<String, Object>>();

        for (final Map<String, Object> record : list) {
            final Map<String, Object> recordToReturn = new HashMap<String, Object>(record);
            recordToReturn.remove("file");
            data.add(recordToReturn);
        }

        dsResponse.setData(data);
        return dsResponse;
    }

    @Override
    public DSResponse execute(DSRequest dsRequest) throws Exception {
        DSResponse dsResponse = new DSResponse(this);

        final Map<String, Object> criteria = dsRequest.getCriteria();
        final Object recordId = criteria.get("id");
        final String operationType = dsRequest.getOperationType();
        final HttpSession httpSession = dsRequest.context.request.getSession();

        if (operationType.equals("viewFile") || operationType.equals("downloadFile")) {
            criteria.putAll(getRecord(recordId, httpSession));
            dsResponse.setData(criteria);
        } else if (operationType.equals("fetch")) {
            dsResponse = this.executeFetch(dsRequest);
        } else if (operationType.equals("add")) {
            dsResponse = this.executeAdd(dsRequest);
        } else if (operationType.equals("update")) {
            dsResponse = this.executeUpdate(dsRequest);
        }

        return dsResponse;
    }

    @Override
    public DSResponse executeAdd(final DSRequest dsRequest) throws Exception {
        final ISCFileItem fileItem = dsRequest.getUploadedFile("file");
        final byte[] data = fileItem.get();
        final DSResponse dsResponse = new DSResponse(this);
        final Map<String, Object> newValues = dsRequest.getValues();
        newValues.put("file", data);
        newValues.put("file_date_created", new Date());
        newValues.put("file_filesize", data.length);

        final List<Map<String, Object>> list = getRecordsForSession(dsRequest.context.request.getSession());
        list.add(newValues);

        dsResponse.setData(newValues);

        return dsResponse;
    }

    @Override
    public DSResponse executeUpdate(final DSRequest dsRequest) throws Exception {
        final ISCFileItem fileItem = dsRequest.getUploadedFile("file");
        final byte[] data = fileItem.get();
        final DSResponse dsResponse = new DSResponse(this);
        final Map<String, Object> criteria = dsRequest.getCriteria();
        final Map<String, Object> record = getRecord(criteria.get("id"), dsRequest.context.request.getSession());

        if (record != null) {
            record.putAll(dsRequest.getValues());
            record.put("file", data);
            record.put("file_filesize", data.length);
            record.put("file_date_created", new Date());
            dsResponse.setData(record);
        } else {
            dsResponse.setStatus(DSResponse.STATUS_FAILURE);
        }

        return dsResponse;
    }

    private Map<String, Object> getRecord(final Object id, final HttpSession httpSession) {
        final List<Map<String, Object>> records = getRecordsForSession(httpSession);
        final String idAsString = String.valueOf(id);

        for (final Map<String, Object> record : records) {
            final String recordId = String.valueOf(record.get("id"));

            if (recordId.equalsIgnoreCase(idAsString)) {
                return record;
            }
        }

        return null;
    }

    /**
     * We sandbox the data into the HttpSession here, this is just to ensure that the data can
     * be cleaned up automatically as sessions expire. We do not recommend anyone doing this in
     * a production application. This is purely for demonstrating how to use custom binary fields.
     */
    private List<Map<String, Object>> getRecordsForSession(final HttpSession session) {
        List<Map<String, Object>> list = (List<Map<String, Object>>) session.getAttribute("CustomBinaryFieldDataSource.list");

        // Lazy create a new list if there is none for this session.
        if (list == null) {
            list = new LinkedList<Map<String, Object>>();
            list.addAll(new LinkedList<Map<String, Object>>(DEFAULT_DATA));
            session.setAttribute("CustomBinaryFieldDataSource.list", list);
        }

        return list;
    }
}
