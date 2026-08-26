package com.appdev.interviewschedulermanagement.repository;

import com.appdev.interviewschedulermanagement.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByCandidateId(Long candidateId);
    List<JobApplication> findByJobPositionId(Long jobPositionId);
    Optional<JobApplication> findByCandidateIdAndJobPositionId(Long candidateId, Long jobPositionId);
}