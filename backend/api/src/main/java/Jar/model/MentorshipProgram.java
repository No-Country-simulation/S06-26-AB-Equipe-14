package Jar.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Objects;

@Entity
@Table(name = "mentorship_program")
public class MentorshipProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "region_id")
    private Region region;

    private String name;
    private String organization;
    private String contactInfo;

    // Constructors, getters, and setters

    public MentorshipProgram() {
    }

    public MentorshipProgram(Long id, Region region, String name, String organization, String contactInfo) {
        this.id = id;
        this.region = region;
        this.name = name;
        this.organization = organization;
        this.contactInfo = contactInfo;
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

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrganization() {
        return this.organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getContactInfo() {
        return this.contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public MentorshipProgram id(Long id) {
        setId(id);
        return this;
    }

    public MentorshipProgram region(Region region) {
        setRegion(region);
        return this;
    }

    public MentorshipProgram name(String name) {
        setName(name);
        return this;
    }

    public MentorshipProgram organization(String organization) {
        setOrganization(organization);
        return this;
    }

    public MentorshipProgram contactInfo(String contactInfo) {
        setContactInfo(contactInfo);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof MentorshipProgram)) {
            return false;
        }
        MentorshipProgram mentorshipProgram = (MentorshipProgram) o;
        return Objects.equals(id, mentorshipProgram.id) && Objects.equals(region, mentorshipProgram.region) && Objects.equals(name, mentorshipProgram.name) && Objects.equals(organization, mentorshipProgram.organization) && Objects.equals(contactInfo, mentorshipProgram.contactInfo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, region, name, organization, contactInfo);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", region='" + getRegion() + "'" +
            ", name='" + getName() + "'" +
            ", organization='" + getOrganization() + "'" +
            ", contactInfo='" + getContactInfo() + "'" +
            "}";
    }
    
}
