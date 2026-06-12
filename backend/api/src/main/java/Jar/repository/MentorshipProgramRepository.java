package Jar.repository;

import Jar.model.MentorshipProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MentorshipProgramRepository extends JpaRepository<MentorshipProgram, Long> {
    List<MentorshipProgram> findByRegionId(Long regionId);
}
