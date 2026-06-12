package Jar.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mentorship_program")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "region_id")
    private Region region;

    private String name;
    private String organization;
    private String contactInfo;
}
