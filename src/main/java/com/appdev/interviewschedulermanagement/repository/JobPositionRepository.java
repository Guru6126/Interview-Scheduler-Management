package com.appdev.interviewschedulermanagement.repository;

import com.appdev.interviewschedulermanagement.model.JobPosition;
import com.appdev.interviewschedulermanagement.enums.JobPositionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPositionRepository extends JpaRepository<JobPosition, Long> {
    List<JobPosition> findByStatus(JobPositionStatus status);
    List<JobPosition> findByDepartment(String department);
}