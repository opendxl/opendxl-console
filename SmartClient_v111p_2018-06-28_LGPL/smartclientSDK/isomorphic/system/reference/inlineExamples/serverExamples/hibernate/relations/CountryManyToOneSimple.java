package com.isomorphic.examples.server.hibernate.relations;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table (name="country")
public class CountryManyToOneSimple
    implements Serializable
{

    @Id
    @Column (nullable = false)
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Long countryId;

    @Column (nullable = false)
    private String countryCode;

    @Column (nullable = false)
    private String countryName;

    @ManyToOne
    @JoinColumn(name="continentId", referencedColumnName="continentId")
    private ContinentManyToOneSimple continent;

    public CountryManyToOneSimple ()
    {
    }

    public Long getCountryId ()
    {
        return countryId;
    }

    public void setCountryId (Long countryId)
    {
        this.countryId = countryId;
    }

    public String getCountryCode ()
    {
        return countryCode;
    }

    public void setCountryCode (String countryCode)
    {
        this.countryCode = countryCode;
    }

    public String getCountryName ()
    {
        return countryName;
    }

    public void setCountryName (String countryName)
    {
        this.countryName = countryName;
    }

    public ContinentManyToOneSimple getContinent() {
        return continent;
    }

    public void setContinent(ContinentManyToOneSimple continent) {
        this.continent = continent;
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
               + "countryId=" + ((getCountryId() == null) ? "null" : getCountryId().toString())
               + ", "
               + "countryCode=" + ((getCountryCode() == null) ? "null" : getCountryCode().toString())
               + ", "
               + "countryName=" + ((getCountryName() == null) ? "null" : getCountryName().toString())
               + "]";
    }

}
