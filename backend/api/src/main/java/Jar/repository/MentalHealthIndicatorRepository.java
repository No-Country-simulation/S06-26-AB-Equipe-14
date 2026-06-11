package Jar.repository;

import Jar.model.MentalHealthIndicator;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MentalHealthIndicatorRepository extends JpaRepository<MentalHealthIndicator, Long> {
    List<MentalHealthIndicator> findByRegionId(Long regionId);
}
