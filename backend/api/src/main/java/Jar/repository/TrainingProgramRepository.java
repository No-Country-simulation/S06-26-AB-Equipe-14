package Jar.repository;

import Jar.model.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {
    List<TrainingProgram> findByRegionId(Long regionId);
}
