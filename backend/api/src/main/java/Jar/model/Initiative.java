package Jar.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "initiative")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Initiative {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "region_id")
    private Region region;

    private String title;
    private String description;
    private String leadContact;
}
