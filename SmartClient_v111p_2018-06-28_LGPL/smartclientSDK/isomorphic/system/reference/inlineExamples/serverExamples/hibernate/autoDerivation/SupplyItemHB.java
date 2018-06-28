//----------------------------------------------------------------------
// Isomorphic SmartClient
// Java server integration example
//
// SupplyItemHB Bean
//----------------------------------------------------------------------

package com.isomorphic.examples;

import java.util.Date;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

// a typical Java Bean which can be stored by many different ORM (object-relational mapping)
// systems, including Hibernate, Toplink, JDO, EJB3, etc.
@Entity
@Table(name="supplyItemHB")
public class SupplyItemHB implements Serializable {
    // a zero-argument constructor is not required, but does enable certain convenience
    // features (see the docs for DMI)
    public SupplyItemHB() { }

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
    public void setUnits(UnitType newUnits) { units = newUnits; }
    public void setInStock(Boolean val) { inStock = val; }
    public void setNextShipment(Date date) { nextShipment = date; }

    // SmartClient will call these getters when serializing a Java Bean to be transmitted to
    // client-side components.
    public Long getItemID() { return itemID; }
    public String getSKU() { return SKU; }
    public String getCategory() { return category; }
    public String getItemName() { return itemName; }
    public String getDescription() { return description; }
    public Double getUnitCost() { return unitCost; }
    public UnitType getUnits() { return units; }
    public Boolean getInStock() { return inStock; }
    public Date getNextShipment() { return nextShipment; }

    // this bean has no business logic.  It simply stores data in these instance variables.
    @Id
    @Column (nullable = false)
    @GeneratedValue (strategy = GenerationType.AUTO)
    protected Long itemID;
    protected String SKU;
    protected String category;
    // Marking itemName and description as nullable=false will cause them to be flagged as 
    // required:"true" in the derived DataSource
    @Column (nullable = false)
    protected String itemName;
    @Column (nullable = false)
    protected String description;
    protected Double unitCost;
    @Enumerated(EnumType.STRING)
    protected UnitType units;
    protected Boolean inStock;
    @Temporal(TemporalType.DATE)
    protected Date nextShipment;

    public enum UnitType {
        Roll("Roll"),
        Ea("Each"),
        Pkt("Packet"),
        Set("Set"),
        Tube("Tube"),
        Pad("Pad"),
        Ream("Ream"),
        Tin("Tin"),
        Bag("Bag"),
        Ctn("Carton"),
        Box("Box");
        private String value;
        private UnitType (String value) {
            this.value = value;
        }
        @Override
        public String toString() {
            return value;
        }
    }
}

