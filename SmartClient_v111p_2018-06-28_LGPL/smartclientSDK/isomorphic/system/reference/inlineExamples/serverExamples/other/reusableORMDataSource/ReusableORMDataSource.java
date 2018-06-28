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

package com.isomorphic.examples.server.reusableORMDataSource;


import com.isomorphic.base.Reflection;
import java.io.*;
import java.util.*;

import org.hibernate.*;
import org.hibernate.cfg.Configuration;
import org.hibernate.criterion.*;

import com.isomorphic.datasource.*;
import com.isomorphic.util.DataTools;

public class ReusableORMDataSource extends BasicDataSource {

    protected String entityName;
    protected Session currentSession;

    protected static Configuration hibernateConfig;
    protected static SessionFactory sessionFactory;

    // We are only overriding execute() to provide a central point for initialization and 
    // session/transaction management - for actual data operations, it is more appropriate to 
    // override executeFetch(), et al, as we do further down in this class
    public DSResponse execute(DSRequest req) throws Exception {
        
        // Initialize the Hibernate Configuration if necessary
        if (hibernateConfig == null) {
            createConfig();
        }

        if (entityName == null) {
            // Pick up the fully-qualified class name from the DataSource definition. The property 
            // can be called anything you like - here, we are expecting to find a "mappedBeanClass" 
            // property in the DataSource definition
            entityName = getProperty("mappedBeanClass");
            if (hibernateConfig.getClassMapping(entityName) == null) {
                // Config problem - the bean named in the .ds.xml file is not mapped in Hibernate
            }
        }

        this.currentSession = sessionFactory.openSession();
        Transaction tx = currentSession.beginTransaction();
        
        try {
            return super.execute(req);
        } finally {
            tx.commit();
            currentSession.close();
        }
    }

	// Implementation of basic DataSource operations 
	// --------------------------------------------------------------------------------------------
	public DSResponse executeFetch(DSRequest req) throws Exception {

        DSResponse dsResponse = new DSResponse();
        dsResponse.setSuccess();
        
        List criterions = new ArrayList();
        
        // Implement simple filter criteria
        Map rCriteria = req.getCriteria();
        if (rCriteria != null) {
            boolean isFilter = "substring".equals(req.getOperationProperty("textMatchStyle"));
            for (Iterator i = rCriteria.keySet().iterator(); i.hasNext();) {
                String fieldName = (String)i.next();
                Object value = rCriteria.get(fieldName);
                Criterion criterion = null;
                
                String fieldType = getField(fieldName).getType();
                // Support OR on multiple values 
                if (value instanceof List) {
                    criterion = Restrictions.disjunction();
                    for (Iterator j = ((List)value).iterator(); j.hasNext();) {
                        ((Disjunction)criterion).add(Restrictions.eq(fieldName, j.next()));
                    }
                } else {
                    if (isFilter && ("text".equals(fieldType) || "string".equals(fieldType))) {
                        criterion = Restrictions.like(fieldName, value.toString(), MatchMode.ANYWHERE);
                    } else {
                        // exact equality
                        criterion = Restrictions.eq(fieldName, value);
                    }
                }
                criterions.add(criterion);
            }
        }
        
        Criteria criteria = currentSession.createCriteria(entityName);
        addAllCriterions(criteria, criterions);
        
        // Implement data paging
        long totalRows = -1;
        if (req.isPaged()) {
            if (req.getEndRow() != DSRequest.ENDROW_UNSET) {
                // if specified, endRow overrides batchSize
                if (req.getEndRow() - req.getStartRow() > req.getBatchSize()) {
                    req.setBatchSize(req.getEndRow() - req.getStartRow());
                }
            }
            
            criteria.setProjection(Projections.rowCount());
            Object rowCount = criteria.uniqueResult();
            totalRows = 0;
            // Later versions of Hibernate return a Long rather than an Integer here, for all
            // those occasions when a fetch returns more than 2.1 billion rows...
            if (rowCount instanceof Integer) {
                totalRows = ((Integer)rowCount).intValue();
            } else if (rowCount instanceof Long) {
                totalRows = ((Long)rowCount).longValue();
            }

            // rebuild criteria, minus the count projection for the actual query
            criteria = currentSession.createCriteria(entityName);
            addAllCriterions(criteria, criterions);
            
            criteria.setMaxResults((int)req.getBatchSize());
            criteria.setFirstResult((int)req.getStartRow());
        }
        
        List results = null;
        
        // Implement sorting
        List sortBy = req.getSortByFields();
        for (Iterator i = sortBy.iterator(); i.hasNext();) {
            String sortByField = (String)i.next();
            if (sortByField.startsWith("-")) {
                // leading minus means sort in descending order
                criteria.addOrder(Order.desc(sortByField.substring(1)));
            } else {
                criteria.addOrder(Order.asc(sortByField));
            }
        }
            
        // Run the query
        results = criteria.list();
        // if we're not paged, we're returning all rows
        if (totalRows == -1) totalRows = results.size();
        dsResponse.setTotalRows(totalRows);
        
        // set startRow/endRow
        long startRow = 0;
        long endRow = 0;
        if (totalRows != 0) {
            startRow = req.getStartRow();
            endRow = startRow + results.size();
        }
        dsResponse.setStartRow(startRow);
        dsResponse.setEndRow(endRow);
        
        // DataSource protocol: return list of matching records
        dsResponse.setData(results);
        return dsResponse;
    }

    public DSResponse executeAdd(DSRequest req) throws Exception {

        DSResponse dsResponse = new DSResponse();
        dsResponse.setSuccess();
        
        Object record = Reflection.classForName(entityName).newInstance();
        // populate the record from the submitted values
        DataTools.setProperties(req.getValues(), record);

        currentSession.saveOrUpdate(entityName, record);
        
        // DataSource protocol: return the committed bean to the client for cache update
        dsResponse.setData(record);
        return dsResponse;
    }
    
    public DSResponse executeRemove(DSRequest req) throws Exception {

        DSResponse dsResponse = new DSResponse();
        dsResponse.setSuccess();
        
        String primaryKey = getPrimaryKey();
        
        Serializable id = (Serializable)req.getFieldValue(primaryKey);
        Object record = currentSession.get(entityName, id);
        currentSession.delete(entityName, record);
        
        // DataSource protocol: return the primary key of the deleted record to the client for
        // cache update    
        dsResponse.setData(req.getCriteria());
        return dsResponse;
    }

    public DSResponse executeUpdate(DSRequest req) throws Exception {

        DSResponse dsResponse = new DSResponse();
        dsResponse.setSuccess();

        String primaryKey = getPrimaryKey();
        
        Serializable id = (Serializable)req.getFieldValue(primaryKey);
        Object record = null;
        if (id != null) {
            record = currentSession.get(entityName, id);
        } else {
            // Error: the primary key value was not supplied in the update request
        }
        
        // populate the record from the submitted values
        DataTools.setProperties(req.getValues(), record);
        currentSession.saveOrUpdate(entityName, record);

        // DataSource protocol: return the committed bean to the client for cache update
        dsResponse.setData(record);
        return dsResponse;
    } 

    private Criteria addAllCriterions(Criteria criteria, List criterions) {
        for (Iterator i = criterions.iterator(); i.hasNext(); ) {
            criteria.add((Criterion)i.next());
        }
        return criteria;
    }

    // This method is static and synchronized to avoid threading issues when multiple requests
    // are sent during server startup
    private static synchronized void createConfig() {
        hibernateConfig = new Configuration();
        sessionFactory = hibernateConfig.configure().buildSessionFactory();
    }

}
