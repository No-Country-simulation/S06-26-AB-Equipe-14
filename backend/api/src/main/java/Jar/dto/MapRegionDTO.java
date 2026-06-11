package Jar.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MapRegionDTO {
    private Long id;
    private String code;
    private String name;
    private Double centroidLat;
    private Double centroidLng;
    private Double concentration;
    private Double networkCoverageScore;
    private Long peopleCount;
}
