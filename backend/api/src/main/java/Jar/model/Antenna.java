package Jar.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "antenna")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Antenna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    private String siteName;
    private String operator;
    private String technology;
    private Double lat;
    private Double lng;
}
