//----------------------------------------------------------------------
// Isomorphic SmartClient
// Java server integration example
//
// SupplyItem Bean
//----------------------------------------------------------------------

package com.isomorphic.examples;

import java.util.Date;
import java.io.Serializable;

// a typical Java Bean which can be stored by many different ORM (object-relational mapping)
// systems, including Hibernate, Toplink, JDO, EJB3, etc.
public class SupplyItem implements Serializable {
    // a zero-argument constructor is not required, but does enable certain convenience
    // features (see the docs for DMI)
    public SupplyItem() { }

    // when receiving data from client-side SmartClient components, SmartClient will call these
    // setters to modify properties.  The setters are found via the Java Beans naming
    // convention, for example, a DataSource field named "category" will be applied via a
    // setter called setCategory().
    public void setItemID(Long id) { itemID = id; }
    public void setSKU(String sku) { SKU = sku; }
    public void setCategory(String c) { category = c; }
    public void setItemName(String name) { itemName = name; }
    public void setDescription(String d) { description = d; }
    public void setUnitCost(Double cost) { unitCost = cost; }
    public void setUnits(String newUnits) { units = newUnits; }
    public void setInStock(Boolean val) { inStock = val; }
    public void setNextShipment(Date date) { nextShipmentDate = date; }

    // SmartClient will call these getters when serializing a Java Bean to be transmitted to
    // client-side components.
    public Long getItemID() { return itemID; }
    public String getSKU() { return SKU; }
    public String getCategory() { return category; }
    public String getItemName() { return itemName; }
    public String getDescription() { return description; }
    public Double getUnitCost() { return unitCost; }
    public String getUnits() { return units; }
    public Boolean getInStock() { return inStock; }
    public Date getNextShipment() { return nextShipmentDate; }

    // this bean has no business logic.  It simply stores data in these instance variables.
    protected Long itemID;
    protected String SKU;
    protected String category;
    protected String itemName;
    protected String description;
    protected Double unitCost;
    protected String units;
    protected Boolean inStock;
    protected Date nextShipmentDate;
}

