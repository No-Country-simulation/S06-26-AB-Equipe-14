package Jar.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "initiative")

public class Initiative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "region_id")
    private Region region;

    private String title;
    private String description;
    private String leadContact;


    public Initiative() {
    }

    public Initiative(Long id, Region region, String title, String description, String leadContact) {
        this.id = id;
        this.region = region;
        this.title = title;
        this.description = description;
        this.leadContact = leadContact;
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

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLeadContact() {
        return this.leadContact;
    }

    public void setLeadContact(String leadContact) {
        this.leadContact = leadContact;
    }

    public Initiative id(Long id) {
        setId(id);
        return this;
    }

    public Initiative region(Region region) {
        setRegion(region);
        return this;
    }

    public Initiative title(String title) {
        setTitle(title);
        return this;
    }

    public Initiative description(String description) {
        setDescription(description);
        return this;
    }

    public Initiative leadContact(String leadContact) {
        setLeadContact(leadContact);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Initiative)) {
            return false;
        }
        Initiative initiative = (Initiative) o;
        return Objects.equals(id, initiative.id) && Objects.equals(region, initiative.region) && Objects.equals(title, initiative.title) && Objects.equals(description, initiative.description) && Objects.equals(leadContact, initiative.leadContact);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, region, title, description, leadContact);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", region='" + getRegion() + "'" +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", leadContact='" + getLeadContact() + "'" +
            "}";
    }
    
}
