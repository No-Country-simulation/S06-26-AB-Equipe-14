package Jar.repository;

import Jar.model.EmploymentStat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmploymentStatRepository extends JpaRepository<EmploymentStat, Long> {
    List<EmploymentStat> findByRegionId(Long regionId);
}
