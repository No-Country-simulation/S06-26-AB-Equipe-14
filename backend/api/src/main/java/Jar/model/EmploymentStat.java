package Jar.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "employment_stat")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
