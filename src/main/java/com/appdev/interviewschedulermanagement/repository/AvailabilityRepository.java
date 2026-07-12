package com.appdev.interviewschedulermanagement.repository;

import com.appdev.interviewschedulermanagement.model.Availability;
import com.appdev.interviewschedulermanagement.enums.AvailabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByInterviewerId(Long interviewerId);
    List<Availability> findByStatus(AvailabilityStatus status);
}