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
@Table (name="city")
public class CityManyToOneSimple
    implements Serializable
{

    @Id
    @Column (nullable = false)
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Long cityId;

    @Column (nullable = false)
    private String cityName;

    @ManyToOne
    @JoinColumn(name="countryId", referencedColumnName="countryId")
    private CountryManyToOneSimple country;

    public CityManyToOneSimple ()
    {
    }

    public Long getCityId ()
    {
        return cityId;
    }

    public void setCityId (Long cityId)
    {
        this.cityId = cityId;
    }

    public String getCityName ()
    {
        return cityName;
    }

    public void setCityName (String cityName)
    {
        this.cityName = cityName;
    }

    public CountryManyToOneSimple getCountry () {
        return country;
    }

    public void setCountry (CountryManyToOneSimple country) {
        this.country = country;
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
               + "cityId=" + ((getCityId() == null) ? "null" : getCityId().toString())
               + ", "
               + "cityName=" + ((getCityName() == null) ? "null" : getCityName().toString())
               + "]";
    }

}
