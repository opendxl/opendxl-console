//----------------------------------------------------------------------
// Isomorphic SmartClient
// Java server integration example
//
// Country Bean
//----------------------------------------------------------------------

package com.isomorphic.examples;

public class Country {

    private Long pk;
    private String countryCode;
    private String countryName;
    private String capital;
    private Float area;
    private Long population;
    private Float gdp;
    
    public Country() {
    }

    public Float getArea() { return area; }
    public String getCapital() { return capital; }
    public String getCountryCode() { return countryCode; }
    public String getCountryName() { return countryName; }
    public Float getGdp() { return gdp; }
    public Long getPk() { return pk; }
    public Long getPopulation() { return population; }

    public void setArea(Float area) { this.area = area; }
    public void setCapital(String capital) { this.capital = capital; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
    public void setCountryName(String countryName) { this.countryName = countryName; }
    public void setGdp(Float gdp) { this.gdp = gdp; }
    public void setPk(Long pk) { this.pk = pk; }
    public void setPopulation(Long population) { this.population = population; }
    
}
