//----------------------------------------------------------------------
// Isomorphic SmartClient
// Simple queuing example
//
// User Bean - to be managed by Hibernate
//----------------------------------------------------------------------

package com.isomorphic.examples.server.queuing;

import java.io.Serializable;

public class User implements Serializable {

    protected Long userID;
    protected String firstName;
    protected String surname;
    protected String department;
    protected String email;

    public User() { }

    // Getters
    public Long getUserID() { return userID; }
    public String getFirstName() { return firstName; }
    public String getSurname() { return surname; }
    public String getDepartment() { return department; }
    public String getEmail() { return email; }

    // Setters
    public void setUserID(Long value) { userID = value; }
    public void setFirstName(String value) { firstName = value; }
    public void setSurname(String value) { surname = value; }
    public void setDepartment(String value) { department = value; }
    public void setEmail(String value) { email = value; }
    
}

