//----------------------------------------------------------------------
// Isomorphic SmartClient
// Java server integration example
//
// SupplyItem Bean - for the Hibernate Large Value Map example
//
//----------------------------------------------------------------------

package com.isomorphic.examples.server.largeValueMapHibernate;

import java.util.Date;
import java.io.Serializable;

public class ValMapSupplyItem implements Serializable {

    public ValMapSupplyItem() { }

    // when receiving data from client-side SmartClient components, SmartClient will call these
    // setters to modify properties.  The setters are found via the Java Beans naming
    // convention, for example, a DataSource field named "category" will be applied via a
    // setter called setCategory().
    public void setItemID(Long id) { itemID = id; }
    public void setSKU(String sku) { SKU = sku; }
    public void setCategory(String c) { category = c; }
    public void setItemName(String name) { itemName = name; }
    public void setDescription(String d) { description = d; }
    public void setUnitCost(double cost) { unitCost = cost; }
    public void setUnits(String newUnits) { units = newUnits; }
    public void setInStock(boolean val) { inStock = val; }
    public void setNextShipment(Date date) { nextShipmentDate = date; }

    // SmartClient will call these getters when serializing a Java Bean to be transmitted to
    // client-side components.
    public Long getItemID() { return itemID; }
    public String getSKU() { return SKU; }
    public String getCategory() { return category; }
    public String getItemName() { return itemName; }
    public String getDescription() { return description; }
    public double getUnitCost() { return unitCost; }
    public String getUnits() { return units; }
    public boolean getInStock() { return inStock; }
    public Date getNextShipment() { return nextShipmentDate; }

    // this bean has no business logic.  It simply stores data in these instance variables.
    protected Long itemID;
    protected String SKU;
    protected String category;
    protected String itemName;
    protected String description;
    protected double unitCost;
    protected String units;
    protected boolean inStock;
    protected Date nextShipmentDate;
}

