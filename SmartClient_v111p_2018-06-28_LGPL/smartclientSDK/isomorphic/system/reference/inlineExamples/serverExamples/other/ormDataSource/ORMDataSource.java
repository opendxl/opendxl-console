//----------------------------------------------------------------------
// Isomorphic SmartClient
//
// Example of a custom DataSource implementation.  This class demonstrates 
// how to write an adapter to plug support for an ORM system (Hibernate, in
// this case) into SmartClient Server.  Note that this is just an example to 
// demonstrate the principles involved - SmartClient Server already has 
// considerably more sophisticated Hibernate support than this, built-in
//
// NOTE: In the interests of clarity and brevity, this example intentionally 
// omits exception handling
//
//----------------------------------------------------------------------

package com.isomorphic.examples.server.ormDataSource;


import java.io.*;
import java.util.*;

import org.hibernate.*;
import org.hibernate.cfg.Configuration;

import com.isomorphic.datasource.*;
import com.isomorphic.examples.Country;

public class ORMDataSource extends BasicDataSource {

    // Override all four CRUD operations - create, retrieve, update and delete
    // (add, fetch, update and remove in SmartClient terminology).

    // Note that the parameters sent by the client arrive here already converted to Java Maps
    // by the SmartClient Server - with SmartClient Pro, Power and Enterprise Editions, there's
    // no need to worry about conversion to and from XML or JSON even in a custom DS
    // implementation

    public DSResponse executeAdd(DSRequest req) throws Exception {
        Map createdRecord = createRecord(req.getValues());
        return new DSResponse(this, createdRecord);
    }

    public DSResponse executeFetch(DSRequest req) throws Exception {
        List records = fetchRecords(req.getCriteria());
        return new DSResponse(this, records);
    }

    public DSResponse executeRemove(DSRequest req) throws Exception {
        Map removedRecord = removeRecord(req.getValues().get(getPrimaryKey()));
        return new DSResponse(this, removedRecord);
    }

    public DSResponse executeUpdate(DSRequest req) throws Exception {
        Map updatedRecord = updateRecord(req.getValues());
        return new DSResponse(this, updatedRecord);
    }

// -----------------------------------------------------------------------------------------
// Code for actual data creation and manipulation.
//
// You can replace code below to implement any data access approah you actually want to use.
//
// -----------------------------------------------------------------------------------------

    // Creates record and saves it.
    private Map createRecord (Map values) {
        Country record = new Country();
        setProperties(values, record);
        Session ses = null;
        Transaction tx = null;
        try {
            ses = getSession();
            tx = ses.beginTransaction();
            ses.saveOrUpdate(record);
            tx.commit();
            return getProperties(record);
        } finally {
            if (tx != null) {
                if (tx.isActive()) tx.rollback();
            }
            if (ses != null) ses.close();
        }
    }

    // Returns full data list.
    // This sample does not support server side sorting/filtering.
    private List fetchRecords (Map criteria) {
        Session ses = null;
        Transaction tx = null;
        try {
            ses = getSession();
            tx = ses.beginTransaction();
            Query q = ses.createQuery("from com.isomorphic.examples.Country");
            List records = q.list();
            tx.commit();
            return records;
        } finally {
            if (tx != null) {
                if (tx.isActive()) tx.rollback();
            }
            if (ses != null) ses.close();
        }
    }

    // Finds record by id. Removes it.
    // Returns removed record.
    private Map removeRecord (Object id) {
        Session ses = null;
        Transaction tx = null;
        try {
            ses = getSession();
            tx = ses.beginTransaction();
            Object record = ses.get(Country.class, (Serializable) id);
            ses.delete(record);
            tx.commit();
            return getProperties(record);
        } finally {
            if (tx != null) {
                if (tx.isActive()) tx.rollback();
            }
            if (ses != null) ses.close();
        }
    }

    // Finds record by id. Updates it.
    // Returns updated record.
    private Map updateRecord (Map values) {
        Object id = values.get(getPrimaryKey());
        Session ses = null;
        Transaction tx = null;
        try {
            ses = getSession();
            tx = ses.beginTransaction();
            Object record = ses.get(Country.class, (Serializable) id);
            setProperties(values, record);
            ses.saveOrUpdate(record);
            tx.commit();
            return getProperties(record);
        } finally {
            if (tx != null) {
                if (tx.isActive()) tx.rollback();
            }
            if (ses != null) ses.close();
        }
    }

    private static Configuration hibernateConfig = null;
    private static SessionFactory sessionFactory = null;

    private static synchronized Session getSession() {
        if (sessionFactory == null) {
            hibernateConfig = new Configuration();
            sessionFactory = hibernateConfig.configure().buildSessionFactory();
        }
        return sessionFactory.openSession();
    }

}
