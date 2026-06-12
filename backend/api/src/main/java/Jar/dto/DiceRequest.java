package Jar.dto;

import lombok.*;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiceRequest {
    private String consulta;
    private Map<String, String> filtros;
    private String linguagem;
}
