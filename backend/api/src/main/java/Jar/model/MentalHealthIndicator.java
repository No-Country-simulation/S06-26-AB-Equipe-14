package Jar.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "mental_health_indicator")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
