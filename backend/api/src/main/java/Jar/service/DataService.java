package Jar.service;

import Jar.dto.MapRegionDTO;
import Jar.model.Region;
import Jar.model.VisentRecord;
import Jar.repository.RegionRepository;
import Jar.repository.VisentRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DataService {
    private final RegionRepository regionRepository;
    private final VisentRecordRepository visentRecordRepository;

    public DataService(RegionRepository regionRepository, VisentRecordRepository visentRecordRepository) {
        this.regionRepository = regionRepository;
        this.visentRecordRepository = visentRecordRepository;
    }

    public List<MapRegionDTO> listRegionsForMap() {
        List<Region> regions = regionRepository.findAll();
        return regions.stream().map(r -> {
            VisentRecord latest = visentRecordRepository.findTopByRegionIdOrderBySampleDateDesc(r.getId());
            MapRegionDTO dto = new MapRegionDTO();
            dto.setId(r.getId());
            dto.setCode(r.getCode());
            dto.setName(r.getName());
            dto.setCentroidLat(r.getCentroidLat());
            dto.setCentroidLng(r.getCentroidLng());
            if (latest != null) {
                dto.setConcentration(latest.getConcentration());
                dto.setNetworkCoverageScore(latest.getNetworkCoverageScore());
                dto.setPeopleCount(latest.getPeopleCount());
            }
            return dto;
        }).collect(Collectors.toList());
    }
}
