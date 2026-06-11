package Jar.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiceResponse {
    private String respostaIa;
    private List<Map<String, Object>> dados;
    private List<String> fontes;
}
