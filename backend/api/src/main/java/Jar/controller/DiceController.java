package Jar.controller;

import Jar.dto.DiceRequest;
import Jar.dto.DiceResponse;
import Jar.dto.MapRegionDTO;
import Jar.service.DataService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dice")
public class DiceController {
    private final DataService dataService;

    public DiceController(DataService dataService) {
        this.dataService = dataService;
    }

    @PostMapping
    public DiceResponse query(@RequestBody DiceRequest req) {
        // Minimal implementation: return a mock IA response with map data matching filters
        List<MapRegionDTO> regions = dataService.listRegionsForMap();
        DiceResponse res = new DiceResponse();
        res.setRespostaIa("Resposta gerada (mock): consulta recebida: " + req.getConsulta());
        // Convert regions to simple maps
        List<Map<String, Object>> dados = regions.stream().map(r -> {
            Map<String, Object> m = new HashMap<>();
            m.put("regiao", r.getName());
            m.put("concentracao", r.getConcentration());
            m.put("cobertura_rede", r.getNetworkCoverageScore());
            return m;
        }).collect(Collectors.toList());
        res.setDados(dados);
        res.setFontes(List.of("Vísent CDRView (emulado)", "Fontes públicas (mock)"));
        return res;
    }
}
