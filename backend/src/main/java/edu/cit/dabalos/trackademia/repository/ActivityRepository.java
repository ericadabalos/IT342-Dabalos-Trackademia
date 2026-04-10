package edu.cit.dabalos.trackademia.repository;

import edu.cit.dabalos.trackademia.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserEmailOrderByTimestampDesc(String userEmail);
}
