package com.appdev.interviewschedulermanagement.repository;

import com.appdev.interviewschedulermanagement.model.JobPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobPositionRepository extends JpaRepository<JobPosition, Long> {
    List<JobPosition> findByDepartment(String department);
    List<JobPosition> findByCreatorId(Long creatorId);
}