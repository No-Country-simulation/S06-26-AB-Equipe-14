package Jar.repository;

import Jar.model.VisentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface VisentRecordRepository extends JpaRepository<VisentRecord, Long> {
    List<VisentRecord> findByRegionIdAndSampleDateBetween(Long regionId, LocalDate start, LocalDate end);
    VisentRecord findTopByRegionIdOrderBySampleDateDesc(Long regionId);
}
