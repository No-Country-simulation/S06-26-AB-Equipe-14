package Jar.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "region")
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    private Double centroidLat;
    private Double centroidLng;

    private Instant createdAt;
    private Instant updatedAt;

    // Constructors, getters, and setters

    public Region() {
    }

    public Region(Long id, String code, String name, Double centroidLat, Double centroidLng, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.centroidLat = centroidLat;
        this.centroidLng = centroidLng;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getCentroidLat() {
        return this.centroidLat;
    }

    public void setCentroidLat(Double centroidLat) {
        this.centroidLat = centroidLat;
    }

    public Double getCentroidLng() {
        return this.centroidLng;
    }

    public void setCentroidLng(Double centroidLng) {
        this.centroidLng = centroidLng;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Region id(Long id) {
        setId(id);
        return this;
    }

    public Region code(String code) {
        setCode(code);
        return this;
    }

    public Region name(String name) {
        setName(name);
        return this;
    }

    public Region centroidLat(Double centroidLat) {
        setCentroidLat(centroidLat);
        return this;
    }

    public Region centroidLng(Double centroidLng) {
        setCentroidLng(centroidLng);
        return this;
    }

    public Region createdAt(Instant createdAt) {
        setCreatedAt(createdAt);
        return this;
    }

    public Region updatedAt(Instant updatedAt) {
        setUpdatedAt(updatedAt);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Region)) {
            return false;
        }
        Region region = (Region) o;
        return Objects.equals(id, region.id) && Objects.equals(code, region.code) && Objects.equals(name, region.name) && Objects.equals(centroidLat, region.centroidLat) && Objects.equals(centroidLng, region.centroidLng) && Objects.equals(createdAt, region.createdAt) && Objects.equals(updatedAt, region.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, code, name, centroidLat, centroidLng, createdAt, updatedAt);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", centroidLat='" + getCentroidLat() + "'" +
            ", centroidLng='" + getCentroidLng() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            "}";
    }
    
}
