package Jar.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "visent_record")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
