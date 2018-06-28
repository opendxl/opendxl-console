//----------------------------------------------------------------------
// Isomorphic SmartClient
// Master-Detail load and save example (Hibernate)
//
// Order Bean - to be managed by Hibernate
//----------------------------------------------------------------------

package com.isomorphic.examples.server.masterDetail;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

public class Order implements Serializable {

    protected long orderID;
    protected String customerName;
    protected Date orderDate;
    protected Long trackingNumber;
    protected Set items;

    public Order() { }

    // Getters
    public String getCustomerName() { return customerName; }
    public Date getOrderDate() { return orderDate; }
    public long getOrderID() { return orderID; }
    public Long getTrackingNumber() { return trackingNumber; }
    public Set getItems() { return items; }

    // Setters
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public void setOrderDate(Date orderDate) { this.orderDate = orderDate; }
    public void setOrderID(long orderID) { this.orderID = orderID; }
    public void setTrackingNumber(Long trackingNumber) { this.trackingNumber = trackingNumber; }
    public void setItems(Set items) { this.items = items; }

}

