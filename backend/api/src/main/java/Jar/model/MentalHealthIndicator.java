package Jar.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "mental_health_indicator")

public class MentalHealthIndicator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "region_id")
    private Region region;

    private String indicatorName;
    private Double value;
    private String source;
    private LocalDate measurementDate;


    public MentalHealthIndicator() {
    }

    public MentalHealthIndicator(Long id, Region region, String indicatorName, Double value, String source, LocalDate measurementDate) {
        this.id = id;
        this.region = region;
        this.indicatorName = indicatorName;
        this.value = value;
        this.source = source;
        this.measurementDate = measurementDate;
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

    public String getIndicatorName() {
        return this.indicatorName;
    }

    public void setIndicatorName(String indicatorName) {
        this.indicatorName = indicatorName;
    }

    public Double getValue() {
        return this.value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public String getSource() {
        return this.source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public LocalDate getMeasurementDate() {
        return this.measurementDate;
    }

    public void setMeasurementDate(LocalDate measurementDate) {
        this.measurementDate = measurementDate;
    }

    public MentalHealthIndicator id(Long id) {
        setId(id);
        return this;
    }

    public MentalHealthIndicator region(Region region) {
        setRegion(region);
        return this;
    }

    public MentalHealthIndicator indicatorName(String indicatorName) {
        setIndicatorName(indicatorName);
        return this;
    }

    public MentalHealthIndicator value(Double value) {
        setValue(value);
        return this;
    }

    public MentalHealthIndicator source(String source) {
        setSource(source);
        return this;
    }

    public MentalHealthIndicator measurementDate(LocalDate measurementDate) {
        setMeasurementDate(measurementDate);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof MentalHealthIndicator)) {
            return false;
        }
        MentalHealthIndicator mentalHealthIndicator = (MentalHealthIndicator) o;
        return Objects.equals(id, mentalHealthIndicator.id) && Objects.equals(region, mentalHealthIndicator.region) && Objects.equals(indicatorName, mentalHealthIndicator.indicatorName) && Objects.equals(value, mentalHealthIndicator.value) && Objects.equals(source, mentalHealthIndicator.source) && Objects.equals(measurementDate, mentalHealthIndicator.measurementDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, region, indicatorName, value, source, measurementDate);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", region='" + getRegion() + "'" +
            ", indicatorName='" + getIndicatorName() + "'" +
            ", value='" + getValue() + "'" +
            ", source='" + getSource() + "'" +
            ", measurementDate='" + getMeasurementDate() + "'" +
            "}";
    }
    
}
