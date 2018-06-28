//----------------------------------------------------------------------
// Isomorphic SmartClient
// Java server integration example
//
// World entity
//----------------------------------------------------------------------

package com.isomorphic.examples;

import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table (name="worldHB")
public class World {

    @Id
    private Long pk;
    private String countryCode;
    private String countryName;
    private String capital;
    private String government;
    private String continent;
    @Temporal(TemporalType.DATE)
    private Date independence;
    private Float area;
    private Long population;
    private Float gdp;
    private Boolean member_g8;
    
    public World() {
    }

    public Long getPk() { return pk; }
    public String getCountryCode() { return countryCode; }
    public String getCountryName() { return countryName; }
    public String getCapital() { return capital; }
    public String getGovernment() { return government; }
    public String getContinent() { return continent; }
    public Date getIndependence() { return independence; }
    public Float getArea() { return area; }
    public Long getPopulation() { return population; }
    public Float getGdp() { return gdp; }
    public Boolean getMember_g8() { return member_g8; }

    public void setPk(Long pk) { this.pk = pk; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
    public void setCountryName(String countryName) { this.countryName = countryName; }
    public void setCapital(String capital) { this.capital = capital; }
    public void setGovernment(String government) { this.government = government; }
    public void setContinent(String continent) { this.continent = continent; }
    public void setIndependence(Date independence) { this.independence = independence; }
    public void setArea(Float area) { this.area = area; }
    public void setPopulation(Long population) { this.population = population; }
    public void setGdp(Float gdp) { this.gdp = gdp; }
    public void setMember_g8(Boolean member_g8) { this.member_g8 = member_g8; }
    
}
