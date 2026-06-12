package Jar.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "visent_record")
public class VisentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "region_id")
    private Region region;

    private LocalDate sampleDate;
    private Double concentration;
    private Double networkCoverageScore;
    private Long peopleCount;
    private String source;


    public VisentRecord() {
    }

    public VisentRecord(Long id, Region region, LocalDate sampleDate, Double concentration, Double networkCoverageScore, Long peopleCount, String source) {
        this.id = id;
        this.region = region;
        this.sampleDate = sampleDate;
        this.concentration = concentration;
        this.networkCoverageScore = networkCoverageScore;
        this.peopleCount = peopleCount;
        this.source = source;
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

    public LocalDate getSampleDate() {
        return this.sampleDate;
    }

    public void setSampleDate(LocalDate sampleDate) {
        this.sampleDate = sampleDate;
    }

    public Double getConcentration() {
        return this.concentration;
    }

    public void setConcentration(Double concentration) {
        this.concentration = concentration;
    }

    public Double getNetworkCoverageScore() {
        return this.networkCoverageScore;
    }

    public void setNetworkCoverageScore(Double networkCoverageScore) {
        this.networkCoverageScore = networkCoverageScore;
    }

    public Long getPeopleCount() {
        return this.peopleCount;
    }

    public void setPeopleCount(Long peopleCount) {
        this.peopleCount = peopleCount;
    }

    public String getSource() {
        return this.source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public VisentRecord id(Long id) {
        setId(id);
        return this;
    }

    public VisentRecord region(Region region) {
        setRegion(region);
        return this;
    }

    public VisentRecord sampleDate(LocalDate sampleDate) {
        setSampleDate(sampleDate);
        return this;
    }

    public VisentRecord concentration(Double concentration) {
        setConcentration(concentration);
        return this;
    }

    public VisentRecord networkCoverageScore(Double networkCoverageScore) {
        setNetworkCoverageScore(networkCoverageScore);
        return this;
    }

    public VisentRecord peopleCount(Long peopleCount) {
        setPeopleCount(peopleCount);
        return this;
    }

    public VisentRecord source(String source) {
        setSource(source);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof VisentRecord)) {
            return false;
        }
        VisentRecord visentRecord = (VisentRecord) o;
        return Objects.equals(id, visentRecord.id) && Objects.equals(region, visentRecord.region) && Objects.equals(sampleDate, visentRecord.sampleDate) && Objects.equals(concentration, visentRecord.concentration) && Objects.equals(networkCoverageScore, visentRecord.networkCoverageScore) && Objects.equals(peopleCount, visentRecord.peopleCount) && Objects.equals(source, visentRecord.source);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, region, sampleDate, concentration, networkCoverageScore, peopleCount, source);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", region='" + getRegion() + "'" +
            ", sampleDate='" + getSampleDate() + "'" +
            ", concentration='" + getConcentration() + "'" +
            ", networkCoverageScore='" + getNetworkCoverageScore() + "'" +
            ", peopleCount='" + getPeopleCount() + "'" +
            ", source='" + getSource() + "'" +
            "}";
    }
    
}
