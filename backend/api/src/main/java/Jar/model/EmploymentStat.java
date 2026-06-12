package Jar.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "employment_stat")

public class EmploymentStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "region_id")
    private Region region;

    private LocalDate periodStart;
    private LocalDate periodEnd;
    private Double employmentRate;
    private Long formalEmploymentCount;
    private Long totalPopulation;


    public EmploymentStat() {
    }

    public EmploymentStat(Long id, Region region, LocalDate periodStart, LocalDate periodEnd, Double employmentRate, Long formalEmploymentCount, Long totalPopulation) {
        this.id = id;
        this.region = region;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.employmentRate = employmentRate;
        this.formalEmploymentCount = formalEmploymentCount;
        this.totalPopulation = totalPopulation;
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

    public LocalDate getPeriodStart() {
        return this.periodStart;
    }

    public void setPeriodStart(LocalDate periodStart) {
        this.periodStart = periodStart;
    }

    public LocalDate getPeriodEnd() {
        return this.periodEnd;
    }

    public void setPeriodEnd(LocalDate periodEnd) {
        this.periodEnd = periodEnd;
    }

    public Double getEmploymentRate() {
        return this.employmentRate;
    }

    public void setEmploymentRate(Double employmentRate) {
        this.employmentRate = employmentRate;
    }

    public Long getFormalEmploymentCount() {
        return this.formalEmploymentCount;
    }

    public void setFormalEmploymentCount(Long formalEmploymentCount) {
        this.formalEmploymentCount = formalEmploymentCount;
    }

    public Long getTotalPopulation() {
        return this.totalPopulation;
    }

    public void setTotalPopulation(Long totalPopulation) {
        this.totalPopulation = totalPopulation;
    }

    public EmploymentStat id(Long id) {
        setId(id);
        return this;
    }

    public EmploymentStat region(Region region) {
        setRegion(region);
        return this;
    }

    public EmploymentStat periodStart(LocalDate periodStart) {
        setPeriodStart(periodStart);
        return this;
    }

    public EmploymentStat periodEnd(LocalDate periodEnd) {
        setPeriodEnd(periodEnd);
        return this;
    }

    public EmploymentStat employmentRate(Double employmentRate) {
        setEmploymentRate(employmentRate);
        return this;
    }

    public EmploymentStat formalEmploymentCount(Long formalEmploymentCount) {
        setFormalEmploymentCount(formalEmploymentCount);
        return this;
    }

    public EmploymentStat totalPopulation(Long totalPopulation) {
        setTotalPopulation(totalPopulation);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof EmploymentStat)) {
            return false;
        }
        EmploymentStat employmentStat = (EmploymentStat) o;
        return Objects.equals(id, employmentStat.id) && Objects.equals(region, employmentStat.region) && Objects.equals(periodStart, employmentStat.periodStart) && Objects.equals(periodEnd, employmentStat.periodEnd) && Objects.equals(employmentRate, employmentStat.employmentRate) && Objects.equals(formalEmploymentCount, employmentStat.formalEmploymentCount) && Objects.equals(totalPopulation, employmentStat.totalPopulation);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, region, periodStart, periodEnd, employmentRate, formalEmploymentCount, totalPopulation);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", region='" + getRegion() + "'" +
            ", periodStart='" + getPeriodStart() + "'" +
            ", periodEnd='" + getPeriodEnd() + "'" +
            ", employmentRate='" + getEmploymentRate() + "'" +
            ", formalEmploymentCount='" + getFormalEmploymentCount() + "'" +
            ", totalPopulation='" + getTotalPopulation() + "'" +
            "}";
    }
    
}
