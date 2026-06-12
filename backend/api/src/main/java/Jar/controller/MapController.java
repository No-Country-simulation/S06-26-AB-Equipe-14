package Jar.controller;

import Jar.dto.MapRegionDTO;
import Jar.service.DataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/map")
public class MapController {
    private final DataService dataService;

    public MapController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping
    public List<MapRegionDTO> getMap() {
        return dataService.listRegionsForMap();
    }
}
