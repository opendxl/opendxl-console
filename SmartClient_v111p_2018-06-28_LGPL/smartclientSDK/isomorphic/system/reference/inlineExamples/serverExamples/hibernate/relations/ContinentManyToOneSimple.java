package com.isomorphic.examples.server.hibernate.relations;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table (name="continent")
public class ContinentManyToOneSimple
    implements Serializable
{

    @Id
    @Column (nullable = false)
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Long continentId;

    @Column (nullable = false)
    private String continentName;

    public ContinentManyToOneSimple ()
    {
    }

    public Long getContinentId() {
        return continentId;
    }

    public void setContinentId(Long continentId) {
        this.continentId = continentId;
    }

    public String getContinentName() {
        return continentName;
    }

    public void setContinentName(String continentName) {
        this.continentName = continentName;
    }

    /**
     * Returns a string representation of the object. Resulting string contains
     * full name of the class and list of its properties and their values.
     *
     * @return <code>String</code> representation of this object.
     */
    @Override
    public String toString ()
    {
        return getClass().getName()
               + "["
               + "continentId=" + ((getContinentId() == null) ? "null" : getContinentId().toString())
               + ", "
               + "continentName=" + ((getContinentName() == null) ? "null" : getContinentName().toString())
               + "]";
    }


}
