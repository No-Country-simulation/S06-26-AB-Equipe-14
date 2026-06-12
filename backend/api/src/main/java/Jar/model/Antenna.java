package Jar.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "antenna")
public class Antenna {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    private String siteName;
    private String operator;
    private String technology;
    private Double lat;
    private Double lng;


    public Antenna() {
    }

    public Antenna(Long id, Region region, String siteName, String operator, String technology, Double lat, Double lng) {
        this.id = id;
        this.region = region;
        this.siteName = siteName;
        this.operator = operator;
        this.technology = technology;
        this.lat = lat;
        this.lng = lng;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Region getRegion() {
        return this.region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public String getSiteName() {
        return this.siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getOperator() {
        return this.operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getTechnology() {
        return this.technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }

    public Double getLat() {
        return this.lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return this.lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public Antenna id(Long id) {
        setId(id);
        return this;
    }

    public Antenna region(Region region) {
        setRegion(region);
        return this;
    }

    public Antenna siteName(String siteName) {
        setSiteName(siteName);
        return this;
    }

    public Antenna operator(String operator) {
        setOperator(operator);
        return this;
    }

    public Antenna technology(String technology) {
        setTechnology(technology);
        return this;
    }

    public Antenna lat(Double lat) {
        setLat(lat);
        return this;
    }

    public Antenna lng(Double lng) {
        setLng(lng);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Antenna)) {
            return false;
        }
        Antenna antenna = (Antenna) o;
        return Objects.equals(id, antenna.id) && Objects.equals(region, antenna.region) && Objects.equals(siteName, antenna.siteName) && Objects.equals(operator, antenna.operator) && Objects.equals(technology, antenna.technology) && Objects.equals(lat, antenna.lat) && Objects.equals(lng, antenna.lng);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, region, siteName, operator, technology, lat, lng);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", region='" + getRegion() + "'" +
            ", siteName='" + getSiteName() + "'" +
            ", operator='" + getOperator() + "'" +
            ", technology='" + getTechnology() + "'" +
            ", lat='" + getLat() + "'" +
            ", lng='" + getLng() + "'" +
            "}";
    }
    
}
