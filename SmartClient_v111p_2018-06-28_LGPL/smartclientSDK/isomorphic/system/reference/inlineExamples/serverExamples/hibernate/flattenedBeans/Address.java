//----------------------------------------------------------------------
// Isomorphic SmartClient
// Flattened Beans example
//
// Address Bean - to be managed by Hibernate
//----------------------------------------------------------------------

package com.isomorphic.examples.server.flattenedBeans;

import java.io.Serializable;

public class Address implements Serializable {

    protected Long id;
    protected String line1;
    protected String line2;
    protected String city;
    protected String state;
    protected String zip;
    protected String country;

    public Address() { }

    // Getters
    public Long getId() { return id; }
    public String getLine1() { return line1; }
    public String getLine2() { return line2; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getZip() { return zip; }
    public String getCountry() { return country; }

    // Setters
    public void setId(Long value) { id = value; }
    public void setLine1(String value) { line1 = value; }
    public void setLine2(String value) { line2 = value; }
    public void setCity(String value) { city = value; }
    public void setState(String value) { state = value; }
    public void setZip(String value) { zip = value; }
    public void setCountry(String value) { country = value; }
    
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof Address)) return false;
        Address otherAddr = (Address)other;
        if (this.id == null || otherAddr.id == null) return false;
        return this.id.equals(otherAddr.id);
    }
    
    public int hashCode() {
        return 0;
    }
    
}

