package Jar.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Objects;

@Entity
@Table(name = "training_program")
public class TrainingProgram {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "region_id")
    private Region region;

    private String name;
    private String provider;
    private String targetGroup;
    private String coverage;
    private String contactInfo;


    public TrainingProgram() {
    }

    public TrainingProgram(Long id, Region region, String name, String provider, String targetGroup, String coverage, String contactInfo) {
        this.id = id;
        this.region = region;
        this.name = name;
        this.provider = provider;
        this.targetGroup = targetGroup;
        this.coverage = coverage;
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

    public String getProvider() {
        return this.provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getTargetGroup() {
        return this.targetGroup;
    }

    public void setTargetGroup(String targetGroup) {
        this.targetGroup = targetGroup;
    }

    public String getCoverage() {
        return this.coverage;
    }

    public void setCoverage(String coverage) {
        this.coverage = coverage;
    }

    public String getContactInfo() {
        return this.contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public TrainingProgram id(Long id) {
        setId(id);
        return this;
    }

    public TrainingProgram region(Region region) {
        setRegion(region);
        return this;
    }

    public TrainingProgram name(String name) {
        setName(name);
        return this;
    }

    public TrainingProgram provider(String provider) {
        setProvider(provider);
        return this;
    }

    public TrainingProgram targetGroup(String targetGroup) {
        setTargetGroup(targetGroup);
        return this;
    }

    public TrainingProgram coverage(String coverage) {
        setCoverage(coverage);
        return this;
    }

    public TrainingProgram contactInfo(String contactInfo) {
        setContactInfo(contactInfo);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof TrainingProgram)) {
            return false;
        }
        TrainingProgram trainingProgram = (TrainingProgram) o;
        return Objects.equals(id, trainingProgram.id) && Objects.equals(region, trainingProgram.region) && Objects.equals(name, trainingProgram.name) && Objects.equals(provider, trainingProgram.provider) && Objects.equals(targetGroup, trainingProgram.targetGroup) && Objects.equals(coverage, trainingProgram.coverage) && Objects.equals(contactInfo, trainingProgram.contactInfo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, region, name, provider, targetGroup, coverage, contactInfo);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", region='" + getRegion() + "'" +
            ", name='" + getName() + "'" +
            ", provider='" + getProvider() + "'" +
            ", targetGroup='" + getTargetGroup() + "'" +
            ", coverage='" + getCoverage() + "'" +
            ", contactInfo='" + getContactInfo() + "'" +
            "}";
    }
    
}
