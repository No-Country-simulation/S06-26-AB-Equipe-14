package Jar.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "training_program")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    
}
